"use client";

import Can from "@/components/auth/Can";
import ComponentCard from "@/components/common/ComponentCard";
import { useConfirm } from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTable from "@/components/tables/BasicTable";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { handleFormError } from "@/lib/utils/handleFormError";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { usePermissions, useRoles } from "./hooks/useRoles";
import { getRoleColumns, type Role } from "./partial/columns";
import RoleDetails from "./partial/details";
import RoleForm from "./partial/form";
import { getRoleById, toggleRoleStatus } from "./services/roles.api";

/**
 * Management module for system roles and permission assignments.
 */
export default function RolesPage() {
    const t = useTranslations("roles");
    const tc = useTranslations("common");
    const tRoot = useTranslations();
    const { confirm } = useConfirm();

    const { roles, refresh } = useRoles();
    const { permissions } = usePermissions();

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [open, setOpen] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);
    const [mode, setMode] = useState<"create" | "edit" | "view">("create");
    /**
     * Fetches complete role data including permission relationships 
     * before initializing the edit state.
     */
    const handleEdit = useCallback(async (role: Role) => {
        try {
            setLoadingRole(true);
            const fullRole = await getRoleById(role.id);
            setSelectedRole(fullRole);
            setMode("edit");
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
        setMode("create");
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
                        handleFormError({
                            err,
                            tRoot,
                            tc,
                        });
                    }
                },
            });
        },
        [confirm, refresh, t, tRoot]
    );

    const handleView = useCallback(async (role: Role) => {
        try {
            setLoadingRole(true);
            const fullRole = await getRoleById(role.id);
            setSelectedRole(fullRole);
            setMode("view");
            setOpen(true);
        } catch {
            toast.error(t("messages.errors.loadFailed"));
        } finally {
            setLoadingRole(false);
        }
    }, [t]);

    const columns = useMemo(
        () =>
            getRoleColumns({
                onEdit: handleEdit,
                onToggleStatus: handleToggle,
                onView: handleView,
                t,
            }),
        [handleEdit, handleToggle, handleView, t]
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageBreadcrumb items={[{ label: t("title") }]} />

            <div className="space-y-6">
                <ComponentCard
                    title={t("title")}
                    headerAction={
                        <Can permission="roles.create">
                            <Button
                                onClick={handleCreate}
                                startIcon={<PlusIcon />}
                                size="xs"
                                disabled={loadingRole}
                            >
                                {t("labels.create")}
                            </Button>
                        </Can>
                    }
                >
                    <BasicTable
                        data={roles}
                        columns={columns}
                        exportSheetName={t("reportName")}
                        exportFileName={t("reportName")}
                    />
                </ComponentCard>
            </div >

            <Modal
                isOpen={open}
                title={
                    mode === "create"
                        ? t("form.createTitle")
                        : mode === "edit"
                            ? t("form.editTitle")
                            : t("form.viewTitle")
                }
                onClose={() => setOpen(false)}
            >
                {mode === "view" ? (
                    <RoleDetails
                        availablePermissions={permissions || []}
                        role={selectedRole}
                    />
                ) : (
                    <RoleForm
                        key={selectedRole?.id ?? "create"}
                        role={selectedRole}
                        availablePermissions={permissions || []}
                        onSuccess={() => {
                            setOpen(false);
                            refresh();
                        }}
                    />
                )}
            </Modal>
        </div >
    );
}