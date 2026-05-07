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
    id: 'GT-2026-1001',
    timestamp: '2026/05/01 09:15:22',
    status: RepairStatus.COMPLETED,
    contactPerson: '李小美',
    contactPhone: '0911-222-333',
    contactExt: '#1234',
    contactEmail: 'xm_li@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-760-01',
    deviceType: 'Server',
    deviceId: 'SRV-HPC-01',
    deviceName: '高效能運算伺服器',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge R760',
    warrantyExpiry: '2028/10/15',
    location: 'F18A',
    issueDescription: '系統回報硬碟故障 (RAID 5)，需要更換硬碟並重建陣列。',
    parts: [{ id: 'p1', name: '2.4TB SAS HDD', partSerialNumber: 'HDD-SAS-2TB', quantity: 1, replacementPartName: '2.4TB SAS HDD', replacementPartSerialNumber: 'HDD-SAS-2TB-NEW', note: '已更換' }],
    timeline: [
      { id: '1', timestamp: '2026/05/01 09:15:00', title: '案件已提交', description: '硬碟燈號異常告警', type: 'info' },
      { id: '2', timestamp: '2026/05/01 10:00:00', title: '工程師接案', description: '大綜工程師前往領料', type: 'process' },
      { id: '3', timestamp: '2026/05/01 14:30:00', title: '維修完成', description: '更換硬碟並確認陣列重建完畢', type: 'success' }
    ],
    building: 'F18A',
    department: '資訊工程部',
    priority: 'P1'
  },
  {
    id: 'GT-2026-1002',
    timestamp: '2026/05/01 10:45:10',
    status: RepairStatus.PROCESSING,
    contactPerson: '張大同',
    contactPhone: '0922-333-444',
    contactExt: '#5678',
    contactEmail: 'dt_zhang@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-HP-G10-02',
    deviceType: 'Notebook',
    deviceId: 'NB-CAD-15',
    deviceName: '行動工作站',
    deviceBrand: 'HP',
    deviceModel: 'ZBook Fury G10',
    warrantyExpiry: '2027/05/20',
    location: 'F12',
    issueDescription: '螢幕出現異常閃爍，且外接顯示器無輸出。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/01 10:45:00', title: '案件已提交', description: '使用者報修顯示異常', type: 'info' },
      { id: '2', timestamp: '2026/05/02 09:00:00', title: '檢測中', description: '確認是否為顯示卡或螢幕面板故障', type: 'process' }
    ],
    building: 'F12',
    department: '產品設計部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1003',
    timestamp: '2026/05/02 11:20:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '王大明',
    contactPhone: '0933-444-555',
    contactExt: '#9988',
    contactEmail: 'dm_wang@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-LN-SR650-03',
    deviceType: 'Server',
    deviceId: 'SRV-DB-02',
    deviceName: '資料庫伺服器',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkSystem SR650',
    warrantyExpiry: '2026/12/31',
    location: 'F14',
    issueDescription: '記憶體溢位告警，且一組記憶體插槽偵測不到。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/02 11:20:00', title: '案件已提交', description: '系統監控告警', type: 'info' }
    ],
    building: 'F14',
    department: '資料資產部',
    priority: 'P1'
  },
  {
    id: 'GT-2026-1004',
    timestamp: '2026/05/02 14:05:30',
    status: RepairStatus.COMPLETED,
    contactPerson: '林志玲',
    contactPhone: '0955-666-777',
    contactExt: '#7766',
    contactEmail: 'cl_lin@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-DE-5570-04',
    deviceType: 'Notebook',
    deviceId: 'NB-OFFICE-88',
    deviceName: '辦公筆記型電腦',
    deviceBrand: 'Dell',
    deviceModel: 'Latitude 5570',
    warrantyExpiry: '2026/08/12',
    location: 'F18A',
    issueDescription: '電池膨脹，觸控板無法點擊。',
    parts: [{ id: 'b1', name: 'Latitude 58Wh Battery', partSerialNumber: 'BAT-DELL-58', quantity: 1, replacementPartName: 'Latitude 58Wh Battery', replacementPartSerialNumber: 'BAT-DELL-58-NEW', note: '更換電池成功' }],
    timeline: [
      { id: '1', timestamp: '2026/05/02 14:05:00', title: '案件已提交', description: '外殼高度異常', type: 'info' },
      { id: '2', timestamp: '2026/05/02 15:30:00', title: '維修完成', description: '更換電池並清潔內部', type: 'success' }
    ],
    building: 'F18A',
    department: '行政管理部',
    priority: 'P3'
  },
  {
    id: 'GT-2026-1005',
    timestamp: '2026/05/02 16:40:15',
    status: RepairStatus.PROCESSING,
    contactPerson: '郭台銘',
    contactPhone: '0988-123-456',
    contactExt: '#0001',
    contactEmail: 'tm_kuo@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-940-05',
    deviceType: 'Server',
    deviceId: 'SRV-SAP-01',
    deviceName: 'SAP ERP伺服器',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge R940',
    warrantyExpiry: '2029/01/01',
    location: 'F22',
    issueDescription: '電源模組 2 (PSU 2) 無輸出，目前靠 PSU 1 單足供電。',
    parts: [{ id: 'p1', name: '1100W PSU', partSerialNumber: 'PSU-1100W', quantity: 1 }],
    timeline: [
      { id: '1', timestamp: '2026/05/02 16:40:00', title: '案件已提交', description: '電力冗餘遺失告警', type: 'info' },
      { id: '2', timestamp: '2026/05/03 08:30:00', title: '備料中', description: '工程師已申請零件調度', type: 'process' }
    ],
    building: 'F22',
    department: '財務系統部',
    priority: 'P1'
  },
  {
    id: 'GT-2026-1006',
    timestamp: '2026/05/03 09:10:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '陳建宏',
    contactPhone: '0912-888-999',
    contactExt: '#2233',
    contactEmail: 'jh_chen@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-LN-P1-06',
    deviceType: 'Notebook',
    deviceId: 'NB-DEV-03',
    deviceName: '開發用筆電',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkPad P1 Gen 5',
    warrantyExpiry: '2027/09/30',
    location: 'F12',
    issueDescription: '鍵盤部分按鍵故障 (Enter 鍵與 Backspace 鍵)。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/03 09:10:00', title: '案件已提交', description: '鍵盤輸入異常', type: 'info' }
    ],
    building: 'F12',
    department: '軟體研發部',
    priority: 'P3'
  },
  {
    id: 'GT-2026-1007',
    timestamp: '2026/05/03 10:30:45',
    status: RepairStatus.PROCESSING,
    contactPerson: '徐若瑄',
    contactPhone: '0922-555-111',
    contactExt: '#4455',
    contactEmail: 'vv_hsu@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-HP-DL380-07',
    deviceType: 'Server',
    deviceId: 'SRV-FILE-05',
    deviceName: '檔案伺服器',
    deviceBrand: 'HP',
    deviceModel: 'ProLiant DL380 Gen10',
    warrantyExpiry: '2026/05/31',
    location: 'F14',
    issueDescription: 'Smart Storage Battery 發生故障，導致 Write Cache 停用，效能低落。',
    parts: [{ id: 'b2', name: 'Smart Storage Battery', partSerialNumber: 'HP-BAT-GEN10', quantity: 1 }],
    timeline: [
      { id: '1', timestamp: '2026/05/03 10:30:00', title: '案件已提交', description: '效能異常監控告警', type: 'info' },
      { id: '2', timestamp: '2026/05/03 13:00:00', title: '現場檢測', description: '更換電池測試中', type: 'process' }
    ],
    building: 'F14',
    department: '儲存架構部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1008',
    timestamp: '2026/05/03 14:50:12',
    status: RepairStatus.COMPLETED,
    contactPerson: '周杰倫',
    contactPhone: '0977-888-777',
    contactExt: '#3322',
    contactEmail: 'jl_chou@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-DE-7670-08',
    deviceType: 'Notebook',
    deviceId: 'NB-WS-99',
    deviceName: '工程工作站',
    deviceBrand: 'Dell',
    deviceModel: 'Precision 7670',
    warrantyExpiry: '2028/02/14',
    location: 'F18A',
    issueDescription: '風扇發出尖銳異音，疑似軸承損壞。',
    parts: [{ id: 'f1', name: 'Cooling Fan set', partSerialNumber: 'FAN-P7670', quantity: 1, replacementPartSerialNumber: 'FAN-P7670-NEW', note: '更換風扇成功' }],
    timeline: [
      { id: '1', timestamp: '2026/05/03 14:50:00', title: '案件已提交', description: '機器過熱告警', type: 'info' },
      { id: '2', timestamp: '2026/05/04 10:00:00', title: '維修完成', description: '更換風扇並清潔散熱膏', type: 'success' }
    ],
    building: 'F18A',
    department: '設備維護部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1009',
    timestamp: '2026/05/04 08:30:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '蔡依林',
    contactPhone: '0933-999-000',
    contactExt: '#1111',
    contactEmail: 'jl_tsai@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-R650-09',
    deviceType: 'Server',
    deviceId: 'SRV-WEB-01',
    deviceName: '內部入口伺服器',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge R650',
    warrantyExpiry: '2027/12/31',
    location: 'F22',
    issueDescription: 'iDRAC 無法遠端連結，網孔燈號不亮。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/04 08:30:00', title: '案件已提交', description: '管理介面失聯', type: 'info' }
    ],
    building: 'F22',
    department: '網路安全部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1010',
    timestamp: '2026/05/04 10:15:22',
    status: RepairStatus.PROCESSING,
    contactPerson: '羅志祥',
    contactPhone: '0955-444-333',
    contactExt: '#0077',
    contactEmail: 'sc_lo@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-HP-840-10',
    deviceType: 'Notebook',
    deviceId: 'NB-GM-22',
    deviceName: '通用型筆電',
    deviceBrand: 'HP',
    deviceModel: 'EliteBook 840 G9',
    warrantyExpiry: '2026/11/11',
    location: 'F12',
    issueDescription: '藍牙滑鼠與耳機完全無法配對，嘗試重裝驅動程式無效。',
    parts: [{ id: 'w1', name: 'Wi-Fi/BT Card', partSerialNumber: 'INTEL-AX211', quantity: 1 }],
    timeline: [
      { id: '1', timestamp: '2026/05/04 10:15:00', title: '案件已提交', description: '通訊功能失效', type: 'info' },
      { id: '2', timestamp: '2026/05/04 14:00:00', title: '料件申請中', description: '預計明早到貨', type: 'process' }
    ],
    building: 'F12',
    department: '人力資源部',
    priority: 'P3'
  },
  {
    id: 'GT-2026-1011',
    timestamp: '2026/05/04 13:20:00',
    status: RepairStatus.COMPLETED,
    contactPerson: '五月天',
    contactPhone: '0988-555-555',
    contactExt: '#0505',
    contactEmail: 'mayday@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-LN-ST250-11',
    deviceType: 'Server',
    deviceId: 'SRV-TEST-09',
    deviceName: '測試環境伺服器',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkSystem ST250',
    warrantyExpiry: '2027/06/06',
    location: 'F14',
    issueDescription: '光碟機損壞，無法讀取安裝片。',
    parts: [{ id: 'd1', name: 'DVD-RW Drive', partSerialNumber: 'LN-DVD-RW', quantity: 1, replacementPartSerialNumber: 'LN-DVD-RW-NEW', note: '更換完畢' }],
    timeline: [
      { id: '1', timestamp: '2026/05/04 13:20:00', title: '案件已提交', description: '讀取功能損毀', type: 'info' },
      { id: '2', timestamp: '2026/05/04 16:00:00', title: '維修完成', description: '已更換零件並測試讀取正常', type: 'success' }
    ],
    building: 'F14',
    department: '晶圓測試部',
    priority: 'P4'
  },
  {
    id: 'GT-2026-1012',
    timestamp: '2026/05/04 15:45:30',
    status: RepairStatus.SUBMITTED,
    contactPerson: '孫燕姿',
    contactPhone: '0912-333-222',
    contactExt: '#8822',
    contactEmail: 'yz_sun@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-DE-G15-12',
    deviceType: 'Notebook',
    deviceId: 'NB-SIM-05',
    deviceName: '模擬專用心電',
    deviceBrand: 'Dell',
    deviceModel: 'Precision 7770',
    warrantyExpiry: '2029/12/31',
    location: 'F18A',
    issueDescription: '在使用大型模擬軟體時，機台會自動無預警斷電重啟。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/04 15:45:00', title: '案件已提交', description: '不正常關機', type: 'info' }
    ],
    building: 'F18A',
    department: '先進製程研發部',
    priority: 'P1'
  },
  {
    id: 'GT-2026-1013',
    timestamp: '2026/05/05 09:00:15',
    status: RepairStatus.PROCESSING,
    contactPerson: '張宇勤',
    contactPhone: '0955-111-222',
    contactExt: '#4444',
    contactEmail: 'yc_chang@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-R740-13',
    deviceType: 'Server',
    deviceId: 'SRV-VDI-08',
    deviceName: '虛擬桌面伺服器',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge R740',
    warrantyExpiry: '2026/09/20',
    location: 'F22',
    issueDescription: '液晶面板 (LCD Bezel) 顯示 VLT0204 電壓異常錯誤。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/05 09:00:00', title: '案件已提交', description: '外觀面板報錯', type: 'info' },
      { id: '2', timestamp: '2026/05/05 11:30:00', title: '檢測中', description: '檢查主機板與電源端', type: 'process' }
    ],
    building: 'F22',
    department: '基礎架構服務部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1014',
    timestamp: '2026/05/05 10:20:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '李宗盛',
    contactPhone: '0933-222-111',
    contactExt: '#1212',
    contactEmail: 'js_lee@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-LN-T14-14',
    deviceType: 'Notebook',
    deviceId: 'NB-MGR-01',
    deviceName: '主管用筆電',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkPad T14 Gen 3',
    warrantyExpiry: '2026/03/03',
    location: 'F12',
    issueDescription: '視訊鏡頭偵測不到，Windows Hello 無法登入。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/05 10:20:00', title: '案件已提交', description: '生物辨識失效', type: 'info' }
    ],
    building: 'F12',
    department: '策略規劃部',
    priority: 'P3'
  },
  {
    id: 'GT-2026-1015',
    timestamp: '2026/05/05 13:40:45',
    status: RepairStatus.PROCESSING,
    contactPerson: '伍佰',
    contactPhone: '0900-500-500',
    contactExt: '#0555',
    contactEmail: 'wubai@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-HP-ML350-15',
    deviceType: 'Server',
    deviceId: 'SRV-LOG-11',
    deviceName: '日誌搜集主機',
    deviceBrand: 'HP',
    deviceModel: 'ProLiant ML350 Gen10',
    warrantyExpiry: '2027/11/11',
    location: 'F14',
    issueDescription: '機殼入侵偵測報警，且機身防盜鎖損壞。',
    parts: [{ id: 's1', name: 'Chassis Intrusive Sensor', partSerialNumber: 'HP-SN-01', quantity: 1 }],
    timeline: [
      { id: '1', timestamp: '2026/05/05 13:40:00', title: '案件已提交', description: '資安告警', type: 'info' },
      { id: '2', timestamp: '2026/05/05 15:30:00', title: '檢測中', description: '勘查硬體結構', type: 'process' }
    ],
    building: 'F14',
    department: '資安稽核部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1016',
    timestamp: '2026/05/05 15:10:12',
    status: RepairStatus.COMPLETED,
    contactPerson: '徐佳瑩',
    contactPhone: '0966-222-111',
    contactExt: '#9900',
    contactEmail: 'cy_hsu@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-DE-7490-16',
    deviceType: 'Notebook',
    deviceId: 'NB-STAF-55',
    deviceName: '一般用筆電',
    deviceBrand: 'Dell',
    deviceModel: 'Latitude 7490',
    warrantyExpiry: '2026/07/07',
    location: 'F18A',
    issueDescription: '連接埠 Type-C 鬆動，插上充電器經常接觸不良。',
    parts: [{ id: 'm1', name: 'Mainboard with ports', partSerialNumber: 'DELL-MB-7490', quantity: 1, replacementPartSerialNumber: 'DELL-MB-7490-NEW', note: '更換主機板解決' }],
    timeline: [
      { id: '1', timestamp: '2026/05/05 15:10:00', title: '案件已提交', description: '電力接觸不良', type: 'info' },
      { id: '2', timestamp: '2026/05/06 11:00:00', title: '維修完成', description: '已更換主機板並測試充電正常', type: 'success' }
    ],
    building: 'F18A',
    department: '公共事務部',
    priority: 'P3'
  },
  {
    id: 'GT-2026-1017',
    timestamp: '2026/05/06 08:45:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '林俊傑',
    contactPhone: '0912-130-130',
    contactExt: '#1313',
    contactEmail: 'jj_lin@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-R250-17',
    deviceType: 'Server',
    deviceId: 'SRV-EDM-22',
    deviceName: '文管伺服器',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge R250',
    warrantyExpiry: '2027/02/02',
    location: 'F22',
    issueDescription: '系統開機卡在 Loading 畫面，疑似固態硬碟開機磁區損毀。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/06 08:45:00', title: '案件已提交', description: '系統開機失敗', type: 'info' }
    ],
    building: 'F22',
    department: '文件管理中心',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1018',
    timestamp: '2026/05/06 10:30:22',
    status: RepairStatus.PROCESSING,
    contactPerson: '張惠妹',
    contactPhone: '0911-343-343',
    contactExt: '#9487',
    contactEmail: 'amei@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-HP-G8-18',
    deviceType: 'Notebook',
    deviceId: 'NB-HR-09',
    deviceName: '主管接待筆電',
    deviceBrand: 'HP',
    deviceModel: 'ProBook 440 G8',
    warrantyExpiry: '2026/10/10',
    location: 'F12',
    issueDescription: '揚聲器破音嚴重，開會時無法正常播放聲音。',
    parts: [{ id: 's2', name: 'Internal Speaker Set', partSerialNumber: 'HP-SPK-G8', quantity: 1 }],
    timeline: [
      { id: '1', timestamp: '2026/05/06 10:30:00', title: '案件已提交', description: '音訊輸出異常', type: 'info' },
      { id: '2', timestamp: '2026/05/06 14:00:00', title: '備料中', description: '零件運輸中', type: 'process' }
    ],
    building: 'F12',
    department: '教育訓練部',
    priority: 'P4'
  },
  {
    id: 'GT-2026-1019',
    timestamp: '2026/05/06 13:50:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '周興哲',
    contactPhone: '0977-111-222',
    contactExt: '#1231',
    contactEmail: 'hc_chou@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-LN-SR550-19',
    deviceType: 'Server',
    deviceId: 'SRV-APPS-03',
    deviceName: '應用程式伺服器',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkSystem SR550',
    warrantyExpiry: '2026/06/06',
    location: 'F14',
    issueDescription: '系統風扇模組故障，溫度監控數值持續偏高。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/06 13:50:00', title: '案件已提交', description: '風扇停轉告警', type: 'info' }
    ],
    building: 'F14',
    department: '製造自動化部',
    priority: 'P1'
  },
  {
    id: 'GT-2026-1020',
    timestamp: '2026/05/06 15:40:30',
    status: RepairStatus.COMPLETED,
    contactPerson: '田馥甄',
    contactPhone: '0988-333-222',
    contactExt: '#1010',
    contactEmail: 'hebe@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-DE-5430-20',
    deviceType: 'Notebook',
    deviceId: 'NB-IT-22',
    deviceName: 'IT管理筆電',
    deviceBrand: 'Dell',
    deviceModel: 'Latitude 5430',
    warrantyExpiry: '2028/05/05',
    location: 'F18A',
    issueDescription: '防盜開關故障，導致開機時會卡在資安檢測畫面。',
    parts: [{ id: 'k1', name: 'Lock detection sensor', partSerialNumber: 'DELL-SN-LOK', quantity: 1, replacementPartSerialNumber: 'DELL-SN-LOK-NEW', note: '更換傳感器正常' }],
    timeline: [
      { id: '1', timestamp: '2026/05/06 15:40:00', title: '案件已提交', description: '資安檢測卡住', type: 'info' },
      { id: '2', timestamp: '2026/05/07 09:30:00', title: '維修完成', description: '更換料件並更新 BIOS', type: 'success' }
    ],
    building: 'F18A',
    department: '資訊安全小組',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1021',
    timestamp: '2026/05/07 08:30:15',
    status: RepairStatus.SUBMITTED,
    contactPerson: '方大同',
    contactPhone: '0955-888-888',
    contactExt: '#1111',
    contactEmail: 'dt_fang@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-XE9680-21',
    deviceType: 'Server',
    deviceId: 'SRV-AI-GPU-01',
    deviceName: 'AI 訓練伺服器',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge XE9680',
    warrantyExpiry: '2030/01/01',
    location: 'F22',
    issueDescription: 'NVIDIA H100 GPU 節點通路異常，疑似水冷排漏水。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/07 08:30:00', title: '案件已提交', description: '水冷系統漏液告警', type: 'info' }
    ],
    building: 'F22',
    department: 'AI運算開發部',
    priority: 'P1'
  },
  {
    id: 'GT-2026-1022',
    timestamp: '2026/05/07 09:15:00',
    status: RepairStatus.PROCESSING,
    contactPerson: '楊丞琳',
    contactPhone: '0933-444-111',
    contactExt: '#2222',
    contactEmail: 'rainie@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-HP-G10-22',
    deviceType: 'Notebook',
    deviceId: 'NB-SAL-01',
    deviceName: '業務往返用筆電',
    deviceBrand: 'HP',
    deviceModel: 'EliteBook 1040 G10',
    warrantyExpiry: '2027/12/12',
    location: 'F12',
    issueDescription: '螢幕轉軸 (Hinge) 斷裂，無法合上或撐開。',
    parts: [{ id: 'h1', name: 'LH/RH Hinge pair', partSerialNumber: 'HP-HNG-G10', quantity: 1 }],
    timeline: [
      { id: '1', timestamp: '2026/05/07 09:15:00', title: '案件已提交', description: '機構件損毀', type: 'info' },
      { id: '2', timestamp: '2026/05/07 11:00:00', title: '檢測中', description: '判定是否影響面板螢幕', type: 'process' }
    ],
    building: 'F12',
    department: '全球通路部',
    priority: 'P3'
  },
  {
    id: 'GT-2026-1023',
    timestamp: '2026/05/07 10:45:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '李佳薇',
    contactPhone: '0977-123-123',
    contactExt: '#3434',
    contactEmail: 'cw_lee@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-HP-DL360-23',
    deviceType: 'Server',
    deviceId: 'SRV-NOD-05',
    deviceName: '計算節點主機',
    deviceBrand: 'HP',
    deviceModel: 'ProLiant DL360 Gen11',
    warrantyExpiry: '2028/08/08',
    location: 'F14',
    issueDescription: '主機板 CMOS 電池沒電，每次重開機時間都會跑掉。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/07 10:45:00', title: '案件已提交', description: '時脈同步異常', type: 'info' }
    ],
    building: 'F14',
    department: '高效能運算小組',
    priority: 'P4'
  },
  {
    id: 'GT-2026-1024',
    timestamp: '2026/05/07 13:20:30',
    status: RepairStatus.SUBMITTED,
    contactPerson: '鄧紫棋',
    contactPhone: '0912-999-888',
    contactExt: '#0808',
    contactEmail: 'gem@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-LN-ST-24',
    deviceType: 'Notebook',
    deviceId: 'NB-STUD-01',
    deviceName: '實習生公共筆電',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkPad E14 Gen 4',
    warrantyExpiry: '2026/01/01',
    location: 'F18A',
    issueDescription: '右側 USB 3.0 插孔損壞，且有焦味傳出。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/07 13:20:00', title: '案件已提交', description: '異常煙焦味告警', type: 'info' }
    ],
    building: 'F18A',
    department: '教育發展中心',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1025',
    timestamp: '2026/05/07 14:50:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '盧廣仲',
    contactPhone: '0988-121-121',
    contactExt: '#2323',
    contactEmail: 'kc_lu@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-DL-R450-25',
    deviceType: 'Server',
    deviceId: 'SRV-MON-02',
    deviceName: '機房環控主機',
    deviceBrand: 'Dell',
    deviceModel: 'PowerEdge R450',
    warrantyExpiry: '2027/04/04',
    location: 'F22',
    issueDescription: '前端進氣濾網堵塞，且風扇偵測到多組轉速不對稱。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/07 14:50:00', title: '案件已提交', description: '進氣量不足告警', type: 'info' }
    ],
    building: 'F22',
    department: '機房營運維護部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1026',
    timestamp: '2026/05/07 15:30:12',
    status: RepairStatus.SUBMITTED,
    contactPerson: '蔡健雅',
    contactPhone: '0933-777-666',
    contactExt: '#7777',
    contactEmail: 'ta_tsai@tsmc.com',
    creatorName: '報修使用者',
    serialNumber: 'NB-HP-G6-26',
    deviceType: 'Notebook',
    deviceId: 'NB-TRAIN-12',
    deviceName: '教育訓練筆電',
    deviceBrand: 'HP',
    deviceModel: 'ProBook 450 G6',
    warrantyExpiry: '2025/12/31',
    location: 'F12',
    issueDescription: '主板無法過電，接上變壓器後指示燈不亮。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/07 15:30:00', title: '案件已提交', description: '無法開機', type: 'info' }
    ],
    building: 'F12',
    department: '人力發展部',
    priority: 'P2'
  },
  {
    id: 'GT-2026-1027',
    timestamp: '2026/05/07 16:15:00',
    status: RepairStatus.SUBMITTED,
    contactPerson: '李榮浩',
    contactPhone: '0911-000-000',
    contactExt: '#9999',
    contactEmail: 'jh_lee@tsmc.com',
    creatorName: '系統管理員',
    serialNumber: 'SV-LN-SR630-27',
    deviceType: 'Server',
    deviceId: 'SRV-BACKUP-01',
    deviceName: '備份管理伺服器',
    deviceBrand: 'Lenovo',
    deviceModel: 'ThinkSystem SR630 V2',
    warrantyExpiry: '2028/11/11',
    location: 'F14',
    issueDescription: 'HBA 卡故障，導致無法連向磁帶庫磁碟陣列。',
    parts: [],
    timeline: [
      { id: '1', timestamp: '2026/05/07 16:15:00', title: '案件已提交', description: '儲存路徑中斷告警', type: 'info' }
    ],
    building: 'F14',
    department: '系統備份小組',
    priority: 'P1'
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
