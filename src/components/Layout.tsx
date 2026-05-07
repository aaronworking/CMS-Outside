import React, { useState } from 'react';
import { LogOut, ClipboardList, Search, LayoutDashboard, Settings, User as UserIcon, Bell, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, User } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

export default function AppLayout({ 
  children, 
  currentPage, 
  setCurrentPage, 
  user, 
  onLogout 
}: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {children}
      </div>
    );
  }

  const navItems = [
    { id: 'status', label: '進度追蹤', icon: Search },
    { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
    { id: 'profile', label: '個人資料', icon: UserIcon },
    { id: 'settings', label: '系統設定', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm">
        <div className="flex items-center gap-10">
          {/* System Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/20">
              <ClipboardList className="text-white" size={18} />
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight whitespace-nowrap">客服維修系統</span>
          </div>

          {/* Navigation - Only Progress Tracking */}
          <nav className="hidden md:flex items-center">
            <button
              onClick={() => setCurrentPage('status')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${
                currentPage === 'status' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Search size={16} />
              <span className="text-sm font-bold tracking-tight">進度追蹤</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-slate-800">TSMC</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{user?.name || 'User'}</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>
            
            <button 
              onClick={onLogout}
              className="group flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 rounded-xl transition-all hover:bg-red-50"
              title="登出系統"
            >
              <span className="text-xs font-bold">登出</span>
              <LogOut size={18} />
            </button>
          </div>

          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Content Viewport */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] relative">
        <div className="p-6 md:p-8">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-slate-400">
                <span className="text-[8px] font-black">GT</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance Management</span>
            </div>
            <div className="hidden md:block h-4 w-[1px] bg-slate-200"></div>
            <p className="text-[10px] text-slate-400 font-medium">© 2026 GrandTech. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black tracking-widest text-slate-300 uppercase">
            <span>Secure Access</span>
            <span className="opacity-30">|</span>
            <span className="font-mono">GT-NODE-8812</span>
          </div>
        </footer>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[101] md:hidden flex flex-col shadow-2xl"
            >
              <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-xs">GT</span>
                  </div>
                  <span className="font-black text-slate-800">CMS Controls</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="flex-1 py-6 px-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPage === item.id 
                        ? 'bg-brand-primary text-white' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-6 border-t border-slate-100">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest border border-red-100"
                >
                  <LogOut size={16} />
                  <span>登出系統</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

