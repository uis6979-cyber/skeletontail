"use client";
import Tooltip from "@/components/common/Tooltip";
import type { Column } from "@/components/tables/BasicTable";

export type Role = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    isActive: boolean;
    createdAt: string;
};

type Props = {
    onEdit: (role: Role) => void;
    onToggleStatus: (role: Role) => void;
    t: any; // Scoped to 'roles'
};

/**
 * Column definitions for the Roles table.
 * Decouples table configuration from UI logic for better maintainability.
 */
export const getRoleColumns = ({
    onEdit,
    onToggleStatus,
    t,
}: Props): Column<Role>[] => [
        {
            header: t("labels.name"),
            accessor: "name" as const,
            sortable: true,
            searchable: true,
            width: "300px",
        },
        {
            header: t("labels.slug"),
            accessor: "slug" as const,
            sortable: true,
            searchable: true,
            width: "300px",
        },
        {
            header: t("labels.description"),
            accessor: "description",
            sortable: true,
            searchable: true,
            cell: (role: Role) => role.description || "-",
            width: "300px",
        },
        {
            header: t("labels.status"),
            accessor: "isActive",
            sortable: true,
            searchable: true,
            width: "100px",
            cell: (role: Role) => {
                const isActive = role.isActive;
                return (
                    <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${isActive
                            ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500"
                            : "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500"
                            }`}
                    >
                        {isActive ? t("messages.enable") : t("messages.disable")}
                    </span>
                );
            },
        },
        {
            header: t("labels.actions"),
            sortable: false,
            searchable: false,
            width: "100px",
            cell: (role: Role) => {
                const isActive = role.isActive;
                return (
                    <div className="flex items-center gap-3">
                        {/* Edit */}
                        <Tooltip text={t("form.editTitle")}>
                            <button
                                onClick={() => onEdit(role)}
                                className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 21 21"
                                >
                                    <path d="M17.0911 3.53206C16.2124 2.65338 14.7878 2.65338 13.9091 3.53206L5.6074 11.8337C5.29899 12.1421 5.08687 12.5335 4.99684 12.9603L4.26177 16.445C4.20943 16.6931 4.286 16.9508 4.46529 17.1301C4.64458 17.3094 4.90232 17.3859 5.15042 17.3336L8.63507 16.5985C9.06184 16.5085 9.45324 16.2964 9.76165 15.988L18.0633 7.68631C18.942 6.80763 18.942 5.38301 18.0633 4.50433L17.0911 3.53206Z" />
                                </svg>
                            </button>
                        </Tooltip>

                        {/* Toggle */}
                        <Tooltip text={isActive ? t("messages.disable") : t("messages.enable")}>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => onToggleStatus(role)}
                                    className="peer sr-only"
                                    aria-label={
                                        isActive ? t("messages.disable") : t("messages.enable")
                                    }
                                />

                                {/* Track */}
                                <div className="h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-success-500 dark:bg-gray-700" />

                                {/* Thumb */}
                                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                            </label>
                        </Tooltip>
                    </div>
                );
            },
        }
    ];