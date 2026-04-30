import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  size?: "xs" | "sm" | "md";
  compact?: boolean;
  label?: string;
}

/**
 * A versatile Select component supporting multiple sizes, compact layouts for tables,
 * and integrated internationalization for default placeholders.
 */
export default function Select({
  options,
  placeholder,
  onChange,
  className = "",
  defaultValue = "",
  size = "md",
  compact = false,
  label,
}: SelectProps) {
  const t = useTranslations("common.placeholders");
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  const sizeClasses = {
    xs: "h-8 px-2 text-xs pr-7",
    sm: "h-9 px-3 text-sm pr-8",
    md: "h-11 px-4 text-sm pr-10",
  };

  const selectClasses = [
    "appearance-none w-full rounded-lg border bg-transparent shadow-theme-xs transition",
    "focus:outline-none focus:ring-3",
    "dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30",
    "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10",
    "dark:border-gray-700 dark:focus:border-brand-800",
    sizeClasses[size],
    selectedValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400",
    className,
  ].filter(Boolean).join(" ");

  const selectElement = (
    <div className={`relative inline-block ${compact ? "" : "w-full"} ${className}`}>
      <select
        value={selectedValue}
        onChange={handleChange}
        className={selectClasses}
      >
        <option value="" disabled>
          {placeholder || t("select")}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        <svg className="h-4 w-4 stroke-current" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {label && <span className="text-gray-500 dark:text-gray-400">{label}</span>}
        {selectElement}
      </div>
    );
  }

  return selectElement;
}