/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'login' | 'request' | 'status' | 'dashboard' | 'profile' | 'settings';
export type Theme = 'tech-blue' | 'classic-light' | 'tsmc-red';

export enum RepairStatus {
  SUBMITTED = '已報修',
  PROCESSING = '維修中',
  COMPLETED = '已完成',
  CANCELLED = '已取消',
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'process';
}

export interface DevicePart {
  id: string;
  name: string;
  partSerialNumber: string;
  quantity: number;
  replacementPartName?: string;
  replacementPartSerialNumber?: string;
  note?: string;
}

export interface RepairRequest {
  id: string;
  timestamp: string;
  status: RepairStatus;
  
  // [報修人員]
  contactPerson: string;
  contactPhone: string;
  contactExt: string;
  contactEmail: string;
  creatorName: string;

  // [設備資訊]
  serialNumber: string;
  deviceType: string;
  deviceId: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  warrantyExpiry: string;
  location: string;
  issueDescription: string;
  
  // [設備零件]
  parts?: DevicePart[];
  
  // Timeline progress
  timeline?: TimelineEvent[];

  // Display/Compatibility fields
  building: string; 
  department: string; 
  priority: string;
  assignee?: string;
}

export interface User {
  taxId: string;
  name: string;
}
