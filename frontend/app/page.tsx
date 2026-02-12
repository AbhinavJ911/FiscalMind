"use client"

import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { KPICard } from "@/components/ui/KPICard"
import { ChartCard } from "@/components/ui/ChartCard"
import { Button } from "@/components/ui/button"
import { YearSelector } from "@/components/YearSelector"
import { BarChart3, TrendingUp, IndianRupee, PieChart as PieChartIcon, ArrowRight, Percent, DollarSign, Activity, Download } from "lucide-react"
import Link from "next/link"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts"
import * as XLSX from 'xlsx'

function DashboardContent() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Create a query string generator
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/budget`);
        const data = await response.json();
        setBudgets(data);

        if (data && data.length > 0) {
          const sorted = [...data].sort((a: any, b: any) => b.year.localeCompare(a.year));

          // Check URL param first, otherwise default to latest
          const urlYear = searchParams.get('year');
          const isValidUrlYear = urlYear && data.some((b: any) => b.year === urlYear);

          const initialYear = isValidUrlYear ? urlYear : sorted[0].year;

          setSelectedYear(initialYear);

          // Sync URL if it wasn't set or was invalid
          if (initialYear !== urlYear) {
            router.replace(`${pathname}?${createQueryString('year', initialYear)}`);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch budget data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []); // Run once on mount

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    router.push(`${pathname}?${createQueryString('year', year)}`);
  };

  const handleDownloadReport = () => {
    if (!currentBudget) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['FiscalMind Budget Report'],
      ['Fiscal Year', selectedYear],
      ['Generated On', new Date().toLocaleDateString('en-IN')],
      [''],
      ['Financial Summary'],
      ['Total Expenditure (₹ Cr)', currentBudget.total_expenditure],
      ['Total Receipts (₹ Cr)', currentBudget.total_receipts],
      ['Fiscal Deficit (₹ Cr)', currentBudget.fiscal_deficit],
      [''],
      ['Economic Indicators'],
      ['Inflation Rate (%)', currentBudget.inflation_rate || 'N/A'],
      ['GDP Growth (%)', currentBudget.gdp_growth || 'N/A'],
      ['USD/INR Rate', currentBudget.usd_inr_rate || 'N/A'],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths for summary
    ws1['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    // Sectors Overview sheet
    if (currentBudget.sectors && currentBudget.sectors.length > 0) {
      const sectorData = currentBudget.sectors
        .sort((a: any, b: any) => (b.allocation || 0) - (a.allocation || 0))
        .map((s: any, idx: number) => ({
          'S.No': idx + 1,
          'Sector': s.name,
          'Allocation (₹ Cr)': s.allocation,
          'Description': s.description || '',
        }));
      const ws2 = XLSX.utils.json_to_sheet(sectorData);
      ws2['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 20 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws2, 'Sector Allocations');

      // Detailed Sector-wise sheet with Schemes
      const detailRows: any[][] = [
        ['SECTOR-WISE DETAILED REPORT', '', '', '', ''],
        ['Fiscal Year: ' + selectedYear, '', '', '', ''],
        [''],
        ['Sector', 'Scheme/Initiative', 'Scheme Allocation (₹ Cr)', 'Scheme Description', 'Sector Total (₹ Cr)'],
      ];

      currentBudget.sectors
        .sort((a: any, b: any) => (b.allocation || 0) - (a.allocation || 0))
        .forEach((sector: any) => {
          const schemes = sector.schemes || [];

          if (schemes.length > 0) {
            schemes.forEach((sch: any, idx: number) => {
              const schemeName = typeof sch === 'object' ? sch.name : sch;
              const schemeAlloc = typeof sch === 'object' ? (sch.allocation || 'N/A') : 'N/A';
              const schemeDesc = typeof sch === 'object' ? (sch.description || '') : '';

              detailRows.push([
                idx === 0 ? sector.name : '',
                schemeName,
                schemeAlloc,
                schemeDesc,
                idx === 0 ? sector.allocation : '',
              ]);
            });
          } else {
            detailRows.push([
              sector.name,
              'No specific schemes listed',
              '',
              sector.description || '',
              sector.allocation,
            ]);
          }
          // Add separator row
          detailRows.push(['', '', '', '', '']);
        });

      const ws3 = XLSX.utils.aoa_to_sheet(detailRows);
      ws3['!cols'] = [{ wch: 30 }, { wch: 35 }, { wch: 22 }, { wch: 50 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Sector Details');

      // Policies sheet
      const policyRows: any[][] = [
        ['SECTOR-WISE POLICIES', '', ''],
        ['Fiscal Year: ' + selectedYear, '', ''],
        [''],
        ['Sector', 'Policy/Initiative', 'Allocation (₹ Cr)'],
      ];

      currentBudget.sectors.forEach((sector: any) => {
        const policies = sector.policies || [];
        if (policies.length > 0) {
          policies.forEach((policy: any, idx: number) => {
            policyRows.push([
              idx === 0 ? sector.name : '',
              typeof policy === 'object' ? policy.name || policy : policy,
              idx === 0 ? sector.allocation : '',
            ]);
          });
          policyRows.push(['', '', '']);
        }
      });

      if (policyRows.length > 4) {
        const ws4 = XLSX.utils.aoa_to_sheet(policyRows);
        ws4['!cols'] = [{ wch: 30 }, { wch: 60 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws4, 'Policies');
      }
    }

    // Download
    XLSX.writeFile(wb, `FiscalMind_Budget_Report_${selectedYear}.xlsx`);
  };

  const currentBudget = useMemo(() => {
    return budgets.find(b => b.year === selectedYear) || null;
  }, [budgets, selectedYear]);

  // Transform data for Trend Chart (sort ascending for chart)
  const expenditureTrend = useMemo(() => {
    return [...budgets]
      .sort((a, b) => a.year.localeCompare(b.year))
      .map(b => ({
        year: b.year,
        amount: Number((b.total_expenditure / 100000).toFixed(2)) // Convert to Lakh Cr for trend
      }));
  }, [budgets]);

  // Transform data for Sector Pie Chart
  const sectorDistribution = useMemo(() => {
    if (!currentBudget || !currentBudget.sectors) return [];
    // Sort by allocation and take top 5, group others
    const sortedSectors = [...currentBudget.sectors].sort((a: any, b: any) => b.allocation - a.allocation);
    const topSectors = sortedSectors.slice(0, 5);
    const otherSectors = sortedSectors.slice(5);

    const otherAllocation = otherSectors.reduce((acc: number, curr: any) => acc + curr.allocation, 0);

    const data = topSectors.map((s: any, index: number) => ({
      name: s.name,
      value: s.allocation,
      color: [
        "#38bdf8", // Sky 400
        "#10b981", // Emerald 400
        "#f59e0b", // Amber 400
        "#8b5cf6", // Violet 400
        "#ef4444", // Red 400
      ][index % 5]
    }));

    if (otherAllocation > 0) {
      data.push({ name: "Others", value: otherAllocation, color: "#334155" });
    }
    return data;
  }, [currentBudget]);

  if (loading) {
    return <div className="p-6 text-foreground">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Overview</h1>
          <p className="text-muted-foreground mt-1">Union Budget Analysis {selectedYear}</p>
        </div>
        <div className="flex gap-3 items-center">
          <YearSelector
            years={budgets.map(b => b.year)}
            selectedYear={selectedYear}
            onSelect={handleYearChange}
          />
          <Button
            onClick={handleDownloadReport}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* KPI Grid - Row 1: Key Budget Figures */}
      <h2 className="text-lg font-semibold text-foreground/80">Key Budget Figures</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Expenditure"
          value={`₹${((currentBudget?.total_expenditure || 0) / 100000).toFixed(2)} L Cr`}
          // change={11.1} // TODO: Calculate change from previous year
          trend="up"
          changeLabel="vs prev year"
          icon={IndianRupee}
        />
        <KPICard
          title="Fiscal Deficit"
          value={`${currentBudget?.fiscal_deficit || 0}%`}
          changeLabel="of GDP"
          icon={TrendingUp} // Or a specific icon for deficit
          trend="neutral"
        />
        <KPICard
          title="Total Receipts"
          value={`₹${((currentBudget?.total_receipts || 0) / 100000).toFixed(2)} L Cr`}
          trend="up"
          changeLabel="Revenue"
          icon={PieChartIcon}
        />
        {/* Let's keep 4 items for symmetry, maybe "Top Sector" */}
        <KPICard
          title="Top Sector"
          value={sectorDistribution.length > 0 ? sectorDistribution[0].name : "N/A"}
          changeLabel={`₹${((sectorDistribution[0]?.value || 0) / 100000).toFixed(2)} L Cr`}
          icon={BarChart3}
          trend="neutral"
        />
      </div>

      {/* KPI Grid - Row 2: Economic Indicators */}
      <h2 className="text-lg font-semibold text-foreground/80">Economic Indicators</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <KPICard
          title="Inflation Rate"
          value={`${currentBudget?.inflation_rate || "N/A"}%`}
          changeLabel="check official source"
          icon={Percent}
          trend={currentBudget?.inflation_rate > 6 ? "down" : "up"} // "Bad" if high? trend arrows are usually just direction. Let's stick to neutral/up.
          className="border-l-4 border-l-yellow-500" // Visual distinction
        />
        <KPICard
          title="GDP Growth"
          value={`${currentBudget?.gdp_growth || "N/A"}%`}
          changeLabel="Real GDP"
          icon={Activity}
          trend="up"
          className="border-l-4 border-l-green-500"
        />
        <KPICard
          title="USD / INR Rate"
          value={`₹${currentBudget?.usd_inr_rate || "N/A"}`}
          changeLabel="Average Exchange Rate"
          icon={DollarSign} // Dollar icon
          trend="neutral"
          className="border-l-4 border-l-blue-500"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">

        {/* Expenditure Trend Chart */}
        <ChartCard
          title="Expenditure Trend (All Years)"
          description="Total budget allocation in Lakh Crores"
          className="col-span-4"
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenditureTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Sector Allocation Pie Chart */}
        <ChartCard
          title={`Key Allocations (${selectedYear})`}
          description="Top sectors by budget size"
          className="col-span-3"
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color as string} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: any) => `₹${(Number(value) / 100000).toFixed(2)} L Cr`}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions / Recent Sectors */}
      <div className="grid gap-4 md:grid-cols-3">
        <ChartCard title="AI Insights" className="col-span-1 border-primary/20 bg-primary/5">
          <div className="flex flex-col gap-4 h-full justify-center items-start">
            <p className="text-sm text-balance text-muted-foreground">
              Ask questions like "How has the Education budget changed over 10 years?" to get instant analysis.
            </p>
            <Link href="/chat">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Ask FiscalMind AI <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ChartCard>

        <div className="col-span-2 grid gap-4 grid-cols-2">
          {/* Example Mini Sector Cards */}
          {['Defence', 'Railways', 'Education', 'Agriculture'].map((sectorName) => {
            const sectorData = currentBudget?.sectors?.find((s: any) => s.name === sectorName);
            const linkTarget = sectorData ? `/sectors/${sectorData._id}` : '#';

            return (
              <Link href={linkTarget} key={sectorName} className={!sectorData ? "opacity-50 pointer-events-none" : ""}>
                <div className="group glass-panel rounded-lg p-4 hover:bg-card/80 transition-all cursor-pointer border border-transparent hover:border-primary/30">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{sectorName}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">View historical allocation & trends</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-6 text-foreground">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
