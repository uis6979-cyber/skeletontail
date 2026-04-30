"use client";

import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import DownloadIcon from "@/icons/download.svg";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
    search: string;
    setSearch: (v: string) => void;
    perPage: number;
    setPerPage: (v: number) => void;
    onExport: () => void;
};

/**
 * Renders table controls including pagination limit selection, search filtering, and data export.
 */
export default function TableToolbar({
    search,
    setSearch,
    perPage,
    setPerPage,
    onExport,
}: Props) {
    const t = useTranslations("common.table");

    return (
        <div className="mb-2 flex flex-col gap-2 px-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                    {t("show")}
                </span>

                <Select
                    size="xs"
                    defaultValue={String(perPage)}
                    onChange={(value) => {
                        // Interpret "all" as a high limit to bypass slicing logic in the parent component
                        setPerPage(value === "all" ? 999999 : Number(value));
                    }}
                    options={[
                        { label: "5", value: "5" },
                        { label: "10", value: "10" },
                        { label: "20", value: "20" },
                        { label: "50", value: "50" },
                        { label: "100", value: "100" },
                        { label: t("statusAll"), value: "all" },
                    ]}
                    compact
                    className="w-[70px]"
                />

                <span className="text-gray-500 dark:text-gray-400">
                    {t("entries")}
                </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="w-full xl:w-[240px]">
                    <Input
                        size="xs"
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        defaultValue={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startIcon={<Search />}
                        className="h-8 text-xs px-3 py-1"
                    />
                </div>

                <Button
                    size="xs"
                    variant="primary"
                    onClick={onExport}
                    startIcon={<DownloadIcon />}
                >
                    {t("export")}
                </Button>
            </div>
        </div>
    );
}