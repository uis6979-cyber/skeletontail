import Link from "next/link";
import React from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 mt-4 mr-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {items[items.length - 1]?.label}
      </h2>

      <nav>
        <ol className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {item.label}
                </span>
              )}

              {index < items.length - 1 && (
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;