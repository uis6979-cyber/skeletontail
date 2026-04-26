"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

/**
 * Admin Dashboard Layout orchestrator.
 * 
 * Manages the responsive shell of the application. Indentation of the main content area 
 * is dynamically calculated to align with the Sidebar's width across its various states.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic margin calculation ensures the content Indent matches Sidebar state widths
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />

      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <div className={`fixed top-0 right-0 z-50 transition-all duration-300 ease-in-out left-0 ${isExpanded || isHovered ? "lg:left-[290px]" : "lg:left-[90px]"}`} >
          <AppHeader />
        </div>
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 bg-gray-50 dark:bg-gray-900" style={{ marginTop: "5%" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
