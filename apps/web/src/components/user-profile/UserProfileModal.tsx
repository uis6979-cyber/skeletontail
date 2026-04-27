"use client";

import { getProfile, updateProfile } from "@/lib/api/profile";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

type User = {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    birthDate?: string | null;
    gender?: "male" | "female" | null;
    language?: "es" | "en" | null;
    avatarUrl?: string | null;
};

type Errors = Partial<Record<keyof User, string>>;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onUpdated?: () => void;
};

export default function UserProfileModal({ isOpen, onClose, onUpdated }: Props) {
    const t = useTranslations("profile.editModal");
    const tc = useTranslations("common");

    const [user, setUser] = useState<User | null>(null);
    const [errors, setErrors] = useState<Errors>({});

    /**
     * Synchronize local state with fresh profile data whenever modal opens
     */
    useEffect(() => {
        if (!isOpen) return;

        const fetchUser = async () => {
            try {
                const data = await getProfile();
                setUser(data);
            } catch (error) {
                console.error("Profile fetch error:", error);
            }
        };

        fetchUser();
    }, [isOpen]);

    const handleChange = (field: keyof User, value: string) => {
        setUser((prev) => ({
            ...(prev || ({} as User)),
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const validate = (): boolean => {
        if (!user) return false;

        const newErrors: Errors = {};

        if (!user.firstName?.trim()) {
            newErrors.firstName = "messages.errors.firstNameRequired";
        }
        if (!user.lastName?.trim()) {
            newErrors.lastName = "messages.errors.lastNameRequired";
        }
        if (!user.email?.trim()) {
            newErrors.email = "messages.errors.emailRequired";
        } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
            newErrors.email = "messages.errors.emailInvalid";
        }
        if (!user.phone?.trim()) {
            newErrors.phone = "messages.errors.phoneRequired";
        }
        if (!user.gender) {
            newErrors.gender = "messages.errors.genderRequired";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Persists profile changes and notifies parent components of state updates
     */
    const handleSave = async () => {
        if (!validate()) return;

        try {
            if (!user) return;

            await updateProfile({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                birthDate: user.birthDate,
                gender: user.gender,
                language: user.language,
            });

            toast.success(t("messages.success.profileUpdated"));

            await onUpdated?.();
            onClose();
        } catch (err: any) {
            const rawMessage =
                err?.response?.data?.message ||
                err?.message ||
                "messages.errors.unknownError";

            const message = rawMessage.includes(".") ? t(rawMessage as any) : rawMessage;
            toast.error(message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {t("title")}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {t("subtitle")}
                    </p>
                </div>

                <form
                    className="flex flex-col"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div className="mt-4">
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                                {t("sectionTitle")}
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>{t("labels.firstName")}</Label>
                                    <Input
                                        type="text"
                                        defaultValue={user?.firstName || ""}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-red-500">{t(errors.firstName as any)}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("labels.lastName")}</Label>
                                    <Input
                                        type="text"
                                        defaultValue={user?.lastName || ""}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-red-500">{t(errors.lastName as any)}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("labels.email")}</Label>
                                    <Input type="text" defaultValue={user?.email || ""} disabled />
                                </div>

                                <div>
                                    <Label>{t("labels.phone")}</Label>
                                    <Input
                                        type="text"
                                        defaultValue={user?.phone || ""}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500">{t(errors.phone as any)}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>{t("labels.birthDate")}</Label>
                                    <Input
                                        type="date"
                                        defaultValue={user?.birthDate ? user.birthDate.split("T")[0] : ""}
                                        onChange={(e) => handleChange("birthDate", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>{t("labels.gender")}</Label>
                                    <select
                                        className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
                                        value={user?.gender || ""}
                                        onChange={(e) => handleChange("gender", e.target.value)}
                                    >
                                        <option value="">{t("placeholders.gender")}</option>
                                        <option value="male">{t("genders.male")}</option>
                                        <option value="female">{t("genders.female")}</option>
                                    </select>

                                    {errors.gender && (
                                        <p className="text-xs text-red-500">{t(errors.gender as any)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" type="button" onClick={onClose}>
                            {tc("buttons.close")}
                        </Button>

                        <Button size="sm" type="submit">
                            {tc("buttons.save")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}