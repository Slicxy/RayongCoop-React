import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, TrendingUp, ShieldCheck, Coins, Users, Building2, 
  ArrowRight, Landmark, FileText, HeartHandshake, PhoneCall, 
  ChevronRight, Sparkles, CheckCircle2, Clock, Award, Download
} from 'lucide-react';
import { COOP_INFO, KEY_STATS, INTEREST_RATES, LOAN_PRODUCTS, NEWS_LIST, ANNOUNCEMENTS, WELFARE_ITEMS } from '../data/mockData';
import LoanCalculator from '../components/calculators/LoanCalculator';
import DividendEstimator from '../components/calculators/DividendEstimator';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { setShowAuthModal, isLoggedIn } = useAuth();
  const [activeRateTab, setActiveRateTab] = useState('deposits');
  const [activeNewsTab, setActiveNewsTab] = useState('news');

  return (
    <div>
      
      {/* =========================================================================
          HERO SECTION (High Impact Modern Banner)
          ========================================================================= */}
      <section style={{
        position: 'relative',
        background: 'var(--gradient-hero)',
        color: '#ffffff',
        padding: '5rem 0 4.5rem 0',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Background glow & shapes */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, rgba(13, 148, 136, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Left Hero Content */}
            <div className="animate-fade-in">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fbbf24',
                marginBottom: '1.25rem',
                border: '1px solid rgba(251, 191, 36, 0.3)'
              }}>
                <Sparkles size={16} />
                <span>ยินดีต้อนรับสู่ระบบสหกรณ์ดิจิทัล</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                {COOP_INFO.nameTh}
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                {COOP_INFO.slogan} มอบความมั่นคงทางการเงิน ดอกเบี้ยเงินฝากคุ้มค่า สินเชื่ออัตราดอกเบี้ยเป็นธรรม พร้อมสวัสดิการดูแลตลอดทุกช่วงชีวิต
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {isLoggedIn ? (
                  <Link to="/member/dashboard" className="btn btn-gold btn-lg">
                    <span>เข้าสู่พอร์ทัลสมาชิก</span>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="btn btn-gold btn-lg">
                    <span>เข้าสู่ระบบสมาชิก</span>
                    <ArrowRight size={18} />
                  </button>
                )}

                <Link to="/calculator" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' }}>
                  <Calculator size={18} />
                  <span>คำนวณเงินกู้</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} style={{ color: '#38bdf8' }} />
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>บริหารโปร่งใสตามหลักธรรมาภิบาล</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} style={{ color: '#fbbf24' }} />
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>ปันผลปีล่าสุด {INTEREST_RATES.deposits[4].rate}</span>
                </div>
              </div>

            </div>

            {/* Right Hero Card: Quick Rates & Services Widget */}
            <div className="glass-card" style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp style={{ color: '#fbbf24' }} size={20} />
                  <span>อัตราดอกเบี้ยเด่นวันนี้</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>อัปเดต {INTEREST_RATES.effectiveDate}</span>
              </div>

              {/* Rate Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>เงินฝากออมทรัพย์พิเศษพลัส</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>จ่ายดอกเบี้ยรายเดือน</div>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-display)' }}>
                    2.50% <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>ต่อปี</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>เงินฝากประจำ 24 เดือน</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>เกษียณเกษม สบายใจ</div>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-display)' }}>
                    3.10% <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>ต่อปี</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>เงินกู้สามัญเพื่อสวัสดิการ</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ผ่อนสูงสุด 180 งวด</div>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-display)' }}>
                    5.25% <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>ต่อปี</span>
                  </div>
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Link to="/deposits" className="btn btn-sm" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                  <span>ดูดอกเบี้ยเงินฝาก</span>
                </Link>
                <Link to="/loans" className="btn btn-sm" style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.4)' }}>
                  <span>ดูดอกเบี้ยเงินกู้</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK SERVICES GRID (บริการดิจิทัลด่วน)
          ========================================================================= */}
      <section className="section-sm" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            
            <Link to="/calculator" className="surface-card" style={quickServiceCardStyle}>
              <div style={{ ...quickServiceIconWrap, background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)' }}>
                <Calculator size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>คำนวณเงินกู้</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>จำลองค่างวดและดอกเบี้ย</p>
            </Link>

            <Link to="/dividend-estimator" className="surface-card" style={quickServiceCardStyle}>
              <div style={{ ...quickServiceIconWrap, background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)' }}>
                <TrendingUp size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>ประมาณการปันผล</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ปันผลหุ้น & เฉลี่ยคืน</p>
            </Link>

            <Link to="/verify-receipt" className="surface-card" style={quickServiceCardStyle}>
              <div style={{ ...quickServiceIconWrap, background: 'var(--primary-100)', color: 'var(--primary-700)' }}>
                <FileText size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>e-Receipt</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ตรวจสอบใบเสร็จออนไลน์</p>
            </Link>

            <Link to="/loan-checklist" className="surface-card" style={quickServiceCardStyle}>
              <div style={{ ...quickServiceIconWrap, background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald-dark)' }}>
                <CheckCircle2 size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>เช็คความพร้อมกู้</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ตรวจเอกสารและสิทธิ</p>
            </Link>

            <Link to="/welfare" className="surface-card" style={quickServiceCardStyle}>
              <div style={{ ...quickServiceIconWrap, background: 'var(--accent-rose-light)', color: 'var(--accent-rose)' }}>
                <HeartHandshake size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>สวัสดิการสมาชิก</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ทุนการศึกษา & ช่วยเหลือ</p>
            </Link>

            <Link to="/documents" className="surface-card" style={quickServiceCardStyle}>
              <div style={{ ...quickServiceIconWrap, background: 'var(--bg-subtle)', color: 'var(--text-main)' }}>
                <Download size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>ดาวน์โหลดแบบฟอร์ม</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>เอกสารคำขอทุกประเภท</p>
            </Link>

          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY COOPERATIVE STATS
          ========================================================================= */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          
          <div className="section-title-wrap">
            <span className="section-badge">ฐานะความมั่นคง</span>
            <h2 className="section-title">สถิติและผลการดำเนินงานที่โดดเด่น</h2>
            <p className="section-subtitle">ข้อมูลฐานะทางการเงินและความมั่นคงของสหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด</p>
            <div className="section-line" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            {KEY_STATS.map((stat, idx) => (
              <div key={idx} className="surface-card" style={{ padding: '1.75rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {stat.unit}
                </div>
                <div style={{ 
                  marginTop: '0.85rem', 
                  display: 'inline-block', 
                  fontSize: '0.75rem', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: 'var(--radius-full)', 
                  background: 'var(--accent-emerald-light)', 
                  color: 'var(--accent-emerald-dark)',
                  fontWeight: 600
                }}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          FEATURED FINANCIAL PRODUCTS (เงินกู้และเงินฝากยอดนิยม)
          ========================================================================= */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          
          <div className="section-title-wrap">
            <span className="section-badge">ผลิตภัณฑ์สินเชื่อ</span>
            <h2 className="section-title">สินเชื่อเพื่อบุคลากรสาธารณสุข</h2>
            <p className="section-subtitle">วงเงินกู้สูง ดอกเบี้ยต่ำ ผ่อนชำระสบาย ยื่นกู้ง่าย อนุมัติรวดเร็ว</p>
            <div className="section-line" />
          </div>

          <div className="grid-3">
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
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>วงเงินกู้</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>{prod.maxAmount}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold-dark)', marginTop: '0.25rem' }}>
                      ดอกเบี้ย {prod.interestRate}
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
                    <span>ยื่นกู้</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE LOAN CALCULATOR SUITE EMBED
          ========================================================================= */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <LoanCalculator />
        </div>
      </section>

      {/* =========================================================================
          LATEST NEWS & ANNOUNCEMENTS TABS
          ========================================================================= */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="section-badge">ข่าวสารและประกาศ</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>อัปเดตข้อมูลสหกรณ์</h2>
            </div>

            {/* Tab Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setActiveNewsTab('news')}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: activeNewsTab === 'news' ? 'var(--primary-600)' : 'transparent',
                  color: activeNewsTab === 'news' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                ข่าวประชาสัมพันธ์
              </button>
              <button
                onClick={() => setActiveNewsTab('announcements')}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: activeNewsTab === 'announcements' ? 'var(--primary-600)' : 'transparent',
                  color: activeNewsTab === 'announcements' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                ประกาศทางการ
              </button>
            </div>
          </div>

          {activeNewsTab === 'news' ? (
            <div className="grid-4">
              {NEWS_LIST.map((item) => (
                <div key={item.id} className="surface-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', background: 'var(--primary-100)', position: 'relative' }}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        <span>{item.date}</span>
                      </div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {item.excerpt.slice(0, 85)}...
                      </p>
                    </div>

                    <Link to="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                      <span>อ่านรายละเอียด</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="surface-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '10px', background: ann.important ? 'var(--accent-rose-light)' : 'var(--primary-100)', color: ann.important ? 'var(--accent-rose)' : 'var(--primary-600)' }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        {ann.important && <span className="badge badge-rose">สำคัญ</span>}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{ann.title}</h4>
                    </div>
                  </div>

                  <button className="btn btn-outline btn-sm" onClick={() => alert(`ดาวน์โหลดไฟล์: ${ann.title} (${ann.fileSize})`)}>
                    <Download size={14} />
                    <span>ดาวน์โหลด ({ann.fileSize})</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/news" className="btn btn-outline">
              <span>ดูข่าวสารและประกาศทั้งหมด</span>
              <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MEMBER WELFARE HIGHLIGHTS
          ========================================================================= */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          
          <div className="section-title-wrap">
            <span className="section-badge">สวัสดิการสมาชิก</span>
            <h2 className="section-title">ดูแลสมาชิกและครอบครัวในทุกช่วงชีวิต</h2>
            <p className="section-subtitle">กองทุนสวัสดิการมอบความช่วยเหลือและสิทธิประโยชน์เพื่อสร้างความอุ่นใจแด่มวลสมาชิก</p>
            <div className="section-line" />
          </div>

          <div className="grid-3">
            {WELFARE_ITEMS.slice(0, 6).map((item, idx) => (
              <div key={idx} className="surface-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-teal">{item.category}</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '0.4rem' }}>{item.title}</h4>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-teal-dark)', marginBottom: '0.65rem' }}>
                  {item.amount}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/welfare" className="btn btn-teal">
              <span>ดูระเบียบและสวัสดิการทั้งหมด</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

const quickServiceCardStyle = {
  padding: '1.25rem 1rem',
  textAlign: 'center',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'var(--text-main)'
};

const quickServiceIconWrap = {
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.75rem'
};
