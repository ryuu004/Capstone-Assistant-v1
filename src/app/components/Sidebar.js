"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useConversations } from '../context/ConversationContext';
import { FiLogOut, FiMessageSquare, FiTrash2, FiX, FiPlus } from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose, conversations, onNewConversation }) {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const { deleteConversation } = useConversations();
    const currentConversationId = params.conversationId;

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const handleConversationSelect = (id) => {
        router.push(`/chat/${id}`);
        onClose(); // Close sidebar on mobile after selection
    };

    const handleDelete = (e, convoId) => {
        e.stopPropagation(); // Prevent conversation selection when deleting
        if (window.confirm('Are you sure you want to delete this chat?')) {
            deleteConversation(convoId, currentConversationId);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={onClose}></div>
            <div className={`flex flex-col bg-card border-r border-white/10 w-64 p-4 transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex-shrink-0`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <img src="/professor.jpg" alt="Professor" className="w-8 h-8 rounded-full"/>
                        <h1 className="text-lg font-semibold text-foreground">Capstone Assistant</h1>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                        <FiX />
                    </button>
                </div>

                <button 
                    onClick={onNewConversation}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-4 text-sm font-medium text-background bg-foreground rounded-md hover:bg-foreground/90"
                >
                    <FiPlus/>
                    New Conversation
                </button>

                <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                    <p className="text-xs text-muted-foreground font-semibold px-2 mb-2">Recent Chats</p>
                    <nav className="space-y-1">
                        {conversations.map((convo) => (
                            <div
                                key={convo._id}
                                onClick={() => handleConversationSelect(convo._id)}
                                className={`group flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                                    currentConversationId === convo._id
                                        ? 'bg-accent text-foreground'
                                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                }`}
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <FiMessageSquare className="w-4 h-4 flex-shrink-0" />
                                    <span className="flex-1 truncate">{convo.title || 'New Chat'}</span>
                                </div>
                                <button onClick={(e) => handleDelete(e, convo._id)} className="p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiTrash2/>
                                </button>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="pt-4 border-t border-white/10">
                    {session?.user && (
                        <div className="flex items-center gap-3 px-2 py-2">
                            <img
                                src={session.user.image || `https://avatar.vercel.sh/${session.user.email}.png`}
                                alt={session.user.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                            </div>
                            <button onClick={handleSignOut} className="text-muted-foreground hover:text-red-500 p-2">
                                <FiLogOut />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}