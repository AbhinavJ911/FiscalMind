"use client"

import { useState, useEffect } from "react"
import { KPICard } from "@/components/ui/KPICard"
import { ChartCard } from "@/components/ui/ChartCard"
import { TrendingUp, TrendingDown, IndianRupee, Percent, DollarSign, Activity, Users, Briefcase } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell } from "recharts"

// Government periods
const GOVERNMENTS = [
    { name: "UPA I", party: "Congress", start: "2004", end: "2009", color: "#0052A5", pm: "Dr. Manmohan Singh" },
    { name: "UPA II", party: "Congress", start: "2009", end: "2014", color: "#0052A5", pm: "Dr. Manmohan Singh" },
    { name: "NDA II", party: "BJP", start: "2014", end: "2019", color: "#FF9933", pm: "Narendra Modi" },
    { name: "NDA III", party: "BJP", start: "2019", end: "2024", color: "#FF9933", pm: "Narendra Modi" }
]

function getGovernment(year: string) {
    return GOVERNMENTS.find(g => year >= g.start && year <= g.end) || GOVERNMENTS[GOVERNMENTS.length - 1]
}

export default function TrendsPage() {
    const [budgets, setBudgets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        fetch(`${apiUrl}/api/budget`)
            .then(res => res.json())
            .then(data => {
                setBudgets(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch budget data:", err)
                setLoading(false)
            })
    }, [])

    // Transform data for charts - sorted by year
    const sortedData = [...budgets].sort((a, b) => a.year.localeCompare(b.year))

    // Add government info to each data point
    const enrichedData = sortedData.map(b => ({
        ...b,
        gov: getGovernment(b.year),
        expenditureLakh: Number((b.total_expenditure / 100000).toFixed(2)),
        receiptsLakh: Number((b.total_receipts / 100000).toFixed(2)),
        deficitLakh: Number((b.fiscal_deficit / 100000).toFixed(2))
    }))

    // BJP vs Congress comparison
    const congressData = enrichedData.filter(d => d.gov.party === "Congress")
    const bjpData = enrichedData.filter(d => d.gov.party === "BJP")

    const congressAvg = {
        expenditure: congressData.reduce((acc, d) => acc + d.total_expenditure, 0) / congressData.length / 100000,
        deficit: congressData.reduce((acc, d) => acc + d.fiscal_deficit, 0) / congressData.length / 100000,
        gdp: congressData.reduce((acc, d) => acc + (d.gdp_growth || 0), 0) / congressData.length,
        inflation: congressData.reduce((acc, d) => acc + (d.inflation_rate || 0), 0) / congressData.length
    }

    const bjpAvg = {
        expenditure: bjpData.reduce((acc, d) => acc + d.total_expenditure, 0) / bjpData.length / 100000,
        deficit: bjpData.reduce((acc, d) => acc + d.fiscal_deficit, 0) / bjpData.length / 100000,
        gdp: bjpData.reduce((acc, d) => acc + (d.gdp_growth || 0), 0) / bjpData.length,
        inflation: bjpData.reduce((acc, d) => acc + (d.inflation_rate || 0), 0) / bjpData.length
    }

    // Sector-wise comparison
    const sectorComparison = (() => {
        const sectorNames = ["Defence", "Agriculture", "Education", "Healthcare", "Railways", "Rural Development"]
        return sectorNames.map(sectorName => {
            const congressAllocations = congressData.flatMap(d =>
                d.sectors.filter((s: any) => s.name === sectorName).map((s: any) => s.allocation)
            )
            const bjpAllocations = bjpData.flatMap(d =>
                d.sectors.filter((s: any) => s.name === sectorName).map((s: any) => s.allocation)
            )

            return {
                sector: sectorName,
                congress: congressAllocations.length ? congressAllocations.reduce((a: number, b: number) => a + b, 0) / congressAllocations.length / 1000 : 0,
                bjp: bjpAllocations.length ? bjpAllocations.reduce((a: number, b: number) => a + b, 0) / bjpAllocations.length / 1000 : 0
            }
        })
    })()

    // Calculate summary stats
    const latestBudget = sortedData[sortedData.length - 1]
    const previousBudget = sortedData[sortedData.length - 2]

    const expenditureChange = latestBudget && previousBudget
        ? ((latestBudget.total_expenditure - previousBudget.total_expenditure) / previousBudget.total_expenditure * 100).toFixed(2)
        : 0

    const deficitChange = latestBudget && previousBudget
        ? ((latestBudget.fiscal_deficit - previousBudget.fiscal_deficit) / previousBudget.fiscal_deficit * 100).toFixed(2)
        : 0

    if (loading) {
        return <div className="p-6 text-foreground">Loading trends data...</div>
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget Trends & Political Analysis</h1>
                <p className="text-muted-foreground mt-1">Historical analysis of India's Union Budget (2004-2024)</p>
            </div>

            {/* Government Timeline */}
            <ChartCard title="Government Tenure Timeline" subtitle="2004-2024">
                <div className="space-y-3">
                    {GOVERNMENTS.map((gov, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div
                                className="h-12 flex-1 rounded-lg  flex items-center justify-between px-4 text-white font-semibold shadow-md"
                                style={{ backgroundColor: gov.color }}
                            >
                                <div className="flex items-center gap-3">
                                    {gov.party === "BJP" ? (
                                        <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
                                            <span className="text-2xl">🪷</span>
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
                                            <span className="text-2xl">✋</span>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-lg">{gov.name} - {gov.party}</div>
                                        <div className="text-sm opacity-90">PM: {gov.pm}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-90">Tenure</div>
                                    <div>{gov.start} - {gov.end}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ChartCard>

            {/* BJP vs Congress Comparison KPIs */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">BJP vs Congress: Head-to-Head Comparison</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KPICard
                        title="Avg Annual Expenditure"
                        value={
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF9933" }}></span>
                                    <span className="text-lg">₹{bjpAvg.expenditure.toFixed(2)}L Cr</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#0052A5" }}></span>
                                    <span className="text-lg">₹{congressAvg.expenditure.toFixed(2)}L Cr</span>
                                </div>
                            </div>
                        }
                        icon={IndianRupee}
                        trend="neutral"
                    />
                    <KPICard
                        title="Avg Fiscal Deficit"
                        value={
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF9933" }}></span>
                                    <span className="text-lg">₹{bjpAvg.deficit.toFixed(2)}L Cr</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#0052A5" }}></span>
                                    <span className="text-lg">₹{congressAvg.deficit.toFixed(2)}L Cr</span>
                                </div>
                            </div>
                        }
                        icon={Activity}
                        trend="neutral"
                    />
                    <KPICard
                        title="Avg GDP Growth"
                        value={
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF9933" }}></span>
                                    <span className="text-lg">{bjpAvg.gdp.toFixed(2)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#0052A5" }}></span>
                                    <span className="text-lg">{congressAvg.gdp.toFixed(2)}%</span>
                                </div>
                            </div>
                        }
                        icon={TrendingUp}
                        trend={bjpAvg.gdp > congressAvg.gdp ? "up" : "down"}
                    />
                    <KPICard
                        title="Avg Inflation Rate"
                        value={
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF9933" }}></span>
                                    <span className="text-lg">{bjpAvg.inflation.toFixed(2)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "#0052A5" }}></span>
                                    <span className="text-lg">{congressAvg.inflation.toFixed(2)}%</span>
                                </div>
                            </div>
                        }
                        icon={Percent}
                        trend={bjpAvg.inflation < congressAvg.inflation ? "up" : "down"}
                    />
                </div>
            </div>

            {/* Budget Components by Government */}
            <ChartCard title="Budget Components Over Time" subtitle="Color-coded by Government">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={enrichedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: '#e5e7eb' }}
                            label={{ value: '₹ Lakh Crore', angle: -90, position: 'insideLeft', fill: '#e5e7eb' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                            }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                                            <p className="font-semibold">{data.year}</p>
                                            <p className="text-sm text-muted-foreground">{data.gov.name} ({data.gov.party})</p>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm">Expenditure: ₹{data.expenditureLakh}L Cr</p>
                                                <p className="text-sm">Receipts: ₹{data.receiptsLakh}L Cr</p>
                                                <p className="text-sm">Deficit: ₹{data.deficitLakh}L Cr</p>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="expenditureLakh"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Total Expenditure"
                            dot={(props: any) => {
                                const { dataKey, ...rest } = props
                                const gov = getGovernment(props.payload.year)
                                return <circle {...rest} fill={gov.color} r={5} stroke={gov.color} strokeWidth={2} />
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="receiptsLakh"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Total Receipts"
                            dot={(props: any) => {
                                const { dataKey, ...rest } = props
                                const gov = getGovernment(props.payload.year)
                                return <circle {...rest} fill={gov.color} r={5} stroke={gov.color} strokeWidth={2} />
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="deficitLakh"
                            stroke="#ef4444"
                            strokeWidth={3}
                            name="Fiscal Deficit"
                            dot={(props: any) => {
                                const { dataKey, ...rest } = props
                                const gov = getGovernment(props.payload.year)
                                return <circle {...rest} fill={gov.color} r={5} stroke={gov.color} strokeWidth={2} />
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Sector-wise Comparison */}
            <ChartCard title="Average Sector Allocations: BJP vs Congress" subtitle="₹ Thousand Crore">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={sectorComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="sector"
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: '#e5e7eb', fontSize: 12 }}
                            angle={-15}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: '#e5e7eb' }}
                            label={{ value: '₹ Thousand Crore', angle: -90, position: 'insideLeft', fill: '#e5e7eb' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="bjp" fill="#FF9933" name="BJP (NDA)" />
                        <Bar dataKey="congress" fill="#0052A5" name="Congress (UPA)" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Economic Indicators by Government */}
            <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="GDP Growth by Government" subtitle="Year-on-Year comparison">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={enrichedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="year"
                                stroke="hsl(var(--muted-foreground))"
                                tick={{ fill: '#e5e7eb', fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                tick={{ fill: '#e5e7eb' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="gdp_growth" name="GDP Growth (%)">
                                {enrichedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.gov.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Inflation Rate by Government" subtitle="Year-on-Year comparison">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={enrichedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="year"
                                stroke="hsl(var(--muted-foreground))"
                                tick={{ fill: '#e5e7eb', fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                tick={{ fill: '#e5e7eb' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="inflation_rate" name="Inflation Rate (%)">
                                {enrichedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.gov.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* USD/INR Exchange Rate */}
            <ChartCard title="USD/INR Exchange Rate Trends" subtitle="Currency performance across governments">
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={enrichedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="year"
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: '#e5e7eb', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: '#e5e7eb' }}
                            domain={[40, 90]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="usd_inr_rate"
                            fill="#38bdf8"
                            stroke="#38bdf8"
                            fillOpacity={0.3}
                            name="USD/INR Rate"
                        />
                        <Line
                            type="monotone"
                            dataKey="usd_inr_rate"
                            stroke="#0891b2"
                            strokeWidth={2}
                            dot={(props: any) => {
                                const { dataKey, ...rest } = props
                                const gov = getGovernment(props.payload.year)
                                return <circle {...rest} fill={gov.color} r={6} stroke="white" strokeWidth={2} />
                            }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    )
}
