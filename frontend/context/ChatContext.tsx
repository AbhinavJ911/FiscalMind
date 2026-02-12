"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatContextType {
    messages: Message[];
    addMessage: (message: Message) => void;
    clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I am your FiscalMind AI analyst. Ask about budget allocations, sector trends, or economic policies." }
    ]);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages([{ role: 'assistant', content: "Hello! I am your FiscalMind AI analyst. Ask about budget allocations, sector trends, or economic policies." }]);
    }

    return (
        <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
