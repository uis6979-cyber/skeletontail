"use client";

import DatePickerField from "./input/DatePickerField";
import Input from "./input/InputField";
import TextArea from "./input/TextArea";

interface Option {
    label: string;
    value: string;
}

interface FormFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    error?: string;
    onChange: (value: string) => void;
    type?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
    textarea?: boolean;
    rows?: number;
    options?: Option[];
}

/**
 * Generic form field wrapper using Input/TextArea components.
 */
export default function FormField({
    label,
    value,
    placeholder,
    error,
    onChange,
    type = "text",
    min,
    max,
    disabled = false,
    textarea = false,
    rows = 3,
    options
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

            {options ? (
                <select
                    className={baseClasses}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : textarea ? (
                <TextArea
                    className={baseClasses}
                    rows={rows}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    error={!!error}
                    hint={error}
                />
            ) : type === "date" ? (
                <DatePickerField
                    value={value}
                    className={baseClasses}
                    disabled={disabled}
                    onChange={onChange}
                />
            ) : (
                <Input
                    type={type}
                    defaultValue={value}
                    placeholder={placeholder}
                    className={baseClasses}
                    onChange={(e) => onChange(e.target.value)}
                    min={min}
                    max={max}
                    disabled={disabled}
                    error={!!error}
                    hint={error}
                />
            )}
        </div>
    );
}