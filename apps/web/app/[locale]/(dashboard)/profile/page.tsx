import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import ProfileClient from "./ProfileClient";

/**
 * User Profile Page
 * 
 * Architecture:
 * - Composition: Aggregates profile-related cards (Meta, Info, Address).
 * - Metadata: Dynamically localized using server-side 'next-intl' utilities.
 */
export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "profile.metadata" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function Profile() {
    const t = await getTranslations("profile");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageBreadcrumb items={[
                { label: t("title") },
            ]} />
            <div className="space-y-6">
                <ComponentCard title={t("title")}>
                    <ProfileClient />
                </ComponentCard>
            </div>
        </div>
    );
}
