"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import ApiKeyModal from '../components/ApiKeyModal';
import { useConversations } from '../context/ConversationContext';
import { FiMenu, FiKey } from 'react-icons/fi';

export default function ChatClientLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { conversations, fetchConversations } = useConversations();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchConversations();
        }
    }, [status, router, fetchConversations]);
    
    const handleSaveApiKey = (key) => {
        localStorage.setItem('gemini_api_key', key);
        setIsApiKeyModalOpen(false);
    };

    const handleNewConversation = () => {
        router.push('/chat');
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen bg-background text-foreground">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                conversations={conversations}
                onNewConversation={handleNewConversation}
            />
            <div className="flex-1 flex flex-col">
                <header className="bg-background border-b border-white/10 p-4 flex items-center justify-between md:justify-end z-10">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-muted-foreground hover:text-foreground md:hidden">
                        <FiMenu size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsApiKeyModalOpen(true)} 
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted/50 border border-white/10 rounded-md hover:bg-accent"
                        >
                            <FiKey />
                            <span>API Key</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
            
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
                onSave={handleSaveApiKey}
            />
        </div>
    );
}