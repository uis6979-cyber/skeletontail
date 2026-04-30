"use client";

import FormField from "@/components/form/FormField";
import Checkbox from "@/components/form/input/Checkbox";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { User } from "../partial/columns";

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

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [roles, setRoles] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!user) return;

        setFirstName(user.firstName ?? "");
        setLastName(user.lastName ?? "");
        setPhone(user.phone ?? "");
        setEmail(user.email ?? "");
        setBirthDate(user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "");
        setGender(user.gender ?? "");
        setRoles(user.roles ?? []);
        setErrors({});
    }, [user]);

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
                disabled
                onChange={(val) => setFirstName(val)}
            />

            <FormField
                label={t("form.lastNameLabel")}
                value={lastName}
                error={errors.lastName}
                disabled
                onChange={(val) => setLastName(val)}
            />

            <FormField
                label={t("form.phoneLabel")}
                value={phone}
                error={errors.phone}
                disabled
                onChange={(val) => setPhone(val)}
            />

            <FormField
                label={t("form.emailLabel")}
                value={email}
                error={errors.email}
                disabled
                onChange={(val) => setPhone(val)}
            />

            <FormField
                label={t("form.birthDateLabel")}
                value={birthDate}
                type="date"
                error={errors.birthDate}
                disabled
                onChange={(val) => setBirthDate(val)}
            />

            <FormField
                label={t("form.genderLabel")}
                value={gender}
                error={errors.gender}
                disabled
                onChange={(val) => setGender(val)}
            />

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
                            disabled
                            onChange={(checked) => {
                                setRoles((prev) =>
                                    checked ? [...prev, role.id] : prev.filter((id) => id !== role.id)
                                );
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}