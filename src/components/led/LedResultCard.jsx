import React from 'react';
import { User, Eye, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import LedStatusBadge from './LedStatusBadge';
import LedWarningNotice from './LedWarningNotice';

export default function LedResultCard({ result, onOpenReview }) {
  if (!result) return null;

  const evaluation = result.evaluation || {};
  const status = evaluation.status || result.status;
  const matchScore = evaluation.match_score ?? result.match_score ?? 0;
  const matchReason = evaluation.match_reason || result.match_reason || '-';
  const candidates = evaluation.candidates || [];
  const member = result.member || {};

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 lg:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#073B74] dark:text-blue-300 flex items-center justify-center font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white">
              {member.name || `${member.prefix || ''} ${member.first_name || ''} ${member.last_name || ''}`.trim()}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>เลขสมาชิก: <strong>{member.member_no}</strong></span>
              <span>•</span>
              <span>สังกัด: {member.department || '-'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LedStatusBadge status={status} size="lg" showSublabel />
        </div>
      </div>

      {/* Match Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">ระดับความสอดคล้อง (Match Score)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {matchScore ? Number(matchScore).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">จำนวนที่พบในฐานข้อมูล LED</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {result.api_total ?? candidates.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">เวลาที่ตรวจสอบ</span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">
            {result.checked_at || new Date().toLocaleString('th-TH')}
          </p>
        </div>
      </div>

      {/* Score Explanation */}
      <div className="text-sm space-y-1">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          เหตุผลการประเมินคะแนนเบื้องต้น:
        </span>
        <p className="text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs lg:text-sm">
          {matchReason}
        </p>
      </div>

      {/* Candidates Preview */}
      {candidates.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              รายการที่อาจตรงกัน ({candidates.length})
            </span>
            {onOpenReview && (
              <button
                onClick={() => onOpenReview(result.result_id || result.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B5ED7] hover:text-[#073B74] dark:text-blue-400 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                ดูรายละเอียดและรีวิวผล
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {candidates.slice(0, 3).map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.normalized_name || c.external_data?.COURT_NAME || 'รายการข้อมูลคดี'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {c.match_reason || 'คำค้นใกล้เคียง'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {c.match_score ? Number(c.match_score).toFixed(0) : '0'}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <LedWarningNotice compact />
    </div>
  );
}
