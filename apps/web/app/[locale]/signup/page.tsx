"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Client-side validation for immediate UX feedback
    if (!firstName.trim()) {
      setLocalError(t("messages.errors.firstNameRequired"));
      return;
    }
    if (!lastName.trim()) return setLocalError(t("messages.errors.lastNameRequired"));
    if (!email.trim()) return setLocalError(t("messages.errors.emailRequired"));
    if (!password.trim()) return setLocalError(t("messages.errors.passwordRequired"));
    if (!confirmPassword.trim()) return setLocalError(t("messages.errors.confirmPasswordRequired"));
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
          <div>
            <Label>
              {t("labels.firstName")} <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              defaultValue={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("labels.firstNamePlaceholder")}
            />
          </div>

          <div>
            <Label>
              {t("labels.lastName")} <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              defaultValue={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("labels.lastNamePlaceholder")}
            />
          </div>

          <div>
            <Label>
              {t("labels.email")} <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("labels.emailPlaceholder")}
            />
          </div>

          <div>
            <Label>
              {t("labels.password")} <span className="text-error-500">*</span>
            </Label>
            <Input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("labels.passwordPlaceholder")}
            />
          </div>

          <div>
            <Label>
              {t("labels.confirmPassword")} <span className="text-error-500">*</span>
            </Label>
            <Input
              type="password"
              defaultValue={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("labels.confirmPasswordPlaceholder")}
            />
          </div>

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