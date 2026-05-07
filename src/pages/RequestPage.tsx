import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Cpu, Phone, Hash, FileText } from 'lucide-react';
import { RepairRequest, RepairStatus } from '../types';

interface RequestPageProps {
  onSubmit: (request: RepairRequest) => void;
  onReturn?: () => void;
}

export default function RequestPage({ onSubmit, onReturn }: RequestPageProps) {
  const [formData, setFormData] = useState({
    // [報修人員]
    contactPerson: '',
    contactPhone: '',
    contactExt: '',
    contactEmail: '',
    creatorName: '',
    
    // [設備資訊]
    serialNumber: '',
    deviceType: '',
    deviceId: '',
    deviceName: '',
    deviceBrand: '',
    deviceModel: '',
    warrantyExpiry: '',
    location: '',
    issueDescription: '',
    
    building: 'F18A',
    department: '微影工程部',
  });

  const handleContactPersonChange = (value: string) => {
    setFormData({
      ...formData,
      contactPerson: value,
      contactPhone: value ? '0912-345-678' : '',
      contactExt: value ? '#8899' : '',
      contactEmail: value ? 'tmchen@tsmc.com' : '',
    });
  };

  const handleSerialNumberChange = (value: string) => {
    setFormData({
      ...formData,
      serialNumber: value,
      deviceType: value ? '監控工作站' : '',
      deviceId: value ? 'WS-001' : '',
      deviceName: value ? '監控工作站' : '',
      deviceBrand: value ? 'Dell' : '',
      deviceModel: value ? 'Precision 3660' : '',
      warrantyExpiry: value ? '2027/12/31' : '',
      location: value ? 'F18A' : '',
    });
  };
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const newRequest: RepairRequest = {
      id: `GT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestamp,
      status: RepairStatus.SUBMITTED,
      
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      contactExt: formData.contactExt,
      contactEmail: formData.contactEmail,
      creatorName: formData.creatorName,
      
      serialNumber: formData.serialNumber,
      deviceType: formData.deviceType,
      deviceId: formData.deviceId,
      deviceName: formData.deviceName,
      deviceBrand: formData.deviceBrand,
      deviceModel: formData.deviceModel,
      warrantyExpiry: formData.warrantyExpiry,
      location: formData.location,
      issueDescription: formData.issueDescription,
      
      building: formData.building,
      department: formData.department,
      priority: 'P3'
    };
    
    setIsDone(true);
    setTimeout(() => {
      onSubmit(newRequest);
    }, 2000);
  };

  if (isDone) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-20 card-dark text-center"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">報修單已成功提交</h2>
        <p className="text-slate-500 mt-4 text-lg">大綜電腦維修團隊將在 1 小時內與您聯繫。</p>
        <div className="mt-12">
          <div className="animate-pulse flex items-center justify-center gap-3 text-brand-primary font-black text-sm tracking-widest uppercase">
            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
            <span>系統正在同步至監控中心</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-2"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* [報修人員] Section */}
        <div className="card-dark p-8 shadow-xl border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
            <h3 className="text-xl font-black text-slate-800">[報修人員]</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">連絡人</label>
              <input
                required
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleContactPersonChange(e.target.value)}
                className="input-dark h-14"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">連絡人電話</label>
              <input
                disabled
                type="text"
                value={formData.contactPhone}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">連絡人分機</label>
              <input
                disabled
                type="text"
                value={formData.contactExt}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">連絡人電子郵件</label>
              <input
                disabled
                type="email"
                value={formData.contactEmail}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">建單人員</label>
              <input
                required
                type="text"
                value={formData.creatorName}
                onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                className="input-dark h-14"
              />
            </div>
          </div>
        </div>

        {/* [設備資訊] Section */}
        <div className="card-dark p-8 shadow-xl border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="w-1.5 h-6 bg-brand-secondary rounded-full"></div>
            <h3 className="text-xl font-black text-slate-800">[設備資訊]</h3>
          </div>

          {/* Part 1: Device Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-10 border-b border-slate-100">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">設備序號</label>
              <input
                required
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleSerialNumberChange(e.target.value)}
                className="input-dark h-14"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">設備類型</label>
              <input
                disabled
                type="text"
                value={formData.deviceType}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">設備編號</label>
              <input
                disabled
                type="text"
                value={formData.deviceId}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">設備名稱</label>
              <input
                disabled
                type="text"
                value={formData.deviceName}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">設備廠牌</label>
              <input
                disabled
                type="text"
                value={formData.deviceBrand}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">設備型號</label>
              <input
                disabled
                type="text"
                value={formData.deviceModel}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">保固到期日</label>
              <input
                disabled
                type="text"
                placeholder="YYYY/MM/DD"
                value={formData.warrantyExpiry}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">廠區</label>
              <input
                disabled
                type="text"
                value={formData.location}
                className="input-dark h-14 bg-slate-50 cursor-not-allowed opacity-60"
              />
            </div>
          </div>

          {/* Problem Description */}
          <div className="mt-8">
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">問題描述</label>
            <textarea
              required
              rows={4}
              value={formData.issueDescription}
              onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
              className="input-dark resize-none py-4"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onReturn}
            className="flex-none px-10 bg-white border border-slate-200 text-slate-400 h-16 rounded-2xl text-lg font-black hover:bg-slate-50 hover:text-slate-600 transition-all uppercase tracking-widest"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary h-16 flex items-center justify-center gap-4 group rounded-2xl shadow-2xl text-lg font-black"
          >
            <Cpu size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="tracking-widest">立即提交報修單</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
