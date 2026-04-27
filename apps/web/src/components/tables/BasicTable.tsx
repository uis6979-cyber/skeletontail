"use client";

import DownloadIcon from "@/icons/download.svg";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  searchable?: boolean;
  searchValue?: (row: T) => string;
  sortValue?: (row: T) => any;
  width?: string;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  showStatusFilter?: boolean;
  statusKey?: keyof T;
};

export default function BasicTable<T extends { id: string | number }>({
  data,
  columns,
  showStatusFilter = false,
  statusKey,
}: Props<T>) {
  const t = useTranslations("common");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [perPage, setPerPage] = useState(10);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  /**
   * Orchestrates the sorting state management.
   * Toggles direction if the same key is selected, otherwise defaults to ascending.
   */
  const handleSort = (key?: keyof T, sortable?: boolean) => {
    if (!key || !sortable) return;

    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    /**
     * Primary data transformation pipeline.
     * Applies global search across all searchable columns and optional status filtering.
     */
    let result = data.filter((row) => {
      const matchSearch =
        search === "" ||
        columns
          .filter((c) => c.searchable)
          .some((c) => {
            if (c.searchValue) {
              return c.searchValue(row).toLowerCase().includes(search.toLowerCase());
            }
            if (c.accessor) {
              return String(row[c.accessor]).toLowerCase().includes(search.toLowerCase());
            }
            return false;
          });

      const matchStatus =
        !showStatusFilter || !statusKey
          ? true
          : status === "all"
            ? true
            : status === "active"
              ? Boolean(row[statusKey])
              : !Boolean(row[statusKey]);

      return matchSearch && matchStatus;
    });

    // Apply client-side sorting if a sort key is active
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, status, sortKey, sortDirection, columns, showStatusFilter, statusKey]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(0, perPage);
  }, [filteredData, perPage]);

  const exportCSV = () => {
    /**
     * Generates a localized CSV asset. 
     * Implements double-quote escaping to handle fields containing commas or quotes.
     */
    const headers = columns.map((c) => c.header).join(",");
    const rows = filteredData.map((row) =>
      columns
        .map((col) => {
          if (col.accessor) {
            return `"${String(row[col.accessor] ?? "").replace(/"/g, '""')}"`;
          }
          return "";
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${t("table.defaultFilename")}.csv`;
    a.click();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {showStatusFilter && (
        <div className="px-4 pt-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="all">{t("table.statusAll")}</option>
            <option value="active">{t("status.active")}</option>
            <option value="inactive">{t("status.inactive")}</option>
          </select>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400">
            {t("table.show")}
          </span>

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="h-9 rounded-lg border border-gray-300 bg-transparent px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span className="text-gray-500 dark:text-gray-400">
            {t("table.entries")}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder={t("table.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 xl:w-[300px]"
            />
          </div>

          <Button
            size="sm"
            onClick={exportCSV}
            className="flex items-center gap-2"
          >
            {t("table.export")}
            <DownloadIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col, index) => {
                  const isActive = sortKey === col.accessor;

                  return (
                    <TableCell
                      key={index}
                      isHeader
                      onClick={() => handleSort(col.accessor, col.sortable)}
                      style={{ width: col.width }}
                      className={`px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400 ${col.sortable ? "cursor-pointer select-none" : ""
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {col.header}
                        {col.sortable && (
                          <span className="flex flex-col gap-0.5">
                            <svg
                              className={`${isActive && sortDirection === "asc"
                                ? "fill-gray-700 dark:fill-white"
                                : "fill-gray-300 dark:fill-gray-700"
                                }`}
                              width="8"
                              height="5"
                              viewBox="0 0 8 5"
                            >
                              <path d="M4.40962 0.585167C4.21057 0.300808 3.78943 0.300807 3.59038 0.585166L1.05071 4.21327C0.81874 4.54466 1.05582 5 1.46033 5H6.53967C6.94418 5 7.18126 4.54466 6.94929 4.21327L4.40962 0.585167Z" />
                            </svg>
                            <svg
                              className={`${isActive && sortDirection === "desc"
                                ? "fill-gray-700 dark:fill-white"
                                : "fill-gray-300 dark:fill-gray-700"
                                }`}
                              width="8"
                              height="5"
                              viewBox="0 0 8 5"
                            >
                              <path d="M4.40962 4.41483C4.21057 4.69919 3.78943 4.69919 3.59038 4.41483L1.05071 0.786732C0.81874 0.455343 1.05582 0 1.46033 0H6.53967C6.94418 5 7.18126 0.455342 6.94929 0.786731L4.40962 4.41483Z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{ width: col.width }}
                      className={`px-5 py-4 text-sm ${col.className ?? "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessor
                          ? (row[col.accessor] as React.ReactNode)
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t("messages.noData")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}