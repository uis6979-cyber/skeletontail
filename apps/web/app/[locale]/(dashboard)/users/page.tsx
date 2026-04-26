"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { useTranslations } from "next-intl";

export default function UsersPage() {
    const t = useTranslations("users");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageBreadcrumb items={[
                { label: t("title") },
            ]} />
            <div className="space-y-6">
                <ComponentCard title={t("title")}>
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    );
}