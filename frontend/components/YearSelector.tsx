"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface YearSelectorProps {
    years: string[];
    selectedYear: string;
    onSelect: (year: string) => void;
}

export function YearSelector({ years, selectedYear, onSelect }: YearSelectorProps) {
    // Sort years descending just in case
    const sortedYears = [...years].sort((a, b) => b.localeCompare(a));

    return (
        <div className="flex items-center gap-2">
            <Select value={selectedYear} onValueChange={onSelect}>
                <SelectTrigger className="w-[140px] bg-card border-input">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Year" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {sortedYears.map((year) => (
                        <SelectItem key={year} value={year} className="cursor-pointer">
                            FY {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
