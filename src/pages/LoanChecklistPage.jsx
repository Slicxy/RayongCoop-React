import React from 'react';
import LoanReadinessChecklist from '../components/calculators/LoanReadinessChecklist';

export default function LoanChecklistPage() {
  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">ตรวจสอบสิทธิ์</span>
          <h1 className="section-title">เช็คความพร้อมก่อนยื่นกู้</h1>
          <p className="section-subtitle">ตรวจสอบคุณสมบัติและเอกสารประกอบการขอกู้เงินเพื่อความสะดวกรวดเร็วในการอนุมัติ</p>
          <div className="section-line" />
        </div>

        <LoanReadinessChecklist />

      </div>
    </div>
  );
}
