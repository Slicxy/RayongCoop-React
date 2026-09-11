import React from 'react';
import { ShieldCheck, Calculator, FileCheck, CheckCircle2, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOAN_PRODUCTS, INTEREST_RATES } from '../data/mockData';

export default function LoansPage() {
  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">ผลิตภัณฑ์สินเชื่อ</span>
          <h1 className="section-title">สินเชื่อและอัตราดอกเบี้ยเงินกู้</h1>
          <p className="section-subtitle">บริการทางการเงินเพื่อสวัสดิการและยกระดับคุณภาพชีวิตของสมาชิก</p>
          <div className="section-line" />
        </div>

        {/* Loan Products Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {LOAN_PRODUCTS.map((prod) => (
            <div key={prod.id} className="surface-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className={`badge badge-${prod.badgeColor}`}>{prod.badge}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.period}</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-800)', marginBottom: '0.4rem' }}>{prod.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{prod.subtitle}</p>

                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>วงเงินกู้สูงสุด</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>{prod.maxAmount}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold-dark)', marginTop: '0.25rem' }}>
                    อัตราดอกเบี้ย {prod.interestRate}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    หลักประกัน: {prod.guarantee}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  {prod.features.map((feat, fidx) => (
                    <li key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/calculator" className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                  <span>คำนวณค่างวด</span>
                </Link>
                <Link to="/eservice" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <span>ยื่นคำขอกู้</span>
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Loan Interest Rate Table */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-800)' }}>ตารางประกาศอัตราดอกเบี้ยเงินกู้</h3>
            <span className="badge badge-primary">คิดดอกเบี้ยแบบลดต้นลดดอก</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem' }}>ประเภทเงินกู้</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>อัตราดอกเบี้ย (% ต่อปี)</th>
                  <th style={{ padding: '0.85rem' }}>ระยะเวลาผ่อนสูงสุด</th>
                  <th style={{ padding: '0.85rem' }}>หลักประกัน</th>
                </tr>
              </thead>
              <tbody>
                {INTEREST_RATES.loans.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem', fontWeight: 600 }}>{item.type}</td>
                    <td style={{ padding: '0.85rem', textAlign: 'center', fontWeight: 800, color: 'var(--accent-gold-dark)', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
                      {item.rate}
                    </td>
                    <td style={{ padding: '0.85rem' }}>{item.maxTerm}</td>
                    <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>{item.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loan Tools Banner */}
        <div style={{
          background: 'var(--gradient-hero)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.4rem' }}>ต้องการตรวจเช็คความพร้อมและเอกสารก่อนยื่นกู้?</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>ใช้เครื่องมือตรวจสอบคุณสมบัติ หรือดาวน์โหลดแบบฟอร์มเพื่อเตรียมยื่นเรื่อง</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/loan-checklist" className="btn btn-gold">
              <FileCheck size={18} />
              <span>ตรวจเช็คความพร้อมกู้</span>
            </Link>
            <Link to="/documents" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>
              <Download size={18} />
              <span>ดาวน์โหลดแบบฟอร์ม</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
