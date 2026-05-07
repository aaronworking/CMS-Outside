/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import AppLayout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RequestPage from './pages/RequestPage';
import StatusPage from './pages/StatusPage';
import { Page, User, RepairRequest, RepairStatus, Theme } from './types';

// Mock initial data
const INITIAL_REQUESTS: RepairRequest[] = [
  {
    id: 'GT-2026-8827',
    timestamp: '2026/04/28 14:30:15',
    status: RepairStatus.PROCESSING,
    contactPerson: '陳大明',
    contactPhone: '0912-345-678',
    contactExt: '#8899',
    contactEmail: 'tmchen@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SN8827-01',
    deviceType: '監控工作站',
    deviceId: 'WS-001',
    deviceName: '監控工作站',
    deviceBrand: 'Dell',
    deviceModel: 'Precision 3660',
    warrantyExpiry: '2027/12/31',
    location: 'F18A',
    issueDescription: '主機啟動後發出異常響聲，且無法進入 Windows 系統。大綜工程師已到場確認電源模組故障。',
    parts: [
      { 
        id: 'p1', 
        name: '電源供應器 500W', 
        partSerialNumber: 'PSU-DELL-P3660', 
        quantity: 1, 
        replacementPartName: '電源供應器 600W (升級)',
        replacementPartSerialNumber: 'PSU-DELL-P600-NEW',
        note: '已更換' 
      },
      { 
        id: 'p2', 
        name: 'SATA 線', 
        partSerialNumber: 'CBL-SATA-01', 
        quantity: 1 
      }
    ],
    timeline: [
      { id: '1', timestamp: '2026/04/28 14:30:00', title: '案件已提交', description: '系統已自動分派案件編號', type: 'info' },
      { id: '2', timestamp: '2026/04/28 15:10:00', title: '工程師接案', description: '大綜工程師 (王小明) 已接收此案件，準備前往場區。', type: 'process' },
      { id: '3', timestamp: '2026/04/28 16:45:00', title: '現場檢測', description: '經更換零件測試，確診為電源供應器供電不穩導致。', type: 'warning' }
    ],
    building: 'F18A',
    department: '微影工程部',
    priority: 'P2'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>(INITIAL_REQUESTS);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentPage('status');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleNewRequest = (newRequest: RepairRequest) => {
    setRequests([newRequest, ...requests]);
    setCurrentPage('status');
  };

  const handleUpdateRequestStatus = (requestId: string, status: RepairStatus) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status } : req
    ));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'status':
        return (
          <StatusPage 
            requests={requests} 
            onAddRequest={handleNewRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
          />
        );
      case 'dashboard':
        return (
          <div className="space-y-8">
            <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              <span>Infrastructure</span>
              <ChevronRight size={10} className="mb-0.5" />
              <span className="text-brand-primary">Analytical Dashboard</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">數據統計儀表板</h2>
                <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">GrandTech Intelligence Hub</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">本週數據</button>
                 <button className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20">匯出報告</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: '平均修復時間', value: '2.4h', change: '-12%', icon: Timer, color: 'text-brand-primary' },
                { label: '本月報修總數', value: '142', change: '+5%', icon: ClipboardList, color: 'text-blue-500' },
                { label: '客戶滿意度', value: '98%', change: '+2%', icon: CheckCircle2, color: 'text-emerald-500' },
                { label: '待處理案件', value: '08', change: '-3', icon: Clock, color: 'text-amber-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-black ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800 font-mono">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-slate-300">
                 <BarChart3 size={48} className="mb-4 opacity-10" />
                 <p className="text-xs font-bold uppercase tracking-widest">故障類型分佈統計 (載入中...)</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-slate-300">
                 <LineChart size={48} className="mb-4 opacity-10" />
                 <p className="text-xs font-bold uppercase tracking-widest">週期報修趨勢分析 (載入中...)</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              <span>Account</span>
              <ChevronRight size={10} className="mb-0.5" />
              <span className="text-brand-primary">User Profile</span>
            </nav>

            <div className="max-w-4xl">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-brand-primary to-blue-400"></div>
                <div className="px-10 pb-10">
                  <div className="relative -mt-16 mb-6">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] p-1 shadow-xl">
                      <div className="w-full h-full bg-slate-100 rounded-[2.2rem] flex items-center justify-center text-brand-primary">
                        <UserIcon size={48} />
                      </div>
                    </div>
                    <button className="absolute bottom-2 left-24 p-2 bg-brand-primary text-white rounded-lg shadow-lg border-2 border-white">
                      <Palette size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.employeeId} • 廠區維修工程師</p>
                      </div>
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Settings size={16} /></div>
                          <span className="text-slate-500 font-medium">所屬廠區：</span>
                          <span className="text-slate-800 font-bold">F18A 廠</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><ClipboardList size={16} /></div>
                          <span className="text-slate-500 font-medium">權限等級：</span>
                          <span className="text-brand-primary font-black uppercase tracking-tighter">Gold Admin</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">系統通知設定</h3>
                      <div className="space-y-3">
                        {['新案件派發提醒', '維修超時警告', '系統狀態報告'].map((label, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-700">{label}</span>
                            <div className="w-10 h-5 bg-brand-primary rounded-full relative">
                              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <StatusPage 
            requests={requests} 
            onAddRequest={handleNewRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
          />
        );
    }
  };

  return (
    <AppLayout 
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      user={user}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AppLayout>
  );
}

import { LayoutDashboard, User as UserIcon, Timer, ClipboardList, CheckCircle2, Clock, BarChart3, LineChart, Settings, Palette, ChevronRight } from 'lucide-react';
