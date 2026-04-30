"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createPortal } from "react-dom";

import Input from "@/components/form/input/InputField";
import { enUS, es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

/**
 * DatePickerField provides a localized calendar interface for date selection.
 * It uses createPortal to ensure the calendar overlay is not clipped by parent containers.
 */
export default function DatePickerField({
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    className = "",
}: Props) {
    const t = useTranslations("common");
    const locale = useLocale();
    const [selected, setSelected] = useState<Date | undefined>(value ? new Date(value) : undefined);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Synchronize internal state with external value updates
    useEffect(() => {
        if (value) {
            setSelected(new Date(value));
        }
    }, [value]);

    // Handle closing the picker when clicking outside both the input and the calendar portal
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            const clickedInput = inputRef.current?.contains(target);
            const clickedCalendar = calendarRef.current?.contains(target);

            if (!clickedInput && !clickedCalendar) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (date?: Date) => {
        if (disabled) return;
        setSelected(date);
        if (date && onChange) {
            onChange(date.toISOString().split("T")[0]);
        }
        setOpen(false);
    };

    const formattedValue = selected ? selected.toISOString().split("T")[0] : "";
    const dayPickerLocale = locale === "es" ? es : enUS;

    // i18n strings
    const displayPlaceholder = placeholder || t("placeholders.date");

    const getVariantClasses = () => {
        if (disabled) {
            return "text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
        }
        return "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800";
    };

    const baseClasses =
        "w-full rounded-lg border appearance-none shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30";

    const inputClasses = [
        baseClasses,
        getVariantClasses(),
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="relative w-full" ref={inputRef}>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                <Input
                    type="text"
                    defaultValue={formattedValue}
                    placeholder={displayPlaceholder}
                    error={!!error}
                    hint={error}
                    disabled={disabled}
                    onChange={() => { }}
                    className={inputClasses}
                />
            </div>

            {open && !disabled &&
                typeof window !== "undefined" &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/5 dark:bg-black/20">
                        <div
                            ref={calendarRef}
                            className="rounded-xl border bg-white p-4 shadow-xl dark:bg-gray-900 dark:border-gray-700"
                        >
                            <DayPicker
                                mode="single"
                                locale={dayPickerLocale}
                                selected={selected}
                                onSelect={handleSelect}
                                captionLayout="dropdown"
                                fromYear={1920}
                                toYear={new Date().getFullYear()}
                                showOutsideDays
                            />
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    {t("buttons.close")}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}