"use client";
import Can from "@/components/auth/Can";
import Tooltip from "@/components/common/Tooltip";
import type { Column } from "@/components/tables/BasicTable";
import { EyeIcon, Pencil } from "lucide-react";

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
    onView: (role: Role) => void;
    t: any; // Scoped to 'roles'
};

/**
 * Column definitions for the Roles table.
 * Decouples table configuration from UI logic for better maintainability.
 */
export const getRoleColumns = ({
    onEdit,
    onToggleStatus,
    onView,
    t,
}: Props): Column<Role>[] => [
        {
            header: t("labels.name"),
            accessor: "name" as const,
            sortable: true,
            searchable: true,
            width: "300px",
            exportable: true,
        },
        {
            header: t("labels.slug"),
            accessor: "slug" as const,
            sortable: true,
            searchable: true,
            width: "200px",
            exportable: true,
        },
        {
            header: t("labels.description"),
            accessor: "description",
            sortable: true,
            searchable: true,
            cell: (role: Role) => role.description || "-",
            width: "200px",
            exportable: true,
        },
        {
            header: t("labels.status"),
            accessor: "isActive",
            sortable: true,
            searchable: true,
            width: "50px",
            exportable: true,
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
            width: "50px",
            exportable: false,
            cell: (role: Role) => {
                const isActive = role.isActive;
                return (
                    <div className="flex items-center gap-3">
                        <Can permission="roles.view">
                            <Tooltip text={t("form.viewTitle")}>
                                <button
                                    onClick={() => onView(role)}
                                    className="text-gray-500 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                >
                                    <EyeIcon />
                                </button>
                            </Tooltip>
                        </Can>
                        <Can permission="roles.edit">
                            <Tooltip text={t("form.editTitle")}>
                                <button
                                    onClick={() => onEdit(role)}
                                    className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    <Pencil />
                                </button>
                            </Tooltip>
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
                        </Can>
                    </div>
                );
            },
        }
    ];