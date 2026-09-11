import React from 'react';
import { HeartHandshake, Download, CheckCircle2, ShieldCheck, Heart, Award, GraduationCap, Stethoscope, Gift, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WELFARE_ITEMS } from '../data/mockData';

const ICONS = {
  HeartHandshake: HeartHandshake,
  GraduationCap: GraduationCap,
  Stethoscope: Stethoscope,
  Gift: Gift,
  Award: Award,
  ShieldAlert: ShieldAlert,
};

export default function WelfarePage() {
  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">กองทุนสวัสดิการ</span>
          <h1 className="section-title">สวัสดิการสมาชิกและครอบครัว</h1>
          <p className="section-subtitle">ความคุ้มครองและเงินช่วยเหลือเพื่อยกระดับคุณภาพชีวิตและสร้างความอุ่นใจแด่มวลสมาชิก</p>
          <div className="section-line" />
        </div>

        {/* Welfare Cards Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {WELFARE_ITEMS.map((item, idx) => {
            const IconComponent = ICONS[item.icon] || HeartHandshake;
            return (
              <div key={idx} className="surface-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent size={24} />
                    </div>
                    <span className="badge badge-teal">{item.category}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '0.4rem' }}>{item.title}</h3>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-teal-dark)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                    {item.amount}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link to="/documents" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                    <Download size={14} />
                    <span>ดาวน์โหลดแบบขอรับสวัสดิการ</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim Procedure Guide */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>
            ขั้นตอนการขอรับเงินสวัสดิการ
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 1</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>ดาวน์โหลดและกรอกแบบฟอร์ม</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ดาวน์โหลดแบบขอรับสวัสดิการตามประเภทที่ต้องการ พร้อมแนบเอกสารหลักฐาน</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 2</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>ยื่นเอกสาร</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ยื่นเอกสาร ณ สำนักงานสหกรณ์ หรือผ่านระบบ e-Services ภายในเวลาที่กำหนด</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 3</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>ตรวจสอบและอนุมัติ</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>เจ้าหน้าที่ตรวจสอบคุณสมบัติและนำเสนอคณะกรรมการอนุมัติจ่ายเงิน</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 4</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>โอนเงินสวัสดิการ</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>สหกรณ์โอนเงินเข้าบัญชีเงินฝากของสมาชิกโดยตรง พร้อม SMS แจ้งเตือน</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
