import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, CheckCircle2, AlertCircle, Timer, FileText, Search, X, MapPin, 
  User, ChevronRight, Hash, Phone, Laptop, ChevronLeft, ChevronDown,
  ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown, Plus, ClipboardList,
  Calendar
} from 'lucide-react';
import { RepairRequest, RepairStatus } from '../types';
import RequestPage from './RequestPage';

interface StatusPageProps {
  requests: RepairRequest[];
  onAddRequest: (request: RepairRequest) => void;
  onUpdateRequestStatus: (requestId: string, status: RepairStatus) => void;
}

type SortField = 'id' | 'timestamp' | 'building' | 'status';
type SortOrder = 'asc' | 'desc';

export default function StatusPage({ requests, onAddRequest, onUpdateRequestStatus }: StatusPageProps) {
  const [searchFilters, setSearchFilters] = useState({
    id: '',
    building: '',
    department: '',
    status: '',
    issue: '',
    date: ''
  });
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showCloseRecordModal, setShowCloseRecordModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Matching screenshot approximately

  // Navigation helpers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const updateFilter = (field: keyof typeof searchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const filteredAndSortedRequests = useMemo(() => {
    let result = requests.filter(req => {
      const idMatch = req.id.toLowerCase().includes(searchFilters.id.toLowerCase());
      const locMatch = (req.building?.toLowerCase() || '').includes(searchFilters.building.toLowerCase()) || 
                       (req.location?.toLowerCase() || '').includes(searchFilters.building.toLowerCase()) ||
                       (req.department?.toLowerCase() || '').includes(searchFilters.building.toLowerCase());
      const issueMatch = (req.issueDescription?.toLowerCase() || '').includes(searchFilters.issue.toLowerCase()) ||
                         (req.deviceName?.toLowerCase() || '').includes(searchFilters.issue.toLowerCase()) ||
                         (req.deviceType?.toLowerCase() || '').includes(searchFilters.issue.toLowerCase());
      
      const statusText = req.status === RepairStatus.COMPLETED ? '維修完成' : 
                        req.status === RepairStatus.PROCESSING ? '處理中' : '已提交';
      const statusMatch = statusText.includes(searchFilters.status);

      // Date match (req.timestamp starts with YYYY/MM/DD)
      const dateMatch = !searchFilters.date || req.timestamp.includes(searchFilters.date.replace(/-/g, '/'));

      return idMatch && locMatch && issueMatch && statusMatch && dateMatch;
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [requests, searchFilters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRequests, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4" />;
    return sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <span>Operations</span>
        <ChevronRight size={10} className="mb-0.5" />
        <span className="text-brand-primary">Maintenance Feed</span>
      </nav>

      <AnimatePresence mode="wait">
        {showRequestForm ? (
          <motion.div
            key="request-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowExitConfirmModal(true)}
                  className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-xl transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">建立新報修案件</h2>
                  <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">Supporting High-Tech Manufacturing</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-xl">
              <RequestPage
                onReturn={() => setShowExitConfirmModal(true)}
                onSubmit={(req) => {
                  onAddRequest(req);
                  setShowRequestForm(false);
                }} 
              />
            </div>
          </motion.div>
        ) : selectedRequest ? (
          <motion.div
            key="request-detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="flex items-center gap-2 pr-4 border-r border-slate-100 text-slate-400 hover:text-brand-primary transition-all group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">返回列表</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    selectedRequest.status === RepairStatus.COMPLETED ? 'bg-emerald-500 shadow-emerald-200' :
                    selectedRequest.status === RepairStatus.PROCESSING ? 'bg-amber-500 shadow-amber-200' : 'bg-slate-500 shadow-slate-200'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedRequest.id}</h3>
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        selectedRequest.status === RepairStatus.COMPLETED ? 'bg-emerald-100/50 text-emerald-600 border border-emerald-200' :
                        selectedRequest.status === RepairStatus.PROCESSING ? 'bg-amber-100/50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {selectedRequest.status === RepairStatus.COMPLETED ? '維修已結案' : 
                         selectedRequest.status === RepairStatus.PROCESSING ? '工程處理中' : '案件新提交'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                       <Clock size={12} />
                       <span className="text-[10px] font-bold font-mono">{selectedRequest.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 {selectedRequest.status !== RepairStatus.COMPLETED && (
                    <button 
                      onClick={() => setShowCloseRecordModal(true)}
                      className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-black hover:shadow-lg hover:shadow-brand-primary/20 transition-all uppercase tracking-widest"
                    >
                      確認結案
                    </button>
                 )}
              </div>
            </div>

            <div className="flex flex-col gap-10">
              {/* [處理進度節點] Section (Now at Top) */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-100">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">[處理進度節點]</h3>
                </div>
                
                <div className="relative pl-12">
                  <div className="absolute left-[20px] top-2 bottom-8 w-0.5 bg-slate-100"></div>
                  <div className="space-y-12">
                    {selectedRequest.timeline?.map((event, idx) => (
                      <div key={event.id} className="relative">
                        <div className={`absolute -left-[52px] top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${
                          event.type === 'success' ? 'bg-emerald-500 text-white' :
                          event.type === 'warning' ? 'bg-amber-500 text-white' :
                          event.type === 'process' ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {event.type === 'success' ? <CheckCircle2 size={16} /> : 
                           event.type === 'warning' ? <AlertCircle size={16} /> : 
                           <div className="w-2 h-2 bg-current rounded-full"></div>}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                          <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-widest shrink-0">
                            {event.timestamp}
                          </span>
                          <div>
                            <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2">{event.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-4xl">{event.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* [報修人員] Section */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                  <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">[報修人員]</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">連絡人</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.contactPerson}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">連絡人電話</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.contactPhone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">連絡人分機</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.contactExt}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">電子郵件</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.contactEmail}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">建單人員</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.creatorName}</p>
                  </div>
                </div>
              </div>

              {/* [設備資訊] Section */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                  <div className="w-1.5 h-6 bg-brand-secondary rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">[設備資訊]</h3>
                </div>
                
                {/* Part 1: Device Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 pb-10 border-b border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">設備序號</p>
                    <p className="text-base font-mono font-bold text-slate-800">{selectedRequest.serialNumber}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">設備類型</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.deviceType}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">設備編號</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.deviceId}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">設備名稱</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.deviceName}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">設備廠牌</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.deviceBrand}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">設備型號</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.deviceModel}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">保固到期日</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.warrantyExpiry}</p>
                  </div>
                </div>

                {/* Part 2: Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">廠區</p>
                    <p className="text-base font-bold text-slate-800">{selectedRequest.location}</p>
                  </div>
                </div>
              </div>

              {/* [設備零件] Section */}
              {selectedRequest.parts && selectedRequest.parts.length > 0 && (
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">[設備零件]</h3>
                  </div>
                  
                  <div className="overflow-x-auto border border-slate-100 rounded-3xl">
                    <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] font-black tracking-widest uppercase border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">#</th>
                          <th className="px-6 py-4">零件名稱</th>
                          <th className="px-6 py-4">零件序號</th>
                          <th className="px-6 py-4 text-center">數量</th>
                          <th className="px-6 py-4">更換後零件</th>
                          <th className="px-6 py-4">更換後零件序號</th>
                          <th className="px-6 py-4">備註</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selectedRequest.parts.map((part, idx) => (
                          <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{part.name}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{part.partSerialNumber}</td>
                            <td className="px-6 py-4 text-center text-slate-800 font-black">{part.quantity}</td>
                            <td className="px-6 py-4 font-bold text-brand-primary">{part.replacementPartName || '-'}</td>
                            <td className="px-6 py-4 font-mono text-xs text-brand-primary/70">{part.replacementPartSerialNumber || '-'}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{part.note || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* [問題描述] Section */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">[問題描述]</h3>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl font-sans text-lg leading-relaxed text-slate-700 min-h-[160px]">
                  {selectedRequest.issueDescription}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="request-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden mb-8">
              <div className="p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-3">
                    <div className="w-6 h-[2px] bg-brand-primary"></div>
                    <span>Maintenance Management System</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    服務案件 <span className="text-brand-secondary">統計</span>
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-slate-400 text-xs font-medium">總計 {requests.length} 筆案件記錄</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto relative z-10">
                  {[
                    { label: '新提交案件', count: requests.filter(r => r.status === RepairStatus.SUBMITTED).length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50/40', border: 'border-blue-100' },
                    { label: '工程處理中', count: requests.filter(r => r.status === RepairStatus.PROCESSING).length, icon: Timer, color: 'text-brand-primary', bg: 'bg-brand-primary/5', border: 'border-brand-primary/10' },
                    { label: '維修已結案', count: requests.filter(r => r.status === RepairStatus.COMPLETED).length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/40', border: 'border-emerald-100' },
                  ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} ${stat.border} border p-5 min-w-[150px] rounded-[1.5rem] flex flex-col justify-between hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-default`}>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{stat.label}</span>
                        <stat.icon size={14} className={`${stat.color} opacity-40`} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-mono ${stat.color} font-black tracking-tighter`}>{stat.count.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Unit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Filters Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 mb-6">
              <div className="flex-[4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                <div className="relative lg:col-span-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="搜尋案件 ID..." 
                    className="w-full pl-9 pr-3 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400"
                    value={searchFilters.id}
                    onChange={(e) => updateFilter('id', e.target.value)}
                  />
                </div>
                <div className="relative lg:col-span-1">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="廠區/部門..." 
                    className="w-full pl-9 pr-3 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400"
                    value={searchFilters.building}
                    onChange={(e) => updateFilter('building', e.target.value)}
                  />
                </div>
                <div className="relative lg:col-span-1">
                  <Laptop size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="關鍵字/設備..." 
                    className="w-full pl-9 pr-3 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400"
                    value={searchFilters.issue}
                    onChange={(e) => updateFilter('issue', e.target.value)}
                  />
                </div>
                <div className="relative lg:col-span-1">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date" 
                    className="w-full pl-9 pr-3 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-slate-600"
                    value={searchFilters.date}
                    onChange={(e) => updateFilter('date', e.target.value)}
                  />
                </div>
                <div className="relative lg:col-span-2">
                  <AlertCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 focus-within:hidden" />
                  <select 
                    className="w-full pl-9 pr-8 h-11 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all appearance-none font-bold text-slate-600 cursor-pointer"
                    value={searchFilters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                  >
                    <option value="">案件選擇：當前狀態篩選</option>
                    <option value="已提交">新提交</option>
                    <option value="處理中">工程處理中</option>
                    <option value="維修完成">維修已結案</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              <div className="flex-initial p-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center">
                <button 
                  onClick={() => setSearchFilters({ id: '', building: '', department: '', status: '', issue: '', date: '' })}
                  className="px-6 h-9 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
                >
                  清除
                </button>
              </div>
            </div>

            {filteredAndSortedRequests.length === 0 ? (
              <div className="bg-white p-24 text-center border-dashed border-slate-200 rounded-3xl">
                <FileText className="text-slate-100 mx-auto mb-4" size={64} />
                <p className="text-slate-500 font-black text-xl">查無相符資料</p>
                <p className="text-slate-400 text-xs mt-2 font-mono uppercase tracking-widest">NO RECORDS FOUND IN CURRENT SESSION</p>
              </div>
            ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Action Bar with Create Button, Record Count and Pagination */}
            <div className="px-8 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <button
                onClick={() => setShowRequestForm(true)}
                className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all shrink-0"
              >
                <Plus size={16} />
                <span>建立維修工單</span>
              </button>

              <div className="flex items-center gap-6">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  顯示第 {(currentPage - 1) * itemsPerPage + 1} 至 {Math.min(currentPage * itemsPerPage, filteredAndSortedRequests.length)} 筆 <span className="mx-1 opacity-30">|</span> 共 {filteredAndSortedRequests.length} 筆
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-primary hover:border-brand-primary disabled:opacity-20 disabled:pointer-events-none transition-all bg-white"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                  <button 
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-primary hover:border-brand-primary disabled:opacity-20 disabled:pointer-events-none transition-all bg-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <div className="flex items-center gap-1 mx-1.5">
                    <span className="text-xs font-black text-brand-primary">{currentPage}</span>
                    <span className="text-xs text-slate-300">/</span>
                    <span className="text-xs font-bold text-slate-400">{totalPages}</span>
                  </div>

                  <button 
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-primary hover:border-brand-primary disabled:opacity-20 disabled:pointer-events-none transition-all bg-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <button 
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-brand-primary hover:border-brand-primary disabled:opacity-20 disabled:pointer-events-none transition-all bg-white"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50/50 text-slate-500 text-[11px] font-black tracking-widest uppercase border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('id')}>
                            <div className="flex items-center">
                              案件編號 <SortIndicator field="id" />
                            </div>
                          </th>
                          <th className="px-8 py-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('timestamp')}>
                            <div className="flex items-center">
                              報修時間 <SortIndicator field="timestamp" />
                            </div>
                          </th>
                          <th className="px-8 py-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('building')}>
                            <div className="flex items-center">
                              廠區 / 部門 <SortIndicator field="building" />
                            </div>
                          </th>
                          <th className="px-8 py-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}>
                            <div className="flex items-center">
                              當前狀態 <SortIndicator field="status" />
                            </div>
                          </th>
                          <th className="px-8 py-6 text-right">服務明細</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {currentItems.map((request, index) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={request.id}
                            onClick={() => setSelectedRequest(request)}
                            className="hover:bg-slate-50/50 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-brand-primary"
                          >
                            <td className="px-8 py-6 font-mono text-brand-primary font-black text-sm">
                              {request.id}
                            </td>
                            <td className="px-8 py-6 text-slate-500 font-medium italic text-xs">
                              {request.timestamp}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-slate-800 font-black text-sm tracking-tight">{request.building}</span>
                                <span className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{request.department}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              {request.status === RepairStatus.COMPLETED ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase ring-1 ring-emerald-200">
                                  <CheckCircle2 size={12} />
                                  <span>維修完成</span>
                                </div>
                              ) : request.status === RepairStatus.PROCESSING ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase ring-1 ring-brand-primary/20 animate-pulse">
                                  <Timer size={12} />
                                  <span>處理中...</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase ring-1 ring-blue-200">
                                  <Clock size={12} />
                                  <span>已提交</span>
                                </div>
                              )}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button className="inline-flex items-center gap-2 text-xs font-black text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all">
                                <span>明細詳情</span>
                                <ChevronRight size={18} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit Confirmation Modal for Request Form */}
        <AnimatePresence>
          {showExitConfirmModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowExitConfirmModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 max-w-md w-full relative z-10"
              >
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">捨棄目前的變更？</h3>
                <p className="text-slate-500 leading-relaxed mb-10">
                  您目前有尚未提交的報修資訊，如果現在離開，所有輸入的內容將會被捨棄。確定要返回統計頁面嗎？
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowExitConfirmModal(false)}
                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      setShowExitConfirmModal(false);
                      setShowRequestForm(false);
                    }}
                    className="flex-1 px-6 py-4 bg-amber-500 text-white rounded-2xl text-sm font-black hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all uppercase tracking-widest"
                  >
                    確定離開
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal for Closing Record */}
        <AnimatePresence>
          {showCloseRecordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCloseRecordModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 max-w-md w-full relative z-10"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">確認結案？</h3>
                <p className="text-slate-500 leading-relaxed mb-10">
                  您確定要將此案件編號 <span className="font-mono font-bold text-brand-primary underline">{selectedRequest?.id}</span> 的報修工單標記為「結案」嗎？結案後將無法再次修改內容。
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCloseRecordModal(false)}
                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-400 hover:text-slate-600 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      if (selectedRequest) {
                        onUpdateRequestStatus(selectedRequest.id, RepairStatus.COMPLETED);
                        setSelectedRequest({ ...selectedRequest, status: RepairStatus.COMPLETED });
                        setShowCloseRecordModal(false);
                      }
                    }}
                    className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl text-sm font-black hover:bg-brand-primary/90 shadow-xl shadow-brand-primary/20 transition-all"
                  >
                    確認結案
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
}

