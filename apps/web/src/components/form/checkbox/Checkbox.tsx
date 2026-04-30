"use client";


interface CheckboxProps {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * Stateless checkbox primitive with label support and standard branding styles.
 * Accessibility and dark mode compliant.
 */
export default function Checkbox({
    label,
    checked,
    onChange,
    disabled = false,
    className = "",
}: CheckboxProps) {
    const labelClasses = [
        "flex items-center gap-2 text-sm cursor-pointer transition-colors",
        disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-gray-300",
        className,
    ].filter(Boolean).join(" ");

    return (
        <label className={labelClasses}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 disabled:cursor-not-allowed dark:border-white/20 dark:bg-gray-700"
            />
            {label && <span>{label}</span>}
        </label>
    );
}