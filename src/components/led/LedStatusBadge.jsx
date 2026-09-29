import React from 'react';
import {
  CheckCircle2, AlertTriangle, AlertCircle, XCircle,
  HelpCircle, ShieldAlert, Clock
} from 'lucide-react';

const STATUS_CONFIG = {
  NOT_FOUND: {
    label: 'ไม่พบข้อมูล',
    sublabel: 'ปลอดภัยเบื้องต้น',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    icon: CheckCircle2,
    badgeColor: 'text-slate-500',
  },
  POSSIBLE_MATCH: {
    label: 'อาจตรงกัน',
    sublabel: 'รอเจ้าหน้าที่ตรวจสอบ',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700/60',
    icon: AlertTriangle,
    badgeColor: 'text-amber-500',
  },
  MULTIPLE_MATCH: {
    label: 'พบหลายรายการ',
    sublabel: 'รอตรวจสอบคดี',
    bg: 'bg-amber-100 dark:bg-amber-900/50',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-400 dark:border-amber-600',
    icon: AlertTriangle,
    badgeColor: 'text-amber-600',
  },
  REVIEW_REQUIRED: {
    label: 'ต้องตรวจสอบ',
    sublabel: 'คล้ายคลึงบางส่วน',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-800 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700/60',
    icon: HelpCircle,
    badgeColor: 'text-orange-500',
  },
  VERIFIED_MATCH: {
    label: 'ตรงกัน (ยืนยันแล้ว)',
    sublabel: 'ผ่านการตรวจโดยเจ้าหน้าที่',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-800 dark:text-rose-200 font-semibold',
    border: 'border-rose-400 dark:border-rose-700',
    icon: ShieldAlert,
    badgeColor: 'text-rose-600',
  },
  FALSE_MATCH: {
    label: 'ไม่ตรงกัน (ยืนยันแล้ว)',
    sublabel: 'คนละบุคคล/ข้อมูลคลาดเคลื่อน',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: CheckCircle2,
    badgeColor: 'text-emerald-600',
  },
  API_ERROR: {
    label: 'API ขัดข้อง',
    sublabel: 'ไม่สามารถตรวจได้',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    icon: XCircle,
    badgeColor: 'text-red-500',
  },
  PENDING: {
    label: 'รอดำเนินการ',
    sublabel: 'อยู่ในคิวตรวจ',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Clock,
    badgeColor: 'text-blue-500',
  },
  RUNNING: {
    label: 'กำลังตรวจสอบ',
    sublabel: 'ระบบกำลังประมวลผล',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: Clock,
    badgeColor: 'text-indigo-500',
  },
  COMPLETED: {
    label: 'เสร็จสมบูรณ์',
    sublabel: 'ตรวจครบทุกรายการ',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: CheckCircle2,
    badgeColor: 'text-emerald-500',
  },
  PARTIAL: {
    label: 'เสร็จบางส่วน',
    sublabel: 'มีข้อผิดพลาดบางรายการ',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    icon: AlertTriangle,
    badgeColor: 'text-amber-500',
  },
  FAILED: {
    label: 'ล้มเหลว',
    sublabel: 'เกิดข้อผิดพลาดในการประมวลผล',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    icon: XCircle,
    badgeColor: 'text-red-500',
  },
};

export default function LedStatusBadge({ status, size = 'md', showSublabel = false }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'ไม่ระบุ',
    sublabel: '',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: AlertCircle,
    badgeColor: 'text-gray-500',
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-colors ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      title={`${config.label}${config.sublabel ? ' - ' + config.sublabel : ''}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.badgeColor}`} />
      <span className="truncate">{config.label}</span>
      {showSublabel && config.sublabel && (
        <span className="text-[10px] opacity-75 font-normal ml-0.5">({config.sublabel})</span>
      )}
    </span>
  );
}
