"use client";

import { useTranslations } from "next-intl";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/**
 * Advanced client-side pagination with dynamic ranges and ellipsis.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("common.table");

  /**
   * Generates a sequence of page numbers including ellipses for skipped ranges.
   * Logic provides a sliding window around the current page for optimal navigation.
   */
  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Ensure the first page is always included
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Generate a sliding window of pages around the current selection
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Ensure the last page is always included
    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <nav
      className="flex items-center justify-center gap-0.5"
      aria-label={t("paginationLabel")}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("previous")}
        className="mr-2.5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
      >
        ‹
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-10 w-10 items-center justify-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`
              flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${currentPage === page
                ? "bg-blue-500/[0.08] text-brand-500"
                : "text-gray-700 hover:bg-blue-500/[0.08] hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500"
              }
            `}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("next")}
        className="ml-2.5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
      >
        ›
      </button>
    </nav>
  );
}