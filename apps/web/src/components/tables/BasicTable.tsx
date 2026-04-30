"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Pagination from "./Pagination";
import TableHeaderCell from "./TableHeaderCell";
import TableToolbar from "./TableToolbar";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  exportable?: boolean;
  exportHeader?: string;
  searchValue?: (row: T) => string;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];

  exportFileName?: string;
  exportSheetName?: string;
};

/**
 * Generic data table providing client-side searching, sorting, pagination, and XLSX export.
 */
export default function BasicTable<T extends { id: string | number }>({
  data,
  columns,
  exportFileName,
  exportSheetName,
}: Props<T>) {
  const t = useTranslations("common.table");

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  /**
   * Handles column sorting logic.
   */
  const handleSort = (key?: keyof T, sortable?: boolean) => {
    if (!key || !sortable) return;

    if (sortKey === key) {
      setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  /** Applies search filtering and sorting to the raw dataset. */
  const filteredData = useMemo(() => {
    let result = data;

    if (search) {
      result = result.filter((row) =>
        columns.some((col) => {
          if (!col.searchable || !col.accessor) return false;

          const value = col.searchValue
            ? col.searchValue(row)
            : col.accessor
              ? row[col.accessor]
              : "";

          return String(value)
            .toLowerCase()
            .includes(search.toLowerCase());
        })
      );
    }

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
  }, [data, search, sortKey, sortDirection, columns]);

  const totalPages = Math.ceil(filteredData.length / perPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, currentPage, perPage]);

  // Reset to first page when filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, perPage]);

  const startEntry = filteredData.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endEntry = Math.min(currentPage * perPage, filteredData.length);
  const totalEntries = filteredData.length;

  function formatValue(value: any) { // Formats cell values for display and export
    if (value === null || value === undefined || value === "") return "";
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  }

  /** Generates and downloads an XLSX file based on current filtered data. */
  const exportXLSX = () => {
    const exportColumns = columns.filter((c) => c.exportable !== false);

    const dataToExport = filteredData.map((row) => {
      const obj: Record<string, any> = {};

      exportColumns.forEach((col) => {
        if (!col.accessor) return;

        const key = col.exportHeader ?? col.header;
        obj[key] = row[col.accessor];
      });

      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      exportSheetName ?? t("defaultSheetName")
    );

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${exportFileName ?? t("defaultFilename")}.xlsx`);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <TableToolbar
        search={search}
        setSearch={setSearch}
        perPage={perPage}
        setPerPage={(value) => {
          setPerPage(value);
          setCurrentPage(1);
        }}
        onExport={exportXLSX}
      />

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table className="border-t border-b border-gray-200 dark:border-gray-800">
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHeaderCell
                    key={String(col.accessor || col.header)}
                    label={col.header}
                    sortable={col.sortable}
                    active={sortKey === col.accessor}
                    direction={sortDirection}
                    onClick={() => handleSort(col.accessor, col.sortable)}
                    width={col.width}
                  />
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {columns.map((col, i) => (
                    <TableCell
                      key={String(col.accessor || col.header)}
                      className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-gray-800 last:border-r-0"
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessor
                          ? formatValue(row[col.accessor])
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t border-gray-100 py-2 px-2 dark:border-gray-800">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("paginationInfo", {
                  start: startEntry,
                  end: endEntry,
                  total: totalEntries,
                })}
              </p>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}