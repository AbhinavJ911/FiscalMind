"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { YearSelector } from "@/components/YearSelector"
import { KPICard } from "@/components/ui/KPICard"
import { ArrowRight, TrendingUp, Filter } from "lucide-react"

interface Sector {
    _id: string
    name: string
    budget_year: string
    allocation: number
    description: string
}

export default function SectorsPage() {
    const [allSectors, setAllSectors] = useState<Sector[]>([])
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        fetch(`${apiUrl}/api/sectors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllSectors(data)
                    // Get unique years and select latest
                    const years = [...new Set(data.map((s: Sector) => s.budget_year))].sort()

                    const urlYear = searchParams.get('year')
                    const isValidUrlYear = urlYear && years.includes(urlYear)

                    const initialYear = isValidUrlYear ? urlYear : (years.length > 0 ? years[years.length - 1] : "")

                    if (initialYear) {
                        setSelectedYear(initialYear)
                        if (initialYear !== urlYear) {
                            router.replace(`${pathname}?${createQueryString('year', initialYear)}`)
                        }
                    }
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch sectors", err)
                setLoading(false)
            })
    }, [])

    const handleYearChange = (year: string) => {
        setSelectedYear(year)
        router.push(`${pathname}?${createQueryString('year', year)}`)
    }

    const years = [...new Set(allSectors.map(s => s.budget_year))].sort()
    const filteredSectors = allSectors.filter(s => s.budget_year === selectedYear)
    const sortedSectors = [...filteredSectors].sort((a, b) => b.allocation - a.allocation)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sector Analysis</h1>
                    <p className="text-muted-foreground">Detailed breakdown of budget allocations by sector.</p>
                </div>
                {years.length > 0 && (
                    <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border">
                        <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
                        <YearSelector
                            years={years}
                            selectedYear={selectedYear}
                            onSelect={handleYearChange}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 rounded-lg bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : sortedSectors.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground">No sector data available for {selectedYear}</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedSectors.map((sector) => (
                        <Link key={sector._id} href={`/sectors/${sector._id}`}>
                            <KPICard
                                title={sector.name}
                                value={`₹${sector.allocation.toLocaleString()} Cr`}
                                icon={TrendingUp}
                                trend="neutral"
                                className="h-full hover:border-primary/50 cursor-pointer"
                                changeLabel={sector.description ? sector.description.substring(0, 60) + "..." : "Click to view details"}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
