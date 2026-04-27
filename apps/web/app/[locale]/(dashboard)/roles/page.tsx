"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { useConfirm } from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTable from "@/components/tables/BasicTable";
import Button from "@/components/ui/button/Button";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getRoleColumns, type Role } from "./columns";
import { usePermissions, useRoles } from "./hooks/useRoles";
import RoleForm from "./RoleForm";
import { getRoleById, toggleRoleStatus } from "./services/roles.api";

/**
 * Management module for system roles and permission assignments.
 */
export default function RolesPage() {
    const t = useTranslations("roles");
    const tRoot = useTranslations();
    const { confirm } = useConfirm();

    const { roles, refresh } = useRoles();
    const { permissions } = usePermissions();

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [open, setOpen] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);

    /**
     * Fetches complete role data including permission relationships 
     * before initializing the edit state.
     */
    const handleEdit = useCallback(async (role: Role) => {
        try {
            setLoadingRole(true);
            const fullRole = await getRoleById(role.id);
            setSelectedRole(fullRole);
            setOpen(true);
        } catch (err) {
            console.error("Failed to load role details:", err);
            toast.error(t("messages.errors.loadFailed"));
        } finally {
            setLoadingRole(false);
        }
    }, [t]);

    const handleCreate = useCallback(() => {
        setSelectedRole(null);
        setOpen(true);
    }, []);

    const handleToggle = useCallback(
        (role: Role) => {
            confirm({
                title: t("messages.confirm.toggleTitle"),
                message: role.isActive
                    ? t("messages.confirm.disable")
                    : t("messages.confirm.enable"),
                onConfirm: async () => {
                    try {
                        await toggleRoleStatus(role.id);
                        toast.success(t("messages.success.statusChange"));
                        refresh();
                    } catch (err: any) {
                        const message = err?.message;

                        if (Array.isArray(message)) {
                            message.forEach((e: any) =>
                                toast.error(e.message.includes(".") ? tRoot(e.message) : e.message)
                            );
                        } else {
                            const errorKey = message || "messages.errors.toggleFailed";
                            toast.error(errorKey.includes(".") ? tRoot(errorKey as any) : errorKey);
                        }
                    }
                },
            });
        },
        [confirm, refresh, t, tRoot]
    );

    const columns = useMemo(
        () => getRoleColumns({ onEdit: handleEdit, onToggleStatus: handleToggle, t }),
        [handleEdit, handleToggle, t]
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageBreadcrumb items={[{ label: t("title") }]} />

            <div className="space-y-6">
                <ComponentCard
                    title={t("title")}
                    headerAction={
                        <Button
                            onClick={handleCreate}
                            startIcon={<span>+</span>}
                            size="sm"
                            disabled={loadingRole}
                        >
                            {t("labels.create")}
                        </Button>
                    }
                >
                    <BasicTable
                        data={roles}
                        columns={columns}
                        showStatusFilter
                        statusKey="isActive"
                    />
                </ComponentCard>
            </div>

            <Modal
                isOpen={open}
                title={selectedRole ? t("form.editTitle") : t("form.createTitle")}
                onClose={() => setOpen(false)}
            >
                <RoleForm
                    key={selectedRole?.id ?? "create"}
                    role={selectedRole}
                    availablePermissions={permissions}
                    onSuccess={() => {
                        setOpen(false);
                        refresh();
                    }}
                />
            </Modal>
        </div>
    );
}