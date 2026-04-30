"use client";

import FormField from "@/components/form/FormField";
import Checkbox from "@/components/form/input/Checkbox";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { Role } from "../partial/columns";

type Permission = {
    id: string;
    name: string;
    module?: string;
};

type Props = {
    role?: Role | null;
    availablePermissions: Permission[];
};

/**
 * Read-only view for Role details and assigned permissions.
 */
export default function RoleDetails({
    role,
    availablePermissions,
}: Props) {
    const t = useTranslations("roles");

    const groupedPermissions = useMemo(() => availablePermissions.reduce<Record<string, Permission[]>>(
        (acc, perm) => {
            const module = perm.module ?? "general";
            if (!acc[module]) acc[module] = [];
            acc[module].push(perm);
            return acc;
        },
        {}
    ), [availablePermissions]);

    const assignedPermissions = role?.permissions || [];

    return (
        <div className="flex flex-col gap-6">
            <FormField
                label={t("form.nameLabel")}
                value={role?.name ?? ""}
                disabled
                onChange={() => { }}
            />

            <FormField
                label={t("form.slugLabel")}
                value={role?.slug ?? ""}
                disabled
                onChange={() => { }}
            />

            <FormField
                label={t("form.descriptionLabel")}
                value={role?.description ?? ""}
                textarea
                disabled
                onChange={() => { }}
            />

            <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t("form.permissionsLabel")}
                </label>

                <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                        <div
                            key={module}
                            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 p-4"
                        >
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {module}
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {perms.map((perm) => (
                                    <Checkbox
                                        key={perm.id}
                                        label={perm.name}
                                        checked={assignedPermissions.includes(perm.id)}
                                        disabled
                                        onChange={() => { }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}