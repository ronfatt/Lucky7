// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) App Shell with Auth Gate
// File: components/navigation/AppShell.tsx
// Responsive layout with mandatory authentication barrier
// ==========================================================

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MemberCenterModal } from '@/components/auth/MemberCenterModal';
import { EditProfileModal } from '@/components/destiny/EditProfileModal';
import { useUserProfile } from '@/lib/profile/user-profile-store';
import { useAuth } from '@/lib/auth/auth-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMemberCenterOpen, setIsMemberCenterOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { profile, updateProfile } = useUserProfile();

  // Telemetry: Track page views on route transitions
  useEffect(() => {
    if (isAuthenticated && pathname !== '/login') {
      import('@/lib/telemetry/tracker').then(({ tracker }) => {
        tracker.trackPageView(pathname);
      });
    }
  }, [pathname, isAuthenticated]);

  // Mandatory Auth Barrier: If not authenticated and not on /login, redirect immediately
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  // If on dedicated login/register portal, render clean standalone view
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Session verification loading state
  if (loading && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A12] text-gold-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
          <span className="text-xs font-serif tracking-widest">紫微时空正运 · 正在加载安全会话...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated on protected routes, hold rendering during redirect
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-gold-500/30 selection:text-gold-200">
      {/* Desktop Persistent Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenMemberCenter={() => setIsMemberCenterOpen(true)}
        />

        {/* Page Content with bottom padding for mobile bottom bar */}
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

      {/* Global Modals */}
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
