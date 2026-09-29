import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Search, CheckSquare, Layers, Database,
  ShieldCheck, ArrowLeft, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LedSubNav({ pendingReviewCount = 0 }) {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  const backUrl = isStaff ? '/staff/dashboard' : '/admin/dashboard';
  const backTitle = isStaff ? 'กลับสู่หน้า Staff Portal' : 'กลับสู่หน้า Admin Portal';

  const navItems = [
    {
      to: '/admin/led/dashboard',
      label: 'แดชบอร์ดสรุปผล',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/led/search',
      label: 'ค้นหาและตรวจรายคน',
      icon: Search,
    },
    {
      to: '/admin/led/review',
      label: 'คิวตรวจสอบผล (Review)',
      icon: CheckSquare,
      badge: pendingReviewCount > 0 ? pendingReviewCount : null,
    },
    {
      to: '/admin/led/batch',
      label: 'ตรวจสอบแบบกลุ่ม (Batch)',
      icon: Layers,
    },
    {
      to: '/admin/led/schema',
      label: 'Schema Discovery',
      icon: Database,
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <NavLink
            to={backUrl}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={backTitle}
          >
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#073B74] dark:bg-blue-600 text-white shadow-sm dark:shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                RYCOOP LED Member Check
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ระบบตรวจสอบสมาชิกสหกรณ์กับข้อมูลเปิดกรมบังคับคดี (Legal Execution Department)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>สิทธิ์: {isStaff ? 'Staff (สิทธิ์ตัดสินใจและดูเทียบเท่า Admin)' : 'Super Admin'}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#073B74] dark:bg-blue-600 text-white shadow-sm dark:shadow-[0_0_15px_rgba(37,99,235,0.35)] font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500 text-white shrink-0">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
