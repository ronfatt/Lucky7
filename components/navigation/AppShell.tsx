// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) App Shell
// File: components/navigation/AppShell.tsx
// Responsive layout handling desktop sidebar and mobile bottom nav & drawer
// ==========================================================

'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MemberCenterModal } from '@/components/auth/MemberCenterModal';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';
import { useUserProfile } from '@/lib/profile/user-profile-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMemberCenterOpen, setIsMemberCenterOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { profile, updateProfile } = useUserProfile();

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-gold-500/30 selection:text-gold-200">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenMemberCenter={() => setIsMemberCenterOpen(true)}
        />

        {/* Page Content with bottom padding for mobile bar */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Slide-Over Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMemberCenter={() => setIsMemberCenterOpen(true)}
      />

      {/* Global Modals for Mobile & Desktop */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <MemberCenterModal
        isOpen={isMemberCenterOpen}
        onClose={() => setIsMemberCenterOpen(false)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentProfile={profile}
        onSave={(updated) => updateProfile(updated)}
      />
    </div>
  );
}
