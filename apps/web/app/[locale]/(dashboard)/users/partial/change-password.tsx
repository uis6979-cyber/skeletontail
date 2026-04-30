"use client";

import FormField from "@/components/form/FormField";
import Button from "@/components/ui/button/Button";
import { handleFormError } from "@/lib/utils/handleFormError";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";
import { changeUserPassword } from "../services/users.api";

type Props = {
    userId: string;
    onSuccess: () => void;
};

/**
 * ChangePasswordForm provides administrative capabilities to update a user's password.
 */
export default function ChangePasswordForm({ userId, onSuccess }: Props) {
    const t = useTranslations("users");
    const tc = useTranslations("common");
    const tRoot = useTranslations();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    /**
     * Validates and persists the password change request.
     */
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});

            await changeUserPassword(userId, {
                password,
                confirmPassword,
            });

            toast.success(t("messages.success.passwordChanged"));
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
            <FormField
                label={t("form.passwordLabel")}
                type="password"
                value={password}
                error={errors.password}
                onChange={setPassword}
            />

            <FormField
                label={t("form.confirmPasswordLabel")}
                type="password"
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={setConfirmPassword}
            />

            <Button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full justify-center"
                size="xs"
            >
                {loading ? tc("messages.loading") : t("form.changePassword")}
            </Button>
        </div>
    );
}