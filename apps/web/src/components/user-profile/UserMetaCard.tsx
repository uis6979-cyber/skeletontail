"use client";

import { getProfile, updateAvatar } from "@/lib/api/profile";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

type Props = {
  onEdit: () => void;
};

export default function UserMetaCard({ onEdit }: Props) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const [user, setUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    /**
     * Fetches user profile data to populate the identity header on mount
     */
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("User identification fetch failed:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpdatePhoto = async () => {
    if (!selectedFile) return;

    try {
      const updatedUser = await updateAvatar(selectedFile);
      setUser(updatedUser);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div
            onClick={handleAvatarClick}
            className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 cursor-pointer relative"
          >
            <img
              width={80}
              height={80}
              src={previewUrl || user?.avatarUrl || "/images/user/owner.jpg"}
              alt={tc("userDropdown.avatarAlt")}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs transition">
              {t("userMeta.changeAvatar")}
            </div>
          </div>

          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {fullName || tc("userDropdown.userNamePlaceholder")}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || tc("userDropdown.noEmail")}
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <button
          onClick={handleUpdatePhoto}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 lg:w-auto"
        >
          {t("userMeta.updatePhoto")}
        </button>
      )}
    </div>
  );
}