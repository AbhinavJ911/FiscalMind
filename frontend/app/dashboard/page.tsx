"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { YearSelector } from "@/components/YearSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface BudgetData {
    year: string
    total_expenditure: number
    total_receipts: number
    fiscal_deficit: number
    inflation_rate?: number
    usd_inr_rate?: number
    gdp_growth?: number
}

export default function Dashboard() {
    const [allData, setAllData] = useState<BudgetData[]>([])
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        fetch(`${apiUrl}/api/budget`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setAllData(data)
                    // Default to latest year
                    setSelectedYear(data[data.length - 1].year)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch budget data", err)
                setLoading(false)
            })
    }, [])

    const currentYearData = allData.find(d => d.year === selectedYear)
    const years = allData.map(d => d.year)

    // Calculate growth from previous year
    const prevYearData = allData.find(d => {
        const currentIdx = allData.findIndex(x => x.year === selectedYear)
        return currentIdx > 0 ? d.year === allData[currentIdx - 1].year : false
    })

    const expGrowth = prevYearData
        ? ((currentYearData!.total_expenditure - prevYearData.total_expenditure) / prevYearData.total_expenditure * 100).toFixed(1)
        : null

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-gradient">Union Budget Dashboard</h1>
                    {years.length > 0 && (
                        <YearSelector
                            years={years}
                            selectedYear={selectedYear}
                            onSelect={setSelectedYear}
                        />
                    )}
                </div>

                {loading ? (
                    <p className="text-muted-foreground">Loading budget data...</p>
                ) : !currentYearData ? (
                    <p className="text-muted-foreground">No data available</p>
                ) : (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="glass-card border-primary/20">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenditure</CardTitle>
                                    <DollarSign className="h-5 w-5 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-primary">₹ {currentYearData.total_expenditure.toLocaleString()} Cr</div>
                                    {expGrowth && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            {parseFloat(expGrowth) > 0 ? <TrendingUp className="h-3 w-3 text-green-400" /> : <TrendingDown className="h-3 w-3 text-red-400" />}
                                            {expGrowth}% from previous year
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-accent/20">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Receipts</CardTitle>
                                    <DollarSign className="h-5 w-5 text-accent" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-accent">₹ {currentYearData.total_receipts.toLocaleString()} Cr</div>
                                    <p className="text-xs text-muted-foreground mt-1">Revenue collected</p>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-red-500/20">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Fiscal Deficit</CardTitle>
                                    <TrendingDown className="h-5 w-5 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-red-500">{currentYearData.fiscal_deficit}%</div>
                                    <p className="text-xs text-muted-foreground mt-1">Of GDP</p>
                                </CardContent>
                            </Card>
                            {currentYearData.inflation_rate && (
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Inflation Rate</CardTitle>
                                        <TrendingUp className="h-5 w-5 text-orange-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-orange-500">{currentYearData.inflation_rate}%</div>
                                        <p className="text-xs text-muted-foreground mt-1">CPI-based</p>
                                    </CardContent>
                                </Card>
                            )}
                            {currentYearData.usd_inr_rate && (
                                <Card className="glass-card border-green-500/20">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">USD/INR Rate</CardTitle>
                                        <DollarSign className="h-5 w-5 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-500">₹{currentYearData.usd_inr_rate}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Average for the year</p>
                                    </CardContent>
                                </Card>
                            )}
                            {currentYearData.gdp_growth && (
                                <Card className="glass-card border-blue-500/20">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">GDP Growth</CardTitle>
                                        <TrendingUp className="h-5 w-5 text-blue-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-blue-500">{currentYearData.gdp_growth}%</div>
                                        <p className="text-xs text-muted-foreground mt-1">Real GDP growth</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Multi-Year Trend Chart */}
                        <Card className="glass-card col-span-full">
                            <CardHeader>
                                <CardTitle className="text-xl text-gradient">Budget Trends (Last 20 Years)</CardTitle>
                                <p className="text-sm text-muted-foreground">Expenditure vs Receipts over time</p>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={allData}>
                                        <XAxis
                                            dataKey="year"
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                                borderRadius: '8px',
                                                color: '#f8fafc'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ color: '#f8fafc' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="total_expenditure"
                                            stroke="#fbbf24"
                                            strokeWidth={2}
                                            name="Expenditure"
                                            dot={{ fill: '#fbbf24', r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total_receipts"
                                            stroke="#38bdf8"
                                            strokeWidth={2}
                                            name="Receipts"
                                            dot={{ fill: '#38bdf8', r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    )
}
