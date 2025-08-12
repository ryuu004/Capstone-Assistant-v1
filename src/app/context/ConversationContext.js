"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const ConversationContext = createContext(null);

export function useConversations() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
}

export function ConversationProvider({ children }) {
    const [conversationsById, setConversationsById] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/conversations');
            if (res.ok) {
                const conversationsList = await res.json();
                setConversationsById(prevMap => {
                    const newMap = { ...prevMap };
                    conversationsList.forEach(conv => {
                        // This prevents overwriting a conversation that has already been fetched with its messages
                        if (!newMap[conv._id] || !newMap[conv._id].messages) {
                            newMap[conv._id] = { ...newMap[conv._id], ...conv };
                        }
                    });
                    return newMap;
                });
            } else {
                setConversationsById({});
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversationsById({});
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const fetchConversationById = useCallback(async (id) => {
        if (!id) return;
        const existing = conversationsById[id];
        // Only fetch if messages are not already present
        if (existing && Array.isArray(existing.messages)) {
            return;
        }

        try {
            const res = await fetch(`/api/conversations/${id}`);
            if (res.ok) {
                const fullConversation = await res.json();
                setConversationsById(prev => ({
                    ...prev,
                    [id]: fullConversation,
                }));
            }
        } catch (error) {
            console.error(`Error fetching conversation ${id}:`, error);
        }
    }, [conversationsById]);

    const addConversation = (newConversation) => {
        setConversationsById(prev => ({
            ...prev,
            [newConversation._id]: newConversation,
        }));
    };
    
    const addMessageToConversation = useCallback((conversationId, message) => {
        setConversationsById(prev => {
            const currentConv = prev[conversationId];
            if (!currentConv) return prev;

            const messages = currentConv.messages || [];
            const msgExists = messages.some(m => m._id === message._id);
            let newMessages = msgExists 
                ? messages.map(m => m._id === message._id ? message : m)
                : [...messages, message];
            
            return {
                ...prev,
                [conversationId]: { ...currentConv, messages: newMessages },
            };
        });
    }, []);

    const getConversationById = useCallback((id) => {
        return conversationsById[id];
    }, [conversationsById]);

    const deleteConversation = async (conversationId, currentConversationId) => {
        const originalState = { ...conversationsById };
        setConversationsById(prev => {
            const newState = { ...prev };
            delete newState[conversationId];
            return newState;
        });
        
        try {
            const res = await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
            if (!res.ok) {
                setConversationsById(originalState);
                alert('Failed to delete conversation.');
            } else {
                if (conversationId === currentConversationId) {
                    router.push('/chat');
                }
            }
        } catch (error) {
            setConversationsById(originalState);
            alert('Error deleting conversation.');
        }
    };
  
    const sortedConversations = Object.values(conversationsById).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const value = {
        conversations: sortedConversations,
        isLoading,
        fetchConversations,
        fetchConversationById,
        addConversation,
        deleteConversation,
        addMessageToConversation,
        getConversationById,
    };

    return (
      <ConversationContext.Provider value={value}>
          {children}
      </ConversationContext.Provider>
  );
}