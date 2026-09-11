import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle2, AlertCircle, Sparkles, FileCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoanReadinessChecklist() {
  const [checklist, setChecklist] = useState({
    membership6Months: true,
    salaryRemain30Percent: true,
    noDefaultRecord: true,
    guarantorReady: false,
    payslipReady: true,
    idCardReady: true,
    bankBookReady: false
  });

  const toggleItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = Object.keys(checklist).length;
  const checkedItems = Object.values(checklist).filter(Boolean).length;
  const percentage = Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck className="text-primary" />
          <span>ระบบตรวจสอบความพร้อมและคุณสมบัติการกู้เงิน (Loan Readiness Checklist)</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ตรวจสอบความพร้อมก่อนยื่นคำขอกู้เงินสามัญ / ฉุกเฉิน เพื่อให้การอนุมัติเป็นไปอย่างรวดเร็ว
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem', background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>ระดับความพร้อมของคุณ:</span>
          <span style={{ 
            fontWeight: 800, 
            fontSize: '1.2rem', 
            color: percentage === 100 ? 'var(--accent-emerald-dark)' : percentage >= 70 ? 'var(--primary-600)' : 'var(--accent-gold-dark)' 
          }}>
            {percentage}% ({checkedItems}/{totalItems} รายการ)
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: percentage === 100 ? 'var(--gradient-teal)' : percentage >= 70 ? 'var(--gradient-primary)' : 'var(--gradient-gold)', 
            transition: 'width 0.4s ease' 
          }} />
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {percentage === 100 ? (
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={16} /> ยอดเยี่ยม! คุณมีคุณสมบัติและเอกสารครบถ้วน พร้อมยื่นกู้ได้ทันที
            </span>
          ) : (
            <span>กรุณาเตรียมรายการที่ยังไม่ได้ติ๊กเลือกให้ครบถ้วนก่อนยื่นคำขอ</span>
          )}
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        
        {/* Category 1: Qualifications */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', marginBottom: '0.75rem', borderBottom: '2px solid var(--primary-200)', paddingBottom: '0.3rem' }}>
            1. คุณสมบัติของผู้กู้
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div onClick={() => toggleItem('membership6Months')} style={checkItemStyle(checklist.membership6Months)}>
              {checklist.membership6Months ? <CheckSquare size={20} style={{ color: 'var(--primary-600)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>เป็นสมาชิกสหกรณ์ฯ มาแล้วไม่น้อยกว่า 6 เดือน</span>
            </div>

            <div onClick={() => toggleItem('salaryRemain30Percent')} style={checkItemStyle(checklist.salaryRemain30Percent)}>
              {checklist.salaryRemain30Percent ? <CheckSquare size={20} style={{ color: 'var(--primary-600)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>มีเงินเดือนสุทธิคงเหลือหลังหักส่งไม่น้อยกว่า 30%</span>
            </div>

            <div onClick={() => toggleItem('noDefaultRecord')} style={checkItemStyle(checklist.noDefaultRecord)}>
              {checklist.noDefaultRecord ? <CheckSquare size={20} style={{ color: 'var(--primary-600)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>ไม่มีประวัติการผิดนัดชำระหนี้กับสหกรณ์</span>
            </div>

            <div onClick={() => toggleItem('guarantorReady')} style={checkItemStyle(checklist.guarantorReady)}>
              {checklist.guarantorReady ? <CheckSquare size={20} style={{ color: 'var(--primary-600)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>มีสมาชิกค้ำประกันตามเกณฑ์ หรือใช้หุ้นค้ำประกัน</span>
            </div>
          </div>
        </div>

        {/* Category 2: Documents */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--accent-teal-dark)', marginBottom: '0.75rem', borderBottom: '2px solid var(--accent-teal-light)', paddingBottom: '0.3rem' }}>
            2. เอกสารหลักฐานประกอบ
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div onClick={() => toggleItem('payslipReady')} style={checkItemStyle(checklist.payslipReady)}>
              {checklist.payslipReady ? <CheckSquare size={20} style={{ color: 'var(--accent-teal)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>สลิปเงินเดือนฉบับจริง หรือพิมพ์จากระบบย้อนหลัง 3 เดือน</span>
            </div>

            <div onClick={() => toggleItem('idCardReady')} style={checkItemStyle(checklist.idCardReady)}>
              {checklist.idCardReady ? <CheckSquare size={20} style={{ color: 'var(--accent-teal)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>สำเนาบัตรประชาชน และสำเนาทะเบียนบ้าน (พร้อมรับรองสำเนา)</span>
            </div>

            <div onClick={() => toggleItem('bankBookReady')} style={checkItemStyle(checklist.bankBookReady)}>
              {checklist.bankBookReady ? <CheckSquare size={20} style={{ color: 'var(--accent-teal)' }} /> : <Square size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{ fontSize: '0.9rem' }}>สำเนาหน้าสมุดบัญชีเงินฝากสำหรับโอนเงินกู้เข้า</span>
            </div>
          </div>
        </div>

      </div>

      {/* CTA Box */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/documents" className="btn btn-outline">
          <span>ดาวน์โหลดแบบฟอร์มกู้เงิน</span>
        </Link>
        <Link to="/eservice" className="btn btn-primary">
          <span>ยื่นคำขอกู้เงินออนไลน์</span>
          <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
}

const checkItemStyle = (checked) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.65rem 0.85rem',
  background: checked ? 'var(--bg-subtle)' : 'var(--bg-surface)',
  border: checked ? '1px solid var(--primary-300)' : '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
});
