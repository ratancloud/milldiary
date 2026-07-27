"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  // We keep an independent anchor/center date so clicking days in the strip DOES NOT auto-scroll or re-center
  const [centerDateStr, setCenterDateStr] = useState(selectedDate);

  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  // Parse center Date in local/UTC
  const centerDateObj = useMemo(() => {
    const [y, m, d] = centerDateStr.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }, [centerDateStr]);

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

  return (
    <div className="rounded-2xl border border-border bg-card p-2 sm:p-3 md:p-4 shadow-sm space-y-2 sm:space-y-3">
      {/* Top Controls: Month, Year, and Today Button */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Select value={String(currentMonth)} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[95px] sm:w-[130px] h-8 sm:h-9 font-bold text-xs sm:text-sm bg-muted/30 px-2 sm:px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value} className="font-medium text-xs sm:text-sm">
                  {m.fullLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(currentYear)} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[75px] sm:w-[95px] h-8 sm:h-9 font-bold text-xs sm:text-sm bg-muted/30 font-mono px-2 sm:px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map((y) => (
                <SelectItem key={y} value={String(y)} className="font-mono text-xs sm:text-sm">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleJumpToday}
          disabled={selectedDate === todayStr}
          className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1 sm:gap-1.5 font-bold text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 shrink-0"
        >
          <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          Today
        </Button>
      </div>

      {/* 7-Day Horizontal Strip with Shift Arrows */}
      <div className="flex items-center gap-0.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShiftDays(-7)}
          className="h-10 w-6 sm:h-12 sm:w-10 rounded-lg sm:rounded-xl text-muted-foreground hover:text-foreground shrink-0 p-0"
          title="Previous 7 days"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-2 flex-1 min-w-0">
          {daysStrip.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <button
                key={item.dateStr}
                onClick={() => onSelectDate(item.dateStr)}
                className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-0 rounded-lg sm:rounded-xl transition-all border select-none min-w-0 ${isSelected
                  ? "bg-primary border-primary text-primary-foreground shadow-md scale-[1.02] font-bold"
                  : "bg-muted/30 hover:bg-muted/60 border-border/60 text-foreground font-medium"
                  }`}
              >
                <span
                  className={`text-[9px] sm:text-xs uppercase tracking-tight sm:tracking-wider leading-none whitespace-nowrap ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                >
                  {item.dayName}
                </span>
                <span className="text-xs sm:text-lg font-extrabold font-mono mt-1 sm:mt-0.5 leading-none">
                  {item.dayNumber}
                </span>
                {item.isToday && !isSelected && (
                  <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-primary mt-1"></span>
                )}
                {item.isToday && isSelected && (
                  <span className="text-[7px] sm:text-[9px] bg-primary-foreground/20 text-primary-foreground px-1 sm:px-1.5 py-0 rounded-full mt-0.5 font-bold leading-tight whitespace-nowrap tracking-tighter sm:tracking-normal">
                    TODAY
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShiftDays(7)}
          className="h-10 w-6 sm:h-12 sm:w-10 rounded-lg sm:rounded-xl text-muted-foreground hover:text-foreground shrink-0 p-0"
          title="Next 7 days"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
};

export default DayScroller;
