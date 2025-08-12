import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;

    if (!conversationId) {
        return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    try {
        await dbConnect();

        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId: session.user.id, // Ensure user can only access their own conversations
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        const messages = await Message.find({ conversationId }).sort({ createdAt: 'asc' });

        // Combine conversation details with its messages
        const fullConversation = {
            ...conversation.toObject(),
            messages,
        };

        return NextResponse.json(fullConversation, { status: 200 });

    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;

    try {
        await dbConnect();
        
        const result = await Conversation.deleteOne({ 
            _id: conversationId, 
            userId: session.user.id 
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Conversation not found or you do not have permission to delete it.' }, { status: 404 });
        }

        // Also delete associated messages
        await Message.deleteMany({ conversationId });

        return NextResponse.json({ message: 'Conversation deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}