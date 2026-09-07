"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DayScrollerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i),
  label: new Date(2000, i, 1).toLocaleString("default", { month: "short" }),
  fullLabel: new Date(2000, i, 1).toLocaleString("default", { month: "long" }),
}));

const DayScroller: React.FC<DayScrollerProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [centerDateStr, setCenterDateStr] = useState(selectedDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  // Parse center Date
  const centerDateObj = useMemo(() => {
    const [y, m, d] = (centerDateStr || todayStr).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }, [centerDateStr, todayStr]);

  const currentYear = centerDateObj.getFullYear();
  const currentMonth = centerDateObj.getMonth();

  // If selectedDate changes from outside (e.g. initial URL load) and is NOT visible in the 7-day strip, center on it
  useEffect(() => {
    if (!selectedDate) return;
    const [sy, sm, sd] = selectedDate.split("-").map(Number);
    const selDate = new Date(sy, sm - 1, sd);
    const diffDays = Math.abs((selDate.getTime() - centerDateObj.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 3) {
      setCenterDateStr(selectedDate);
    }
  }, [selectedDate, centerDateObj]);

  // Generate 7 days strip centered around centerDateStr (-3 days to +3 days)
  const daysStrip = useMemo(() => {
    const strip: { dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDateObj);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${day}`;
      strip.push({
        dateStr,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: d.getDate(),
        isToday: dateStr === todayStr,
      });
    }
    return strip;
  }, [centerDateObj, todayStr]);

  const handleShiftDays = (offset: number) => {
    const d = new Date(centerDateObj);
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const newDateStr = `${y}-${m}-${day}`;
    setCenterDateStr(newDateStr);
    onSelectDate(newDateStr);
  };

  const handleMonthChange = (monthIdxStr: string) => {
    const mIdx = Number(monthIdxStr);
    const now = new Date();
    let d = 1;
    if (currentYear === now.getFullYear() && mIdx === now.getMonth()) {
      d = now.getDate();
    }
    const y = currentYear;
    const m = String(mIdx + 1).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    const newDateStr = `${y}-${m}-${day}`;
    setCenterDateStr(newDateStr);
    onSelectDate(newDateStr);
  };

  const handleYearChange = (yearStr: string) => {
    const y = Number(yearStr);
    const now = new Date();
    let mIdx = currentMonth;
    let d = 1;
    if (y === now.getFullYear() && mIdx === now.getMonth()) {
      d = now.getDate();
    }
    const m = String(mIdx + 1).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    const newDateStr = `${y}-${m}-${day}`;
    setCenterDateStr(newDateStr);
    onSelectDate(newDateStr);
  };

  const handleJumpToday = () => {
    setCenterDateStr(todayStr);
    onSelectDate(todayStr);
  };

  const handleCalendarSelect = (d: Date | undefined) => {
    if (!d) return;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const newDateStr = `${y}-${m}-${day}`;
    setCenterDateStr(newDateStr);
    onSelectDate(newDateStr);
    setCalendarOpen(false);
  };

  const isCurrentSelectionToday = selectedDate === todayStr;

  const currentYearOptions = useMemo(() => {
    const thisYear = new Date().getFullYear();
    return [thisYear - 2, thisYear - 1, thisYear, thisYear + 1];
  }, []);

  return (
    <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-3 sm:p-4 shadow-[var(--card-shadow)] space-y-3">
      {/* Top Controls: Month, Year, Custom Picker, and Today Button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Month + Year Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Select value={String(currentMonth)} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[105px] sm:w-[125px] h-8 sm:h-9 font-bold text-xs rounded-xl border-border/80 bg-secondary/40 hover:bg-secondary/70 transition-all cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border shadow-lg">
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value} className="font-semibold text-xs">
                  {m.fullLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(currentYear)} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[80px] sm:w-[95px] h-8 sm:h-9 font-bold text-xs rounded-xl border-border/80 bg-secondary/40 hover:bg-secondary/70 font-mono transition-all cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border shadow-lg font-mono">
              {currentYearOptions.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Calendar Popover Picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 sm:h-9 w-8 sm:w-9 rounded-xl border-border/80 bg-secondary/40 hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Open calendar picker"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0 rounded-2xl border-border shadow-xl">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
                onSelect={handleCalendarSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Right: Today Jump Button */}
        <Button
          variant={isCurrentSelectionToday ? "outline" : "default"}
          size="sm"
          onClick={handleJumpToday}
          disabled={isCurrentSelectionToday}
          className={cn(
            "h-8 sm:h-9 px-3 rounded-xl gap-1.5 font-bold text-xs transition-all cursor-pointer active:scale-[0.98]",
            isCurrentSelectionToday
              ? "opacity-60 border-border/80 bg-secondary/30 text-muted-foreground cursor-default"
              : "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          )}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Today</span>
        </Button>
      </div>

      {/* 7-Day Horizontal Strip with Shift Arrows */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous Week */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShiftDays(-7)}
          className="h-12 sm:h-14 w-8 sm:w-10 rounded-xl border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 transition-all cursor-pointer active:scale-95"
          title="Previous 7 days"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* 7 Day Tiles */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 min-w-0">
          {daysStrip.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onSelectDate(item.dateStr)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 sm:py-2.5 px-0 rounded-xl transition-all duration-150 border select-none min-w-0 cursor-pointer relative",
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-xs scale-[1.02] font-bold"
                    : "bg-secondary/35 hover:bg-secondary/80 border-border/60 text-foreground font-medium active:scale-98"
                )}
              >
                <span
                  className={cn(
                    "text-[9px] sm:text-[11px] uppercase font-mono tracking-wider leading-none whitespace-nowrap",
                    isSelected ? "text-primary-foreground/80 font-bold" : "text-muted-foreground"
                  )}
                >
                  {item.dayName}
                </span>
                <span className="text-sm sm:text-lg font-black font-mono mt-1 sm:mt-0.5 leading-none tabular-nums">
                  {item.dayNumber}
                </span>

                {item.isToday && (
                  <span
                    className={cn(
                      "mt-1 text-[8px] font-bold font-mono tracking-tight uppercase leading-none px-1 rounded-sm",
                      isSelected
                        ? "bg-white/20 text-primary-foreground"
                        : "text-primary"
                    )}
                  >
                    {isSelected ? "TODAY" : "•"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Next Week */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShiftDays(7)}
          className="h-12 sm:h-14 w-8 sm:w-10 rounded-xl border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 transition-all cursor-pointer active:scale-95"
          title="Next 7 days"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
};

export default DayScroller;
