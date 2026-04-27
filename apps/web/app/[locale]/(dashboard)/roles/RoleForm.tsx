"use client";

import FormField from "@/components/form/FormField";
import Button from "@/components/ui/button/Button";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Role } from "./columns";
import { createRole, updateRole } from "./services/roles.api";

type Permission = {
    id: string;
    name: string;
    module?: string;
};

type Props = {
    role?: Role | null;
    onSuccess: () => void;
    availablePermissions: Permission[];
};

export default function RoleForm({
    role,
    onSuccess,
    availablePermissions,
}: Props) {
    const t = useTranslations("roles");
    const tc = useTranslations("common");
    const tRoot = useTranslations();

    const isEdit = !!role;

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        /**
         * Synchronize internal state when the role prop changes (edit mode initialization).
         */
        if (!role) return;

        setName(role.name ?? "");
        setSlug(role.slug ?? "");
        setDescription(role.description ?? "");

        setPermissions(
            Array.isArray(role.permissions)
                ? [...role.permissions]
                : []
        );

        setErrors({});
    }, [role]);

    const groupedPermissions = useMemo(() => {
        /**
         * Groups available permissions by their module property to improve UX categorization.
         */
        return availablePermissions.reduce<Record<string, Permission[]>>(
            (acc, perm) => {
                const module = perm.module ?? "general";
                if (!acc[module]) acc[module] = [];
                acc[module].push(perm);
                return acc;
            },
            {}
        );
    }, [availablePermissions]);

    const allPermissionsFlat = useMemo(
        () => Object.values(groupedPermissions).flat(),
        [groupedPermissions]
    );

    const isAllSelected =
        allPermissionsFlat.length > 0 &&
        allPermissionsFlat.every((p) => permissions.includes(p.id));

    const toggleAll = () => {
        const allIds = allPermissionsFlat.map((p) => p.id);
        setPermissions(isAllSelected ? [] : allIds);
    };

    const isModuleSelected = (perms: Permission[]) =>
        perms.every((p) => permissions.includes(p.id));

    const toggleModule = (perms: Permission[]) => {
        const ids = perms.map((p) => p.id);

        setPermissions((prev) => {
            const allSelected = ids.every((id) => prev.includes(id));

            return allSelected
                ? prev.filter((id) => !ids.includes(id))
                : Array.from(new Set([...prev, ...ids]));
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});

            const payload = { name, slug, description, permissions };

            if (isEdit && role) {
                await updateRole(role.id, payload);
                toast.success(t("messages.success.updateSuccess"));
            } else {
                await createRole(payload);
                toast.success(t("messages.success.createSuccess"));
            }

            onSuccess();
        } catch (err: any) {
            const message = err?.message;

            if (Array.isArray(message)) {
                const fieldErrors: Record<string, string> = {};

                message.forEach((e: any) => {
                    fieldErrors[e.field] = e.message.includes(".")
                        ? tRoot(e.message)
                        : e.message;
                });

                setErrors(fieldErrors);
                return;
            }

            toast.error(
                typeof message === "string"
                    ? message.includes(".")
                        ? tRoot(message)
                        : message
                    : tc("messages.error")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <FormField
                label={t("form.nameLabel")}
                value={name}
                error={errors.name}
                onChange={(val) => setName(val)}
            />

            <FormField
                label={t("form.slugLabel")}
                value={slug}
                error={errors.slug}
                onChange={(val) => setSlug(val)}
            />

            <FormField
                label={t("form.descriptionLabel")}
                value={description}
                textarea
                error={errors.description}
                onChange={(val) => setDescription(val)}
            />

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {t("form.permissionsLabel")}
                    </label>

                    <button
                        type="button"
                        onClick={toggleAll}
                        className="text-xs font-medium text-brand-500 hover:underline"
                    >
                        {isAllSelected ? t("form.deselectAll") : t("form.selectAll")}
                    </button>
                </div>

                <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                        <div
                            key={module}
                            className="
                                rounded-xl border
                                border-gray-200 dark:border-white/10
                                bg-white dark:bg-gray-800
                                p-4
                            "
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="
                                    text-xs font-semibold uppercase tracking-wider
                                    text-gray-500 dark:text-gray-400
                                ">
                                    {module}
                                </h4>

                                <button
                                    type="button"
                                    onClick={() => toggleModule(perms)}
                                    className="text-xs text-brand-500 hover:underline"
                                >
                                    {isModuleSelected(perms)
                                        ? t("form.deselectModule")
                                        : t("form.selectModule")}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {perms.map((perm) => (
                                    <label
                                        key={perm.id}
                                        className="
                                            flex items-center gap-2 text-sm
                                            text-gray-700 dark:text-gray-300
                                            cursor-pointer
                                        "
                                    >
                                        <input
                                            type="checkbox"
                                            className="
                                                h-4 w-4 rounded
                                                border-gray-300 dark:border-white/20
                                                text-brand-500
                                                focus:ring-brand-500
                                                dark:bg-gray-700
                                            "
                                            checked={permissions.includes(perm.id)}
                                            onChange={(e) => {
                                                setPermissions((prev) =>
                                                    e.target.checked
                                                        ? [...prev, perm.id]
                                                        : prev.filter((id) => id !== perm.id)
                                                );
                                            }}
                                        />
                                        {perm.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SUBMIT */}
            <Button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full justify-center"
                size="sm"
            >
                {loading
                    ? tc("messages.loading")
                    : isEdit
                        ? tc("buttons.edit")
                        : tc("buttons.save")}
            </Button>
        </div>
    );
}