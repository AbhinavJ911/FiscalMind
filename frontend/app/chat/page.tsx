"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react"
import { ChartCard } from "@/components/ui/ChartCard"
import { useChat } from "@/context/ChatContext"

export default function ChatPage() {
    const { messages, addMessage, clearMessages } = useChat();
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = { role: 'user' as const, content: input }
        addMessage(userMsg)
        setInput("")
        setLoading(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            })

            const data = await res.json()

            if (!res.ok) {
                const errorMsg = data.details || data.error || data.message || 'Failed to process request'
                addMessage({
                    role: 'assistant',
                    content: `❌ ${errorMsg}`
                })
            } else if (data.response) {
                addMessage({ role: 'assistant', content: data.response })
            } else {
                addMessage({
                    role: 'assistant',
                    content: "Sorry, I couldn't process that. The AI service didn't return a valid response."
                })
            }
        } catch (error) {
            console.error('Chat error:', error)
            addMessage({ role: 'assistant', content: "Error connecting to AI service. Please check if the backend is running." })
        }
        setLoading(false)
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            <div className="flex-1 overflow-hidden">
                <ChartCard
                    title="AI Financial Analyst"
                    className="h-full flex flex-col border-primary/20"
                    action={
                        <Button variant="ghost" size="icon" onClick={clearMessages} title="Start New Chat">
                            <RefreshCw className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                    }
                >
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[calc(100vh-20rem)] scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                                {m.role === 'assistant' && (
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-3 shadow-md ${m.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted/50 border border-border text-foreground'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                </div>
                                {m.role === 'user' && (
                                    <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start items-start gap-3">
                                <div className="h-8  w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Bot className="h-5 w-5 text-primary animate-pulse" />
                                </div>
                                <div className="bg-muted/50 border border-border rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4 animate-spin" />
                                        Analyzing budget data...
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-border bg-card/30">
                        <div className="flex gap-3">
                            <input
                                className="flex-1 bg-background border border-input rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                placeholder="Ask about budget trends, sector allocations, or schemes..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={loading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </ChartCard>
            </div>
        </div>
    )
}
