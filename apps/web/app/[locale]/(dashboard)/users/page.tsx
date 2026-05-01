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
import type { User } from "../../../../src/shared/types/user";
import { useRoles, useUsers } from "./hooks/useUsers";
import ChangePasswordForm from "./partial/change-password";
import { getUserColumns } from "./partial/columns";
import UserDetails from "./partial/details";
import UserForm from "./partial/form";
import { getUserById, toggleUserStatus } from "./services/users.api";

/**
 * Management module for system users and permission assignments.
 */
export default function UsersPage() {
    const t = useTranslations("users");
    const tc = useTranslations("common");
    const tRoot = useTranslations();
    const { confirm } = useConfirm();

    const { users, refresh } = useUsers();
    const { roles } = useRoles();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [mode, setMode] = useState<"create" | "edit" | "view" | "password">("create");
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * Fetches complete role data including permission relationships 
     * before initializing the edit state.
     */
    const handleEdit = useCallback(async (user: User) => {
        try {
            setLoadingUser(true);
            const fullUser = await getUserById(user.id);
            setSelectedUser(fullUser);
            setMode("edit");
            setOpen(true);
        } catch {
            toast.error(t("messages.errors.loadFailed"));
        } finally {
            setLoadingUser(false);
        }
    }, [t]);

    const handleView = useCallback(async (user: User) => {
        try {
            setLoadingUser(true);
            const fullUser = await getUserById(user.id);
            setSelectedUser(fullUser);
            setMode("view");
            setOpen(true);
        } catch {
            toast.error(t("messages.errors.loadFailed"));
        } finally {
            setLoadingUser(false);
        }
    }, [t]);

    const handleCreate = useCallback(() => {
        setSelectedUser(null);
        setMode("create");
        setOpen(true);
    }, []);

    const handleToggle = useCallback(
        (user: User) => {
            setErrors({});
            confirm({
                title: t("messages.confirm.toggleTitle"),
                message: user.isActive
                    ? t("messages.confirm.disable")
                    : t("messages.confirm.enable"),
                onConfirm: async () => {
                    try {
                        await toggleUserStatus(user.id);
                        toast.success(t("messages.success.statusChange"));
                        refresh();
                    } catch (err: any) {
                        handleFormError({
                            err,
                            setErrors,
                            tRoot,
                            tCommon: tc,
                        });
                    }
                },
            });
        },
        [confirm, refresh, t, tRoot]
    );

    const handleChangePassword = useCallback(async (user: User) => {
        try {
            setSelectedUser(user);
            setMode("password");
            setOpen(true);
        } catch {
            toast.error(t("messages.errors.loadFailed"));
        }
    }, [t]);

    const columns = useMemo(
        () =>
            getUserColumns({
                onEdit: handleEdit,
                onToggleStatus: handleToggle,
                onView: handleView,
                onChangePassword: handleChangePassword,
                t,
            }),
        [handleEdit, handleToggle, handleView, handleChangePassword, t]
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageBreadcrumb items={[{ label: t("title") }]} />

            <div className="space-y-6">
                <ComponentCard
                    title={t("title")}
                    headerAction={
                        <Can permission="users.create">
                            <Button
                                onClick={handleCreate}
                                startIcon={<PlusIcon />}
                                size="xs"
                                disabled={loadingUser}
                            >
                                {t("labels.create")}
                            </Button>
                        </Can>
                    }
                >
                    <BasicTable
                        data={users}
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
                            : mode === "password"
                                ? t("form.changePassword")
                                : t("form.viewTitle")
                }
                onClose={() => setOpen(false)}
            >
                {mode === "view" ? (
                    <UserDetails
                        key={selectedUser?.id ?? "create"}
                        user={selectedUser}
                        availableRoles={roles}
                        onSuccess={() => {
                            setOpen(false);
                            refresh();
                        }}
                    />
                ) : mode === "password" && selectedUser ? (
                    <ChangePasswordForm
                        userId={selectedUser.id}
                        onSuccess={() => {
                            setOpen(false);
                        }}
                    />
                ) : (
                    <UserForm
                        key={selectedUser?.id ?? "create"}
                        user={selectedUser}
                        availableRoles={roles}
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