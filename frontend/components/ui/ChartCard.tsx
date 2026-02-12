import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
    title: string
    subtitle?: string
    description?: string
    children: React.ReactNode
    className?: string
    action?: React.ReactNode
}

export function ChartCard({ title, subtitle, description, children, className, action }: ChartCardProps) {
    return (
        <Card className={cn("glass-panel flex flex-col h-full", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    {subtitle && <CardDescription>{subtitle}</CardDescription>}
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                {action && <div>{action}</div>}
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                {children}
            </CardContent>
        </Card>
    )
}
