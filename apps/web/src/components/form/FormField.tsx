"use client";

interface FormFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    error?: string;
    onChange: (value: string) => void;
    textarea?: boolean;
    rows?: number;
}

/**
 * Generic form field component supporting standard inputs and textareas with error states.
 */
export default function FormField({
    label,
    value,
    placeholder,
    error,
    onChange,
    textarea = false,
    rows = 3,
}: FormFieldProps) {
    const baseClasses = `w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition dark:bg-gray-800 dark:text-white ${error
            ? "border-red-500 focus:ring-red-200 dark:border-red-500/50"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-white/10"
        }`;

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            {textarea ? (
                <textarea
                    rows={rows}
                    className={baseClasses}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    className={baseClasses}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}