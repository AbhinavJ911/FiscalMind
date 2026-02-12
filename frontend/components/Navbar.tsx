import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="glass border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity">
                        FiscalMind
                    </Link>
                    <div className="flex gap-6">
                        <Link
                            href="/dashboard"
                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/sectors"
                            className="text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                            Sectors
                        </Link>
                        <Link
                            href="/chat"
                            className="text-muted-foreground hover:text-accent transition-colors font-medium"
                        >
                            AI Chat
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
