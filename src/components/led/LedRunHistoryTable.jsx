import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Layers, User } from 'lucide-react';
import LedStatusBadge from './LedStatusBadge';

export default function LedRunHistoryTable({ runs = [], onViewRun }) {
  if (!runs || runs.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Layers className="w-10 h-10 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-medium">ยังไม่มีประวัติการตรวจสอบข้อมูลในระบบ</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-xs lg:text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
          <tr>
            <th className="py-3.5 px-4">Run #</th>
            <th className="py-3.5 px-4">ประเภท</th>
            <th className="py-3.5 px-4">ความคืบหน้า</th>
            <th className="py-3.5 px-4">ผลการคัดกรอง</th>
            <th className="py-3.5 px-4">สถานะ</th>
            <th className="py-3.5 px-4">เวลาที่เริ่ม</th>
            <th className="py-3.5 px-4 text-right">การกระทำ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {runs.map((run) => {
            const total = Number(run.total_members) || 0;
            const checked = Number(run.checked_members) || 0;
            const percent = total > 0 ? Math.min(100, Math.round((checked / total) * 100)) : 0;

            const typeConfig = {
              MANUAL: { label: 'รายบุคคล', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
              BATCH: { label: 'กลุ่ม (Batch)', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
              SCHEDULED: { label: 'อัตโนมัติ (08:00)', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
            }[run.run_type] || { label: run.run_type, color: 'bg-gray-100 text-gray-700' };

            return (
              <tr key={run.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                  #{run.id}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </td>
                <td className="py-3.5 px-4 min-w-[140px]">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{checked.toLocaleString()} / {total.toLocaleString()}</span>
                      <span className="font-semibold">{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          run.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#0B5ED7]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    {Number(run.possible_match_count) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold" title="Possible Match">
                        {run.possible_match_count} ตรง
                      </span>
                    )}
                    {Number(run.review_required_count) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-semibold" title="Review Required">
                        {run.review_required_count} รอตรวจ
                      </span>
                    )}
                    {Number(run.verified_match_count) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold" title="Verified Match">
                        {run.verified_match_count} ยืนยัน
                      </span>
                    )}
                    {Number(run.api_error_count) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold" title="API Error">
                        {run.api_error_count} Error
                      </span>
                    )}
                    {Number(run.not_found_count) > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {run.not_found_count} ปลอดภัย
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <LedStatusBadge status={run.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                  {run.started_at || run.created_at}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {onViewRun && (
                    <button
                      onClick={() => onViewRun(run.id)}
                      className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      ดูรายการ
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
