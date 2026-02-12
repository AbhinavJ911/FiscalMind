import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
    title: string
    value: React.ReactNode
    change?: number
    changeLabel?: string // e.g., "vs last year"
    icon?: React.ElementType
    trend?: "up" | "down" | "neutral"
    className?: string
}

export function KPICard({ title, value, change, changeLabel, icon: Icon, trend, className }: KPICardProps) {
    return (
        <Card className={cn("glass-panel hover:bg-card/60 transition-colors", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(change !== undefined || changeLabel) && (
                    <div className="flex items-center text-xs mt-1 space-x-2">
                        {change !== undefined && (
                            <span className={cn(
                                "flex items-center font-medium",
                                trend === "up" ? "text-success" :
                                    trend === "down" ? "text-destructive" :
                                        "text-muted-foreground"
                            )}>
                                {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3" />}
                                {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3" />}
                                {trend === "neutral" && <Minus className="mr-1 h-3 w-3" />}
                                {Math.abs(change)}%
                            </span>
                        )}
                        {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
