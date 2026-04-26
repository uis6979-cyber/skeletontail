"use client";

import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserProfileModal from "@/components/user-profile/UserProfileModal";
import { useCallback, useState } from "react";

/**
 * Client-side orchestrator for profile sections. 
 * Manages the profile display cards and the state for the update modal.
 */
export default function ProfileClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <div className="space-y-6">
            <UserMetaCard onEdit={handleOpenModal} />
            <UserInfoCard onEdit={handleOpenModal} />

            <UserProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}