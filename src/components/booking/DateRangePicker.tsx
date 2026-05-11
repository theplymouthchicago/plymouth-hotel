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
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        <div className="text-[10px] uppercase tracking-[0.2em] mb-1 text-plymouth-gold">
          Dates
        </div>
        <div className={`font-body text-sm ${value.from ? "" : "opacity-60"}`}>{display}</div>
      </button>

      {open && (
        <div
          className={`plymouth-daypicker absolute z-50 mt-2 left-0 p-3 sm:p-4 shadow-2xl max-w-[calc(100vw-2rem)] overflow-auto ${
            isDark
              ? "bg-plymouth-charcoal border border-plymouth-gold/30 text-white"
              : "bg-white border border-gray-200 text-plymouth-black"
          }`}
          role="dialog"
        >
          <DayPicker
            mode="range"
            numberOfMonths={isMobile ? 1 : 2}
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

      <style jsx global>{`
        .plymouth-daypicker .rdp-root {
          --rdp-accent-color: #c8a45e;
          --rdp-accent-background-color: rgba(200, 164, 94, 0.2);
          --rdp-day-height: 2.25rem;
          --rdp-day-width: 2.25rem;
          --rdp-day_button-height: 2.25rem;
          --rdp-day_button-width: 2.25rem;
          --rdp-day_button-border-radius: 0;
          --rdp-selected-border: none;
          --rdp-range_start-color: #0a0a0a;
          --rdp-range_end-color: #0a0a0a;
          --rdp-range_middle-color: inherit;
          --rdp-today-color: #c8a45e;
          --rdp-nav_button-height: 2rem;
          --rdp-nav_button-width: 2rem;
          --rdp-weekday-padding: 0.25rem;
        }
        .plymouth-daypicker .rdp-caption_label {
          font-family: var(--font-display, Georgia, serif);
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .plymouth-daypicker .rdp-weekday {
          font-size: 0.625rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.6;
          font-weight: 500;
        }
        .plymouth-daypicker .rdp-day_button {
          font-size: 0.875rem;
          transition: background 150ms;
        }
        .plymouth-daypicker .rdp-day_button:hover:not(:disabled) {
          background: rgba(200, 164, 94, 0.15);
        }
        .plymouth-daypicker .rdp-range_start .rdp-day_button,
        .plymouth-daypicker .rdp-range_end .rdp-day_button {
          background: #c8a45e;
          color: #0a0a0a;
          font-weight: 600;
        }
        .plymouth-daypicker .rdp-range_middle .rdp-day_button {
          background: rgba(200, 164, 94, 0.2);
          color: inherit;
        }
        .plymouth-daypicker .rdp-today .rdp-day_button {
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: #c8a45e;
        }
        .plymouth-daypicker .rdp-disabled .rdp-day_button {
          opacity: 0.3;
          text-decoration: line-through;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
