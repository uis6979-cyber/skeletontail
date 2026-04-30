"use client";

import FormField from "@/components/form/FormField";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

/**
 * Login Page Component
 * 
 * Architecture:
 * - UI: Tailored with atomic components (Input, Label, Button).
 * - Logic: Encapsulated in the `useAuth` hook, which manages API calls, loading states, and error handling.
 * - I18n: Powered by `next-intl` for localized content management.
 */
export default function SignInForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const { locale } = useParams();

  const { login, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localValidationError, setLocalValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationError(null);

    try {
      if (!email.trim()) {
        setLocalValidationError(t("messages.errors.emailRequired"));
        setErrors({ email: t("messages.errors.emailRequired") });
        return;
      }
      if (!password.trim()) {
        setLocalValidationError(t("messages.errors.passwordRequired"));
        setErrors({ password: t("messages.errors.passwordRequired") });
        return;
      }

      const res = await login(email, password);

      localStorage.setItem("token", res.access_token);

      router.push(`/${locale}`);

      toast.success(t("messages.success.loginSuccessful"));
    } catch (err: any) {
      const rawMessage =
        err?.response?.data?.message ||
        err?.message ||
        "messages.errors.unknownError";

      let message = rawMessage;
      if (rawMessage.includes(".")) {
        message = t(rawMessage);
      }

      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="w-full">

            <div className="mb-5 sm:mb-8 text-center">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                {t("title")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("labels.description")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <FormField
                  label={t("labels.email")}
                  value={email}
                  placeholder="info@gmail.com"
                  error={errors.email}
                  onChange={(val) => setEmail(val)}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  type={showPassword ? "text" : "password"}
                  label={t("labels.password")}
                  value={password}
                  placeholder={t("labels.passwordPlaceholder")}
                  error={errors.password}
                  onChange={(val) => setPassword(val)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    {t("labels.rememberMe")}
                  </span>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t("labels.forgotPassword")}
                </Link>
              </div>

              {(localValidationError || error) && (
                <p className="text-sm text-red-500">
                  {localValidationError || error}
                </p>
              )}

              <Button
                className="w-full"
                size="sm"
                disabled={loading}
                type="submit"
              >
                {loading ? t("labels.loading") : t("labels.submit")}
              </Button>

            </form>

            <div className="mt-5 text-center">
              <Link href={`/${locale}/signup`}>
                <Button className="w-full mt-4" size="sm" variant="outline">
                  {t("labels.signUp")}
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div >
    </div >
  );
}