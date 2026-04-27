"use client";

import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserProfileModal from "@/components/user-profile/UserProfileModal";
import { getMe } from "@/lib/api/me";
import { useCallback, useEffect, useState } from "react";

/**
 * Orchestrates profile management by centralizing user state.
 * Ensures display cards and the update modal stay synchronized.
 */
export default function ProfileClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    const fetchUser = useCallback(async () => {
        try {
            const data = await getMe();
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    /**
     * Synchronizes the centralized state following successful updates in child modals.
     */
    const handleUpdated = useCallback(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div className="space-y-6">
            <UserMetaCard user={user} onEdit={handleOpenModal} />
            <UserInfoCard user={user} onEdit={handleOpenModal} />

            <UserProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdated={handleUpdated}
            />
        </div>
    );
}