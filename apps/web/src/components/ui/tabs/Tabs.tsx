"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type TabsContextType = {
    value: string;
    setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

/**
 * Root component for managing tab state.
 */
export function Tabs({
    defaultValue,
    className = "",
    children,
}: {
    defaultValue: string;
    className?: string;
    children: ReactNode;
}) {
    const [value, setValue] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

/**
 * Navigation container for tab triggers. Implements ARIA tablist role.
 */
export function TabsList({
    className = "",
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            role="tablist"
            className={`flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Interactive tab trigger. Implements ARIA tab role.
 */
export function TabsTrigger({
    value,
    children,
    className = "",
}: {
    value: string;
    children: ReactNode;
    className?: string;
}) {
    const ctx = useContext(TabsContext);

    if (!ctx) {
        throw new Error("TabsTrigger must be used inside Tabs");
    }

    const isActive = ctx.value === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => ctx.setValue(value)}
            className={`
                px-4 py-2 text-sm font-medium transition-all
                border-b-2 -mb-px
                ${isActive
                    ? "border-brand-500 text-brand-600 dark:text-brand-400"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
                }
                ${className}
            `}
        >
            {children}
        </button>
    );
}

/**
 * Panel associated with a specific tab. Implements ARIA tabpanel role.
 */
export function TabsContent({
    value,
    children,
    className = "",
}: {
    value: string;
    children: ReactNode;
    className?: string;
}) {
    const ctx = useContext(TabsContext);

    if (!ctx) {
        throw new Error("TabsContent must be used inside Tabs");
    }

    if (ctx.value !== value) return null;

    return (
        <div role="tabpanel" className={className}>
            {children}
        </div>
    );
}