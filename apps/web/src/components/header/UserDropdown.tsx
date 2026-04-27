"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export default function UserDropdown() {
  const t = useTranslations("common.userDropdown");
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  function toggleDropdown(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  /**
   * Fetch authenticated user session data and subscribe to global profile updates.
   * This logic should be migrated to a centralized AuthProvider in future refactors.
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();

        if (data.avatarUrl && !data.avatarUrl.startsWith("http")) {
          // Cache-busting parameter added to ensure UI reflects recent avatar changes
          data.avatarUrl = `${process.env.NEXT_PUBLIC_API_URL}${data.avatarUrl}?t=${Date.now()}`;
        }

        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();

    // Sync dropdown state when user profile is updated in other parts of the application
    const handler = () => fetchUser();

    window.addEventListener("user:updated", handler);

    return () => {
      window.removeEventListener("user:updated", handler);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            src={user?.avatarUrl || "/images/user/owner.jpg"}
            className="w-11 h-11 rounded-full"
            alt={t("avatarAlt")}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.firstName || t("userNamePlaceholder")}{" "}
          {user?.lastName || ""}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.firstName || t("userNamePlaceholder")}{" "}
            {user?.lastName || ""}
          </span>

          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || t("noEmail")}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              {t("editProfile")}
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          {t("signOut")}
        </button>
      </Dropdown>
    </div>
  );
}