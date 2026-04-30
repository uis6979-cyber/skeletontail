import React, { FC, ReactNode } from "react";

/**
 * Core props for the Input component.
 */
export interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  size?: "xs" | "sm" | "md";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/**
 * Reusable Input component with icon support and validation states.
 */
const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  size = "md",
  startIcon,
  endIcon,
}) => {
  const sizeClasses = {
    xs: "h-8 text-xs",
    sm: "h-9 text-sm",
    md: "h-11 text-sm",
  };

  const getVariantClasses = () => {
    if (disabled) {
      return "text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
    if (error) {
      return "text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500";
    }
    if (success) {
      return "text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500";
    }
    return "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800";
  };

  const baseClasses =
    "w-full rounded-lg border appearance-none shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30";

  const hasLeftIcon = !!startIcon;
  const hasRightIcon = !!endIcon;

  const paddingLeft = hasLeftIcon ? "pl-10" : "";
  const paddingRight = hasRightIcon ? "pr-10" : "";

  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    getVariantClasses(),
    paddingLeft,
    paddingRight,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative w-full">
      {startIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {startIcon}
        </span>
      )}

      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={defaultValue ?? ""}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {endIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {endIcon}
        </span>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${error
            ? "text-error-500"
            : success
              ? "text-success-500"
              : "text-gray-500"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;