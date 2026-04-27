import React, { ReactNode } from "react";

interface ComponentCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  desc?: string;
  headerAction?: ReactNode;
}

/**
 * Reusable layout container for dashboard components, supporting optional header actions and descriptions.
 */
const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerAction,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>

          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        {headerAction && <div className="flex items-center">{headerAction}</div>}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;