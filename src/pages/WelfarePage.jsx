import React from 'react';
import { ArrowRight, HeartHandshake, ShieldCheck, Heart, Award, GraduationCap, Gift, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WELFARE_ITEMS } from '../data/mockData';

const ICONS = {
  HeartHandshake: HeartHandshake,
  Heart: Heart,
  GraduationCap: GraduationCap,
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
          <p className="section-subtitle">รายการสวัสดิการที่พบเอกสารหรือประกาศเผยแพร่จากสหกรณ์</p>
          <div className="section-line" />
        </div>

        {/* Welfare Cards Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {WELFARE_ITEMS.map((item) => {
            const IconComponent = ICONS[item.icon] || HeartHandshake;
            return (
              <article key={item.id} className="surface-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComponent size={24} />
                    </div>
                    <span className="badge badge-teal">{item.category}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '0.4rem' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-teal-dark)', marginBottom: '0.75rem' }}>
                    {item.status}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                    โปรดตรวจสอบระเบียบและประกาศฉบับล่าสุดกับสหกรณ์ก่อนยื่นคำขอ
                  </p>
                  <Link to={`/welfare/${item.id}`} className="btn btn-outline btn-sm" aria-label={`ดูรายละเอียด${item.title}`}>
                    ดูรายละเอียด <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Welfare guidance */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-teal-dark)' }} aria-hidden="true" />
            <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-800)' }}>ก่อนยื่นขอรับสวัสดิการ</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            สิทธิ วงเงิน เอกสารประกอบ และช่วงเวลารับยื่นอาจเปลี่ยนแปลงตามระเบียบหรือประกาศของสหกรณ์ จึงควรยืนยันข้อมูลล่าสุดกับเจ้าหน้าที่ทุกครั้ง
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 1</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>เลือกประเภทสวัสดิการ</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>พิจารณารายการที่ตรงกับกรณีของสมาชิกหรือครอบครัว</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 2</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>ยืนยันระเบียบล่าสุด</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ตรวจสอบคุณสมบัติ วงเงิน และกำหนดเวลารับยื่นกับสหกรณ์ก่อนดำเนินการ</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 3</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>เตรียมแบบคำขอและหลักฐาน</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ใช้แบบคำขอของสหกรณ์และจัดเตรียมเอกสารตามประเภทสวัสดิการที่ยื่น</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>ขั้นตอนที่ 4</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>ยื่นตามช่องทางที่สหกรณ์กำหนด</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ติดต่อสำนักงานสหกรณ์เพื่อยื่นคำขอและติดตามขั้นตอนการพิจารณา</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
