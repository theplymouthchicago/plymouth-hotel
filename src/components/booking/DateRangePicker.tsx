"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";

export interface DateRangeValue {
  from?: Date;
  to?: Date;
}

interface Props {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  unavailableDates?: Date[];
  minNights?: number;
  className?: string;
  variant?: "light" | "dark";
}

export function DateRangePicker({
  value,
  onChange,
  unavailableDates = [],
  minNights = 2,
  className = "",
  variant = "dark",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const display =
    value.from && value.to
      ? `${format(value.from, "MMM d")} – ${format(value.to, "MMM d")}`
      : value.from
      ? `${format(value.from, "MMM d")} – ?`
      : "Select dates";

  const range: DateRange = { from: value.from, to: value.to };

  const isDark = variant === "dark";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left px-5 py-4 transition-colors ${
          isDark
            ? "bg-plymouth-charcoal border border-plymouth-gold/40 hover:border-plymouth-gold text-white"
            : "bg-white border border-gray-300 hover:border-plymouth-gold text-plymouth-black"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className={`text-[10px] uppercase tracking-[0.2em] mb-1 ${isDark ? "text-plymouth-gold" : "text-plymouth-gold"}`}>
          Dates
        </div>
        <div className={`font-body text-sm ${value.from ? "" : "opacity-60"}`}>{display}</div>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 left-0 p-4 shadow-2xl ${
            isDark
              ? "bg-plymouth-charcoal border border-plymouth-gold/30 text-white"
              : "bg-white border border-gray-200 text-plymouth-black"
          }`}
          role="dialog"
        >
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={(r) => {
              onChange({ from: r?.from, to: r?.to });
              if (r?.from && r?.to && !isSameDay(r.from, r.to)) setOpen(false);
            }}
            disabled={[
              { before: new Date() },
              ...unavailableDates.map((d) => ({ from: d, to: d })),
            ]}
            min={minNights}
            classNames={{
              months: "flex gap-6",
              month_caption: "flex justify-center items-center px-2 py-1 font-display text-base mb-2",
              caption_label: "font-display",
              nav: "absolute top-3 inset-x-0 flex justify-between px-2",
              button_previous: "h-8 w-8 inline-flex items-center justify-center hover:text-plymouth-gold",
              button_next: "h-8 w-8 inline-flex items-center justify-center hover:text-plymouth-gold",
              weekday: "uppercase text-[10px] tracking-[0.2em] opacity-60 font-body w-9 h-9 inline-flex items-center justify-center",
              day: "h-9 w-9 p-0 text-sm",
              day_button: "h-9 w-9 inline-flex items-center justify-center hover:bg-plymouth-gold/20 transition-colors",
              today: "underline underline-offset-4 decoration-plymouth-gold",
              selected: "bg-plymouth-gold/40",
              range_start: "[&_button]:bg-plymouth-gold [&_button]:!text-plymouth-black [&_button]:font-semibold",
              range_end: "[&_button]:bg-plymouth-gold [&_button]:!text-plymouth-black [&_button]:font-semibold",
              range_middle: "bg-plymouth-gold/20",
              disabled: "opacity-30 line-through cursor-not-allowed",
            }}
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-current/10">
            <button
              type="button"
              onClick={() => onChange({})}
              className="text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`text-xs uppercase tracking-[0.2em] px-4 py-2 ${
                isDark ? "bg-plymouth-gold text-plymouth-black hover:bg-plymouth-gold-light" : "bg-plymouth-black text-white hover:bg-plymouth-charcoal"
              }`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
