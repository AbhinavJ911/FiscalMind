"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { KPICard } from "@/components/ui/KPICard"
import { ChartCard } from "@/components/ui/ChartCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, FileText, Lightbulb, ArrowLeft, ExternalLink, IndianRupee } from "lucide-react"
import Link from "next/link"

interface Sector {
    _id: string
    name: string
    budget_year: string
    allocation: number
    description: string
    schemes: { name: string; allocation: number }[]
    policies: string[]
    sourceUrl?: string
}

export default function SectorDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [sector, setSector] = useState<Sector | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            fetch(`${apiUrl}/api/sectors/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setSector(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error("Failed to fetch sector", err)
                    setLoading(false)
                })
        }
    }, [params.id])

    const handleExplain = () => {
        router.push(`/chat?sector=${sector?.name}`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!sector) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-muted-foreground">Sector not found</p>
                <Link href="/">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div>
                <Link href={`/sectors?year=${sector.budget_year}`}>
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Analysis
                    </Button>
                </Link>
            </div>
            {/* Header / Breadcrumb */}
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{sector.name}</h1>
                        <p className="text-muted-foreground">Budget Analysis • FY {sector.budget_year}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleExplain}
                            variant="outline"
                            className="glass-panel border-primary/20 text-primary hover:bg-primary/10"
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            AI Insights
                        </Button>
                        {sector.sourceUrl && (
                            <a href={sector.sourceUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-primary text-primary-foreground">
                                    Official Report <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <KPICard
                    title="Total Allocation"
                    value={`₹${(sector.allocation || 0).toLocaleString()} Cr`}
                    icon={IndianRupee}
                    trend="neutral"
                    className="md:col-span-1"
                />
                <ChartCard title="Sector Overview" className="md:col-span-2">
                    <p className="text-muted-foreground leading-relaxed">
                        {sector.description}
                    </p>
                </ChartCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Major Schemes */}
                <ChartCard title="Major Schemes & Initiatives" description="Breakdown of key funding areas">
                    {sector.schemes && sector.schemes.length > 0 ? (
                        <div className="space-y-3 mt-4">
                            {sector.schemes.map((scheme, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-white/5 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-sm">{scheme.name}</span>
                                    </div>
                                    <span className="font-bold font-mono text-sm">₹{scheme.allocation.toLocaleString()} Cr</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground py-4">No specific scheme data available.</p>
                    )}
                </ChartCard>

                {/* Policy Focus */}
                <ChartCard title="Strategic Policy Focus" description="Government priorities for this sector">
                    {sector.policies && sector.policies.length > 0 ? (
                        <div className="space-y-4 mt-4">
                            {sector.policies.map((policy, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-balance text-muted-foreground">{policy}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground py-4">No policy data available.</p>
                    )}
                </ChartCard>
            </div>
        </div>
    )
}
