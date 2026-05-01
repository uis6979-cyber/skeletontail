"use client";

import Can from "@/components/auth/Can";
import Tooltip from "@/components/common/Tooltip";
import type { Column } from "@/components/tables/BasicTable";
import { EyeIcon, Pencil, UserKeyIcon } from "lucide-react";
import type { User } from "../../../../../src/shared/types/user";

type Props = {
    onEdit: (user: User) => void;
    onView: (user: User) => void;
    onToggleStatus: (user: User) => void;
    onChangePassword: (user: User) => void;
    t: any; // Scoped to 'users'
};

/**
 * Column definitions for the Users table.
 * Decouples table configuration from UI logic for better maintainability.
 */
export const getUserColumns = ({
    onEdit,
    onView,
    onToggleStatus,
    onChangePassword,
    t,
}: Props): Column<User>[] => [
        {
            header: t("labels.fullName"),
            accessor: "firstName" as const,
            sortable: true,
            searchable: true,
            width: "300px",
            exportable: true,
            cell: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
            searchValue: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.toLowerCase(),
        },
        {
            header: t("labels.email"),
            accessor: "email" as const,
            sortable: true,
            searchable: true,
            width: "200px",
            exportable: true,
        },
        {
            header: t("labels.birthDay"),
            accessor: "birthDay",
            sortable: true,
            searchable: true,
            width: "200px",
            exportable: true,
        },
        {
            header: t("labels.phone"),
            accessor: "phone",
            sortable: true,
            searchable: true,
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
            cell: (user: User) => {
                const isActive = user.isActive;
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
            cell: (user: User) => {
                const isActive = user.isActive;
                return (
                    <div className="flex items-center gap-3">
                        <Can permission="users.view">
                            <Tooltip text={t("form.viewTitle")}>
                                <button
                                    onClick={() => onView(user)}
                                    className="text-gray-500 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                >
                                    <EyeIcon />
                                </button>
                            </Tooltip>
                        </Can>
                        <Can permission="users.edit">
                            <Tooltip text={t("form.editTitle")}>
                                <button
                                    onClick={() => onEdit(user)}
                                    className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    <Pencil />
                                </button>
                            </Tooltip>
                            <Tooltip text={t("form.changePassword")}>
                                <button
                                    onClick={() => onChangePassword(user)}
                                    className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                >
                                    <UserKeyIcon />
                                </button>
                            </Tooltip>
                            <Tooltip text={isActive ? t("messages.disable") : t("messages.enable")}>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => onToggleStatus(user)}
                                        className="peer sr-only"
                                        aria-label={isActive ? t("messages.disable") : t("messages.enable")}
                                    />
                                    <div className="h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-success-500 dark:bg-gray-700" />
                                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                                </label>
                            </Tooltip>
                        </Can>
                    </div>
                );
            },
        }
    ];