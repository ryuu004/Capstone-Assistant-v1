"use client";

import { useState, useEffect, useRef } from 'react';
import { useConversations } from '../context/ConversationContext.js';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiSend, FiPaperclip, FiX, FiCopy, FiCheck, FiCpu, FiFileText } from 'react-icons/fi';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const textToCopy = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return !inline && match ? (
        <div className="bg-gray-900/50 my-4 rounded-lg border border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-t-lg">
                <span className="text-xs text-gray-400">{match[1]}</span>
                <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-gray-400 hover:text-white">
                    {isCopied ? <FiCheck/> : <FiCopy/>}
                    {isCopied ? 'Copied!' : 'Copy code'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
                <code className={className} {...props}>
                    {children}
                </code>
            </pre>
        </div>
    ) : (
        <code className="bg-white/10 text-primary px-1 py-0.5 rounded-sm" {...props}>
            {children}
        </code>
    );
};

export default function ChatInterface() {
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [chatError, setChatError] = useState(null);
    
    const router = useRouter();
    const params = useParams();
    const { 
        addMessageToConversation,
        addConversation,
        getConversationById,
        fetchConversationById,
        isLoading // Get the loading state from the context
    } = useConversations();

    const currentConversationId = params.conversationId;
    const currentConversation = getConversationById(currentConversationId);
    const messages = currentConversation?.messages || [];

    const messagesEndRef = useRef(null);

    // This effect now correctly handles the race condition on page load.
    useEffect(() => {
        // We only fetch the specific conversation's messages if the main list has finished loading.
        if (currentConversationId && !isLoading) {
            fetchConversationById(currentConversationId);
        }
    }, [currentConversationId, isLoading, fetchConversationById]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() && !file) return;

        setChatError(null);
        setIsSending(true);

        const apiKey = localStorage.getItem('gemini_api_key');
        const userMessage = { role: 'user', content: input, _id: Date.now().toString() };
        if (file) userMessage.file = file;

        if (currentConversationId) {
            addMessageToConversation(currentConversationId, userMessage);
        }
        
        setInput('');
        setFile(null);

        const formData = new FormData();
        formData.append('message', input);
        if (file) formData.append('file', file);
        if (currentConversationId) {
            formData.append('conversationId', currentConversationId);
        }
        if (apiKey) formData.append('apiKey', apiKey);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                setChatError(errorData.error || 'An unexpected error occurred.');
                return;
            }

            let conversationIdToUse = currentConversationId;
            const newConversationId = res.headers.get('x-conversation-id');

            if (newConversationId && !currentConversationId) {
                conversationIdToUse = newConversationId;
                const newConvData = { _id: newConversationId, title: input.substring(0, 30), messages: [userMessage] };
                addConversation(newConvData);
                router.replace(`/chat/${newConversationId}`, { scroll: false });
            }
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let modelResponse = '';
            let modelMessage = { role: 'model', content: '', _id: (Date.now() + 1).toString() };
            
            addMessageToConversation(conversationIdToUse, modelMessage);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                modelResponse += decoder.decode(value, { stream: true });
                addMessageToConversation(conversationIdToUse, { ...modelMessage, content: modelResponse });
            }

        } catch (err) {
            console.error(err);
            setChatError('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };
    
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // The JSX part is unchanged
    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {(messages.length === 0 && !isSending) ? (
                        <div className="text-center mt-20">
                            <FiCpu className="mx-auto text-5xl text-primary/50" />
                            <h2 className="mt-6 text-2xl font-semibold text-foreground">Capstone Assistant</h2>
                            <p className="mt-2 text-muted-foreground">Start a conversation or select one from the sidebar.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`flex gap-4 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                                            <FiCpu size={18} />
                                        </div>
                                    )}
                                    <div className={`max-w-xl md:max-w-2xl px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted/50 rounded-bl-none'}`}>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{ code: CodeBlock }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                        {msg.file && <p className="text-xs mt-2 text-muted-foreground">Attachment: {msg.file.name}</p>}
                                    </div>
                                </div>
                            ))}
                            {isSending && messages[messages.length - 1]?.role === 'user' && (
                                <div className="flex gap-4 items-start justify-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                                        <FiCpu size={18} />
                                    </div>
                                    <div className="max-w-xl md:max-w-2xl px-5 py-3 rounded-2xl bg-muted/50 rounded-bl-none">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-75"></div>
                                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="px-4 sm:px-6 pb-6 pt-4 bg-background border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    {chatError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
                            {chatError}
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Ask me anything..."
                            className="w-full bg-muted/50 border border-white/10 rounded-lg p-4 pr-28 resize-none text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            rows={1}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <label htmlFor="file-upload" className="p-2 rounded-full hover:bg-white/10 cursor-pointer">
                                <FiPaperclip className="text-muted-foreground" />
                                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                            <button
                                type="submit"
                                disabled={isSending || (!input.trim() && !file)}
                                className="p-2 rounded-full bg-primary text-background disabled:bg-primary/50 disabled:cursor-not-allowed"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </form>
                    {file && (
                        <div className="mt-2 text-sm flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                            <FiFileText className="text-primary" />
                            <span className="text-muted-foreground">{file.name}</span>
                            <button onClick={() => setFile(null)} className="ml-auto text-muted-foreground hover:text-white">
                                <FiX />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}