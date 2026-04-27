"use client";

import { useTranslations } from "next-intl";

type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  gender?: "male" | "female";
  language?: "es" | "en";
};

type Props = {
  user: User | null;
  onEdit: () => void;
};

/**
 * Displays user profile details in a read-only format.
 */
export default function UserInfoCard({ user, onEdit }: Props) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("editModal.sectionTitle")}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.firstName")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.firstName || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.lastName")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.lastName || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.email")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.phone")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.phone || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.birthDate")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.birthDate
                  ? new Date(user.birthDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.gender")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.gender
                  ? t(`editModal.genders.${user.gender}`)
                  : "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {t("labels.language")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.language
                  ? tc(`languages.${user.language}`)
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          {tc("buttons.edit")}
        </button>
      </div>
    </div>
  );
}