"use client"

import { Search, Bell, HelpCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUI } from "@/context/UIContext"
import { useState } from "react"

export function Header() {
    const { toggleSidebar } = useUI()
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Simple search: redirect to sectors page
            window.location.href = '/sectors'
        }
    }

    const handleHelp = () => {
        alert("Help & Support\n\nNavigation:\n- Dashboard: Overview of budget data\n- Sector Analysis: View detailed sector allocations\n- AI Assistant: Chat with AI for insights\n- Trends: Historical budget trends\n\nFor more support, contact support@fiscalmind.gov.in")
    }

    const handleNotifications = () => {
        alert("Notifications\n\n• New budget data for FY 2024-25 available\n• Data accuracy updates completed\n\nYou're all caught up!")
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b border-border bg-background/80 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-1 items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="text-muted-foreground hover:text-foreground"
                    title="Toggle Sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search data, sectors, or reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-muted/50 px-9 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </form>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleHelp}
                    className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Help & Support"
                >
                    <HelpCircle className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNotifications}
                    className="relative rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                </Button>
            </div>
        </header>
    )
}
