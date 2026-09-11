import React from 'react';
import { TrendingUp, ShieldCheck, PieChart, BarChart3, Award } from 'lucide-react';
import { KEY_STATS } from '../data/mockData';

const DIVIDEND_HISTORY = [
  { year: '2566', dividend: '5.25%', refund: '12.50%', shares: '1,845.50 ล้านบาท', netProfit: '98.40 ล้านบาท' },
  { year: '2565', dividend: '5.20%', refund: '12.00%', shares: '1,710.20 ล้านบาท', netProfit: '92.15 ล้านบาท' },
  { year: '2564', dividend: '5.15%', refund: '11.50%', shares: '1,590.80 ล้านบาท', netProfit: '86.70 ล้านบาท' },
  { year: '2563', dividend: '5.00%', refund: '11.00%', shares: '1,480.00 ล้านบาท', netProfit: '80.25 ล้านบาท' },
  { year: '2562', dividend: '5.25%', refund: '12.00%', shares: '1,390.40 ล้านบาท', netProfit: '76.80 ล้านบาท' },
];

export default function StatisticsPage() {
  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">ความมั่นคงทางการเงิน</span>
          <h1 className="section-title">ฐานะทางการเงินและสถิติ</h1>
          <p className="section-subtitle">รายงานผลการดำเนินงาน อัตราการเติบโต และประวัติการจ่ายเงินปันผล-เงินเฉลี่ยคืน</p>
          <div className="section-line" />
        </div>

        {/* Key Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {KEY_STATS.map((stat, idx) => (
            <div key={idx} className="surface-card" style={{ padding: '1.75rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {stat.unit}
              </div>
              <div style={{ marginTop: '0.75rem', display: 'inline-block', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald-dark)', fontWeight: 600 }}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Dividend History Table Card */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Award size={24} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-800)' }}>ประวัติการจ่ายเงินปันผลและเงินเฉลี่ยคืน ย้อนหลัง 5 ปี</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ผลตอบแทนที่สหกรณ์ส่งมอบคืนสู่สมาชิกอย่างสม่ำเสมอ</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem' }}>ปีบัญชี (พ.ศ.)</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>เงินปันผลตามหุ้น</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>เงินเฉลี่ยคืนตามดอกเบี้ย</th>
                  <th style={{ padding: '0.85rem', textAlign: 'right' }}>ทุนเรือนหุ้นสะสม</th>
                  <th style={{ padding: '0.85rem', textAlign: 'right' }}>กำไรสุทธิประจำปี</th>
                </tr>
              </thead>
              <tbody>
                {DIVIDEND_HISTORY.map((row) => (
                  <tr key={row.year} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem', fontWeight: 700, color: 'var(--primary-700)' }}>{row.year}</td>
                    <td style={{ padding: '0.85rem', textAlign: 'center', fontWeight: 700, color: 'var(--accent-gold-dark)' }}>{row.dividend}</td>
                    <td style={{ padding: '0.85rem', textAlign: 'center', fontWeight: 700, color: 'var(--accent-teal-dark)' }}>{row.refund}</td>
                    <td style={{ padding: '0.85rem', textAlign: 'right' }}>{row.shares}</td>
                    <td style={{ padding: '0.85rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-emerald-dark)' }}>{row.netProfit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
