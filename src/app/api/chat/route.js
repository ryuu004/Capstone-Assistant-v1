import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

async function fileToGenerativePart(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType: file.type,
    },
  };
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const userInput = formData.get('message')?.toString() || "";
    const userApiKey = formData.get('apiKey')?.toString();
    let conversationId = formData.get('conversationId')?.toString();
    const file = formData.get('file');

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'No API Key provided. Please click the "API Key" button to add one.' 
      }), { status: 400 });
    }
    
    if (!userInput && !file) {
      return new Response(JSON.stringify({ error: 'Missing message or file.' }), { status: 400 });
    }

    await dbConnect();
    
    let newConversationCreated = false;
    if (!conversationId) {
      const newConversation = new Conversation({
        userId: session.user.id,
        title: userInput.substring(0, 30) || "New Chat",
        createdAt: new Date(),
      });
      await newConversation.save();
      conversationId = newConversation._id.toString();
      newConversationCreated = true;
    }

    const existingMessages = await Message.find({ conversationId }).sort({ createdAt: 'ascending' });
    const history = existingMessages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const personalityFilePath = path.join(process.cwd(), 'chatbot-personality.txt');
    let systemInstruction = 'You are a helpful AI assistant.';
    try {
      systemInstruction = await fs.readFile(personalityFilePath, 'utf-8');
    } catch(e) { /* ignore */ }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite', systemInstruction });
    
    const userMessageParts = [{ text: userInput }];
    if (file) {
        const filePart = await fileToGenerativePart(file);
        userMessageParts.push(filePart);
    }

    const contents = [...history, { role: 'user', parts: userMessageParts }];
    
    const result = await model.generateContentStream({ contents });

    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          
          const userMessageForDb = new Message({
            conversationId,
            role: 'user',
            content: userInput,
          });

          const modelMessageForDb = new Message({
            conversationId,
            role: 'model',
            content: fullResponse,
          });

          await Message.insertMany([userMessageForDb, modelMessageForDb]);

          if (newConversationCreated) {
            await Conversation.updateOne({ _id: conversationId }, { $set: { title: userInput.substring(0, 30) } });
          }

        } catch (error) {
            console.error("Error during stream or save:", error);
            controller.enqueue(new TextEncoder().encode("\n\nError processing your message."));
        } finally {
            controller.close();
        }
      },
    });

    const headers = { 'Content-Type': 'text/plain; charset=utf-8' };
    if (newConversationCreated) {
      headers['x-conversation-id'] = conversationId;
    }
    return new Response(stream, { headers });

  } catch (error) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('api key not valid') || errorMessage.includes('permission denied')) {
        return NextResponse.json({ error: 'Your API key is invalid or lacks permission.' }, { status: 401 });
    }
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}