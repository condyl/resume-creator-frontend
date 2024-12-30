import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MonthPicker } from "@/components/month-picker";

interface MonthPickerPopoverProps {
    placeholderText?: string;
    showPresent?: boolean;
    onDateChange?: (date: Date | "Present") => void;
    value?: string;
}

export default function MonthPickerPopover({
    placeholderText = "Pick a month",
    showPresent = false,
    onDateChange,
    value,
}: MonthPickerPopoverProps) {
    const [date, setDate] = React.useState<string | null>(value || null);

    // Update local state when value prop changes
    React.useEffect(() => {
        if (value !== undefined) {
            setDate(value);
        }
    }, [value]);

    const handleDateSelect = (date: Date | "Present") => {
        const formattedDate = date === "Present" ? "Present" : date.toISOString();
        setDate(formattedDate);
        if (onDateChange) onDateChange(date);
    };

    const displayValue = React.useMemo(() => {
        if (!date) return null;
        return date === "Present" ? "Present" : format(new Date(date), "MMM yyyy");
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-[280px] justify-start text-left font-normal", !displayValue && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayValue || <span>{placeholderText}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <MonthPicker
                    onMonthSelect={handleDateSelect}
                    selectedMonth={date && date !== "Present" ? new Date(date) : undefined}
                    showPresent={showPresent}
                />
            </PopoverContent>
        </Popover>
    );
}
