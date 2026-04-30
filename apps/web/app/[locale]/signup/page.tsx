"use client";

import FormField from "@/components/form/FormField";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * SignUpPage handles user registration.
 * 
 * Manages form state, performs client-side validation, and utilizes the 
 * useAuth hook to delegate registration logic and API interaction.
 */
export default function SignUpPage() {
  const t = useTranslations("signup");
  const { locale } = useParams();
  const { register, loading } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Client-side validation for immediate UX feedback
    if (!firstName.trim()) {
      setLocalError(t("messages.errors.firstNameRequired"));
      setErrors({ firstName: t("messages.errors.firstNameRequired") });
      return;
    }
    if (!lastName.trim()) {
      return setLocalError(t("messages.errors.lastNameRequired"));
      setErrors({ lastName: t("messages.errors.lastNameRequired") });
    }
    if (!email.trim()) {
      return setLocalError(t("messages.errors.emailRequired"));
      setErrors({ email: t("messages.errors.emailRequired") });
    }
    if (!password.trim()) {
      return setLocalError(t("messages.errors.passwordRequired"));
      setErrors({ password: t("messages.errors.passwordRequired") });
    }
    if (!confirmPassword.trim()) {
      return setLocalError(t("messages.errors.confirmPasswordRequired"));
      setErrors({ confirmPassword: t("messages.errors.confirmPasswordRequired") });
    }
    if (password !== confirmPassword) return setLocalError(t("messages.errors.passwordsDontMatch"));

    try {
      await register({ firstName, lastName, email, password });

      toast.success(t("messages.success.accountCreated"));
      router.push(`/${locale}/login`);
    } catch (err: any) {
      const rawMessage =
        err?.response?.data?.message ||
        err?.message ||
        "messages.errors.unknownError";

      const message = rawMessage.includes(".") ? t(rawMessage) : rawMessage;

      setLocalError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6">
        <h1 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <FormField
            label={t("labels.firstName")}
            value={firstName}
            placeholder={t("labels.firstNamePlaceholder")}
            error={errors.firstName}
            onChange={(val) => setFirstName(val)}
          />

          <FormField
            label={t("labels.lastName")}
            value={lastName}
            placeholder={t("labels.lastNamePlaceholder")}
            error={errors.lastName}
            onChange={(val) => setLastName(val)}
          />

          <FormField
            label={t("labels.email")}
            value={email}
            placeholder={t("labels.emailPlaceholder")}
            error={errors.email}
            onChange={(val) => setEmail(val)}
          />

          <FormField
            label={t("labels.password")}
            value={password}
            placeholder={t("labels.passwordPlaceholder")}
            error={errors.password}
            onChange={(val) => setPassword(val)}
          />

          <FormField
            label={t("labels.confirmPassword")}
            value={confirmPassword}
            placeholder={t("labels.confirmPasswordPlaceholder")}
            error={errors.confirmPassword}
            onChange={(val) => setConfirmPassword(val)}
          />

          {localError && <p className="text-sm text-red-500">{localError}</p>}

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? t("labels.loading") : t("labels.submit")}
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t("labels.hasAccount")}{" "}
          <Link href={`/${locale}/login`} className="text-brand-500">
            {t("labels.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}