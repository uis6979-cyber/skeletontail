"use client";

import FormField from "@/components/form/FormField";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { handleFormError } from "@/lib/utils/handleFormError";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { User } from "../partial/columns";
import { createUser, updateUser } from "../services/users.api";

type Role = {
    id: string;
    name: string;
};

type Props = {
    user?: User | null;
    onSuccess: () => void;
    availableRoles: Role[];
};

/**
 * UserForm component for creating or updating user information.
 * Handles state management for profile details and role assignments.
 */
export default function UserForm({ user, onSuccess, availableRoles }: Props) {

    const t = useTranslations("users");
    const tc = useTranslations("common");
    const tRoot = useTranslations();

    const isEdit = !!user;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!user) return;
        setFirstName(user.firstName ?? "");
        setLastName(user.lastName ?? "");
        setPhone(user.phone ?? "");
        setEmail(user.email ?? "");
        setPassword("");
        setBirthDate(user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "");
        setGender(user.gender ?? "");
        setRoles(user.roles ?? []);
        setErrors({});
    }, [user]);

    /**
     * Processes the form submission for both create and update operations.
     */
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});
            if (isEdit && user) {
                const payload = {
                    firstName,
                    lastName,
                    phone,
                    email,
                    birthDate: birthDate || undefined,
                    gender,
                    roles,
                };

                await updateUser(user.id, payload);

                toast.success(t("messages.success.updateSuccess" as any));
            } else {
                const payload = {
                    firstName,
                    lastName,
                    phone,
                    email,
                    birthDate: birthDate || undefined,
                    gender,
                    roles,
                    password,
                    confirmPassword,
                };

                await createUser(payload);

                toast.success(t("messages.success.createSuccess" as any));
            }
            onSuccess();
        } catch (err: any) {
            handleFormError({
                err,
                setErrors,
                tRoot,
                tCommon: tc,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">

            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-xl font-semibold text-gray-500 dark:text-gray-300">
                            {user?.firstName?.charAt(0)?.toUpperCase() ?? "U"}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                    </span>
                </div>
            </div>

            <FormField
                label={t("form.firstNameLabel")}
                value={firstName}
                error={errors.firstName}
                onChange={(val) => setFirstName(val)}
            />

            <FormField
                label={t("form.lastNameLabel")}
                value={lastName}
                error={errors.lastName}
                onChange={(val) => setLastName(val)}
            />

            <FormField
                label={t("form.phoneLabel")}
                value={phone}
                error={errors.phone}
                onChange={(val) => setPhone(val)}
            />

            <FormField
                label={t("form.emailLabel")}
                value={email}
                error={errors.email}
                onChange={(val) => setEmail(val)}
            />

            <FormField
                label={t("form.birthDateLabel")}
                value={birthDate}
                type="date"
                error={errors.birthDate}
                onChange={(val) => setBirthDate(val)}
            />

            <FormField
                label={t("form.genderLabel")}
                value={gender}
                error={errors.gender}
                onChange={(val) => setGender(val)}
                options={[
                    { label: tc("placeholders.select"), value: "" },
                    { label: t("form.genderMale"), value: "male" },
                    { label: t("form.genderFemale"), value: "female" },
                ]}
            />

            {!isEdit && (
                <>
                    <FormField
                        label={t("form.passwordLabel")}
                        type="password"
                        value={password}
                        error={errors.password}
                        onChange={(val) => setPassword(val)}
                    />

                    <FormField
                        label={t("form.confirmPasswordLabel")}
                        type="password"
                        value={confirmPassword}
                        error={errors.confirmPassword}
                        onChange={(val) => setConfirmPassword(val)}
                    />
                </>
            )}

            <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t("form.rolesLabel")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableRoles.map((role) => (
                        <Checkbox
                            key={role.id}
                            label={role.name}
                            checked={roles.includes(role.id)}
                            onChange={(checked) => {
                                setRoles((prev) => {
                                    const cleanPrev = prev.filter((id): id is string => !!id);
                                    return checked
                                        ? Array.from(new Set([...cleanPrev, role.id]))
                                        : cleanPrev.filter((id) => id !== role.id);
                                });
                            }}
                        />
                    ))}
                </div>
            </div>

            <Button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full justify-center"
                size="xs"
            >
                {loading
                    ? tc("messages.loading")
                    : isEdit ? tc("buttons.edit") : tc("buttons.save")}
            </Button>
        </div>
    );
}