import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function LedWarningNotice({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
        <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong>ข้อกำหนดทางกฎหมาย:</strong> ผลการค้นหานี้เป็นข้อมูลเพื่อช่วยคัดกรองเท่านั้น ต้องตรวจสอบข้อมูลกับแหล่งข้อมูลต้นทางและยืนยันโดยเจ้าหน้าที่ก่อนนำไปใช้ประกอบการดำเนินการ
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 p-4 lg:p-5 shadow-sm text-amber-950 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs lg:text-sm">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            คำเตือนและข้อกำหนดทางกฎหมาย (Legal Compliance & PDPA Disclaimer)
          </h4>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            “ผลการค้นหานี้เป็นข้อมูลเพื่อช่วยคัดกรองเท่านั้น ต้องตรวจสอบข้อมูลกับแหล่งข้อมูลต้นทางและยืนยันโดยเจ้าหน้าที่ก่อนนำไปใช้ประกอบการดำเนินการ”
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-700 dark:text-amber-400 pt-1">
            <li>ห้ามสรุปอัตโนมัติว่าสมาชิกเป็นบุคคลล้มละลาย มีคดี หรือติด Blacklist เด็ดขาด</li>
            <li>การพบชื่อในฐานข้อมูล Open Data เป็นเพียงผลคัดกรองเบื้องต้นจากคำค้นเท่านั้น</li>
            <li>เฉพาะเจ้าหน้าที่ที่มีสิทธิ์เท่านั้นที่สามารถยืนยันผลการตัดสิน (Verified / False Match) ได้</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
