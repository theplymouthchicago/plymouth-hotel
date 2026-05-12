"use client";

interface Props {
  value: number;
  onChange: (n: number) => void;
  max: number;
  variant?: "light" | "dark";
  className?: string;
}

export function GuestSelector({ value, onChange, max, variant = "dark", className = "" }: Props) {
  const isDark = variant === "dark";
  const dec = () => value > 1 && onChange(value - 1);
  const inc = () => value < max && onChange(value + 1);
  return (
    <div
      className={`px-5 py-4 ${
        isDark
          ? "bg-plymouth-charcoal border border-plymouth-gold/40 text-white"
          : "bg-white border border-gray-300 text-plymouth-black"
      } ${className}`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] mb-1 text-plymouth-gold">Guests</div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={dec}
          disabled={value <= 1}
          className="h-7 w-7 inline-flex items-center justify-center border border-current/40 hover:border-plymouth-gold disabled:opacity-30"
          aria-label="Decrease guests"
        >
          −
        </button>
        <div className="font-body text-sm">
          {value} {value === 1 ? "guest" : "guests"}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="h-7 w-7 inline-flex items-center justify-center border border-current/40 hover:border-plymouth-gold disabled:opacity-30"
          aria-label="Increase guests"
        >
          +
        </button>
      </div>
    </div>
  );
}
