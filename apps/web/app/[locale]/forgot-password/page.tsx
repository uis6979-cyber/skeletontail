"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { authService } from "@/services/auth.service";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Forgot Password Page
 * 
 * Entry point for users to request a password recovery link via email.
 * Handled by the 'authService' which triggers the backend email queue.
 */
export default function ForgotPasswordPage() {
    const router = useRouter();
    const t = useTranslations("resetPassword");
    const { locale } = useParams();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const targetEmail = email.trim();

        if (!targetEmail) {
            toast.error(t("messages.errors.emailRequired"));
            return;
        }

        try {
            setLoading(true);

            await authService.forgotPassword({
                email: targetEmail,
            });

            toast.success(t("messages.success.resetEmailSent"));
            setTimeout(() => {
                router.push(`/${locale}/login`);
            }, 1200);
            setEmail("");
        } catch (err: any) {
            const message = err?.message || "messages.errors.unknownError";
            const displayMessage = message.includes(".")
                ? t(message)
                : message;

            toast.error(displayMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-6">
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {t("subtitle")}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label>
                            {t("labels.email")} <span className="text-error-500">*</span>
                        </Label>

                        <Input
                            type="email"
                            placeholder="info@gmail.com"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button className="w-full" disabled={loading} type="submit" size="sm">
                        {loading ? t("messages.loading") : t("labels.sendLink")}
                    </Button>
                </form>

                <footer className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    <Link
                        href={`/${locale}/login`}
                        className="text-brand-500 hover:underline"
                    >
                        {t("labels.backToLogin")}
                    </Link>
                </footer>
            </div>
        </div>
    );
}