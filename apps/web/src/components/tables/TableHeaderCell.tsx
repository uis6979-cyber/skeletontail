"use client";

import { useTranslations } from "next-intl";
import SortIcon from "./SortIcon";

type Props = {
    label: string;
    sortable?: boolean;
    active?: boolean;
    direction?: "asc" | "desc";
    onClick?: () => void;
    className?: string;
    width?: string;
};

/**
 * Standard header cell with sorting logic and accessibility support.
 */
export default function TableHeaderCell({
    label,
    sortable,
    active,
    direction = "asc",
    onClick,
    className = "",
    width,
}: Props) {
    const t = useTranslations("common.table");

    return (
        <th
            onClick={sortable ? onClick : undefined}
            aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : undefined}
            aria-label={sortable ? t("sortColumn", { name: label }) : undefined}
            style={width ? { width } : undefined}
            className={`
                px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400
                border-r border-gray-200 dark:border-gray-800 last:border-r-0
                ${sortable ? "cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-white/[0.02]" : ""}
                ${className}
            `}
        >
            <div className="flex items-center justify-between gap-2">
                <span>{label}</span>
                {sortable && <SortIcon active={!!active} direction={direction} />}
            </div>
        </th>
    );
}