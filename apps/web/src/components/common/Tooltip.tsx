"use client";

import { ReactNode } from "react";

interface TooltipProps {
    /** The localized text content to display within the tooltip */
    text: string;
    /** The trigger element that activates the tooltip on hover */
    children: ReactNode;
}

/**
 * A lightweight, CSS-based tooltip component that appears on hover.
 */
export default function Tooltip({ text, children }: TooltipProps) {
    return (
        <div className="group relative inline-block">
            {children}

            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max -translate-x-1/2 scale-95 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 dark:bg-gray-700">
                {text}
            </div>
        </div>
    );
}