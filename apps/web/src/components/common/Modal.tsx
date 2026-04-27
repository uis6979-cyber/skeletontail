"use client";

import { useTranslations } from "next-intl";
import { ReactNode, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

/**
 * Accessible Modal component with keyboard navigation and scroll locking.
 */
export default function Modal({ isOpen, title, onClose, children, className }: ModalProps) {
    const t = useTranslations("common");

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`relative w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-gray-900 lg:p-10 ${className || "max-w-lg"
                    }`}
                role="dialog"
                aria-modal="true"
            >
                {title && (
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                            aria-label={t("buttons.close")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}