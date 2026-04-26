"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { authService } from "@/services/auth.service";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Reset Password (Token-based) Page
 * 
 * Final step of the recovery flow where the user provides a new password.
 * Consumes a 'token' from the URL search parameters to authorize the change.
 */
export default function ResetPasswordPage() {
    const t = useTranslations("resetPassword");
    const { locale } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    // State management for password update cycle
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        // Client-side validation for immediate feedback
        if (!password.trim() || !confirmPassword.trim()) {
            setLocalError(t("messages.errors.passwordRequired"));
            return;
        }

        if (password !== confirmPassword) {
            setLocalError(t("messages.errors.passwordsDontMatch"));
            return;
        }

        if (!token) {
            toast.error(t("messages.errors.invalidToken"));
            return;
        }

        try {
            setLoading(true);
            await authService.resetPassword({ token, password, confirmPassword });

            toast.success(t("messages.success.passwordUpdated"));

            // Allow user to see success feedback before redirecting
            setTimeout(() => {
                router.push(`/${locale}/login`);
            }, 1200);
        } catch (err: any) {
            // Normalize backend error keys to local translations
            const message = err?.message || "messages.errors.unknownError";
            toast.error(message.includes(".") ? t(message) : message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {t("titleNew")}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label>
                            {t("labels.newPassword")} <span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>
                            {t("labels.confirmPassword")} <span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {localError && <p className="text-sm text-red-500">{localError}</p>}

                    <Button className="w-full" disabled={loading} type="submit" size="sm">
                        {loading ? t("messages.loadingUpdate") : t("labels.resetSubmit")}
                    </Button>
                </form>
            </div>
        </div>
    );
}