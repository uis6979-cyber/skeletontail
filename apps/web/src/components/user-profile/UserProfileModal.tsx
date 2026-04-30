"use client";

import Modal from "@/components/common/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changePassword, getProfile, updateProfile } from "@/lib/api/profile";
import { Lock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormField from "../form/FormField";
import Button from "../ui/button/Button";

type Gender = "male" | "female" | "";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onUpdated?: () => void;
};

/**
 * UserProfileModal manages personal information updates and password changes.
 * It utilizes a tabbed interface for organizational clarity and handles 
 * validation errors returned from the API.
 */
export default function UserProfileModal({
    isOpen,
    onClose,
    onUpdated,
}: Props) {
    const t = useTranslations("profile.editModal");
    const tp = useTranslations("profile");
    const tc = useTranslations("common");
    const tRoot = useTranslations();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState<Gender>("");

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isOpen) return;

        const fetchUser = async () => {
            try {
                const data = await getProfile();
                setFirstName(data.firstName ?? "");
                setLastName(data.lastName ?? "");
                setEmail(data.email ?? "");
                setPhone(data.phone ?? "");
                setBirthDate(data.birthDate ? data.birthDate.split("T")[0] : "");
                setGender((data.gender as Gender) ?? "");

                setErrors({});
            } catch {
                toast.error(tp("messages.errors.fetchFailed"));
            }
        };

        fetchUser();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        setPasswords({
            current: "",
            new: "",
            confirm: "",
        });
        setErrors({});
    }, [isOpen]);

    // Clears a specific field error from the state when a user resumes typing
    const clearError = (field: string) => {
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
    };

    // Local handler for password state to ensure dynamic error clearing for validation feedback
    const handlePasswordChange = (
        field: keyof typeof passwords,
        value: string
    ) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === "current") clearError("currentPassword");
        if (field === "new") clearError("newPassword");
        if (field === "confirm") clearError("confirmPassword");
    };

    // Persists profile metadata updates
    const handleSaveProfile = async () => {
        try {
            setErrors({});

            await updateProfile({
                firstName,
                lastName,
                phone,
                birthDate,
                gender,
            });

            toast.success(t("messages.success.profileUpdated"));
            onUpdated?.();
            onClose();
        } catch (err: any) {
            if (err.type === "validation") {
                setErrors(err.fields);
                return;
            }

            toast.error(tc("messages.error"));
        }
    };

    // Persists password changes with client-side match validation
    const handleChangePassword = async () => {
        try {
            setErrors({});

            if (passwords.new !== passwords.confirm) {
                setErrors({
                    confirmPassword: t("messages.errors.passwordsDontMatch"),
                });
                return;
            }

            await changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new,
                confirmPassword: passwords.confirm,
            });

            toast.success(t("messages.success.passwordUpdated"));
            onUpdated?.();
            onClose();
        } catch (err: any) {
            if (err.type === "validation") {
                setErrors(err.fields);
                return;
            }
            const message = err?.message;
            toast.error(
                typeof message === "string"
                    ? message.includes(".")
                        ? tRoot(message)
                        : message
                    : tc("messages.error")
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("title")}
            className="max-w-[700px]"
        >
            <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User size={16} />
                        {t("tabs.profile")}
                    </TabsTrigger>

                    <TabsTrigger value="password" className="flex items-center gap-2">
                        <Lock size={16} />
                        {t("tabs.password")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <FormField
                            label={t("labels.firstName")}
                            value={firstName}
                            error={errors.firstName ? tRoot(errors.firstName) : undefined}
                            onChange={(v) => {
                                setFirstName(v);
                                clearError("firstName");
                            }}
                        />

                        <FormField
                            label={t("labels.lastName")}
                            value={lastName}
                            error={errors.lastName ? tRoot(errors.lastName) : undefined}
                            onChange={(v) => {
                                setLastName(v);
                                clearError("lastName");
                            }}
                        />

                        <FormField
                            label={t("labels.email")}
                            value={email}
                            disabled
                            onChange={() => { }}
                        />

                        <FormField
                            label={t("labels.phone")}
                            value={phone}
                            error={errors.phone ? tRoot(errors.phone) : undefined}
                            onChange={(v) => {
                                setPhone(v);
                                clearError("phone");
                            }}
                        />

                        <FormField
                            label={t("labels.birthDate")}
                            value={birthDate}
                            type="date"
                            error={errors.birthDate ? tRoot(errors.birthDate) : undefined}
                            onChange={(v) => {
                                setBirthDate(v);
                                clearError("birthDate");
                            }}
                        />

                        <FormField
                            label={t("labels.gender")}
                            value={gender}
                            error={errors.gender ? tRoot(errors.gender) : undefined}
                            onChange={(v) => {
                                setGender(v as Gender);
                                clearError("gender");
                            }}
                            options={[
                                { label: t("genders.male"), value: "male" },
                                { label: t("genders.female"), value: "female" },
                            ]}
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button onClick={handleSaveProfile}>
                            {tc("buttons.save")}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="password">
                    <div className="grid gap-4">
                        <FormField
                            label={t("labels.currentPassword")}
                            type="password"
                            value={passwords.current}
                            error={errors.currentPassword ? tRoot(errors.currentPassword) : undefined}
                            onChange={(v) =>
                                handlePasswordChange("current", v)
                            }
                        />

                        <FormField
                            label={t("labels.newPassword")}
                            type="password"
                            value={passwords.new}
                            error={errors.newPassword ? tRoot(errors.newPassword) : undefined}
                            onChange={(v) =>
                                handlePasswordChange("new", v)
                            }
                        />

                        <FormField
                            label={t("labels.confirmPassword")}
                            type="password"
                            value={passwords.confirm}
                            error={errors.confirmPassword ? tRoot(errors.confirmPassword) : undefined}
                            onChange={(v) =>
                                handlePasswordChange("confirm", v)
                            }
                        />

                        <div className="flex justify-end">
                            <Button onClick={handleChangePassword}>
                                {t("buttons.updatePassword")}
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </Modal>
    );
}