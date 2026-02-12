"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PieChart, MessageSquare, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUI } from "@/context/UIContext"

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Sector Analysis", href: "/sectors", icon: PieChart },
    { name: "AI Assistant", href: "/chat", icon: MessageSquare },
    { name: "Trends", href: "/trends", icon: TrendingUp },
]

export function Sidebar() {
    const pathname = usePathname()
    const { sidebarOpen } = useUI()

    return (
        <div className={cn(
            "flex h-screen flex-col border-r border-border bg-card/50 text-card-foreground transition-all duration-300 overflow-hidden",
            sidebarOpen ? "w-64" : "w-0 border-r-0"
        )}>
            <div className={cn("flex h-16 items-center border-b border-border px-6 whitespace-nowrap", !sidebarOpen && "invisible")}>
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-primary text-xl font-bold">₹</span>
                    </div>
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">FiscalMind</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
