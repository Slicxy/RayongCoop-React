import React from 'react';
import { Phone, Clock, Sun, Moon, Type, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { COOP_INFO, INTEREST_RATES } from '../../data/mockData';

export default function TopBar() {
  const { theme, toggleTheme, fontSize, changeFontSize } = useTheme();

  return (
    <div style={{
      background: 'var(--primary-950)',
      color: '#cbd5e1',
      fontSize: '0.82rem',
      padding: '0.4rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        
        {/* Left: Contact Info & Rates Ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Phone size={14} style={{ color: 'var(--accent-gold)' }} />
            <span>โทร: <strong>{COOP_INFO.phone.split(',')[0]}</strong></span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} className="hide-mobile">
            <Clock size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>เวลาทำการ: 08:30 - 16:30 น.</span>
          </span>
          <span style={{ 
            background: 'rgba(245, 158, 11, 0.15)', 
            color: '#fbbf24', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }} className="hide-mobile">
            ✨ ดอกเบี้ยเงินฝากสูงสุด {INTEREST_RATES.deposits[4].rate} | กู้ฉุกเฉิน {INTEREST_RATES.loans[0].rate}
          </span>
        </div>

        {/* Right: Accessibility Controls & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Font Size Accessibility */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px 4px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginRight: '2px' }}><Type size={12} /></span>
            <button 
              onClick={() => changeFontSize('sm')} 
              style={{ padding: '2px 6px', fontSize: '0.75rem', color: fontSize === 'sm' ? '#fff' : '#94a3b8', fontWeight: fontSize === 'sm' ? '700' : '400', background: fontSize === 'sm' ? 'var(--primary-600)' : 'transparent', borderRadius: '4px' }}
              title="ขนาดอักษรเล็ก"
            >
              ก-
            </button>
            <button 
              onClick={() => changeFontSize('md')} 
              style={{ padding: '2px 6px', fontSize: '0.8rem', color: fontSize === 'md' ? '#fff' : '#94a3b8', fontWeight: fontSize === 'md' ? '700' : '400', background: fontSize === 'md' ? 'var(--primary-600)' : 'transparent', borderRadius: '4px' }}
              title="ขนาดอักษรปกติ"
            >
              ก
            </button>
            <button 
              onClick={() => changeFontSize('lg')} 
              style={{ padding: '2px 6px', fontSize: '0.9rem', color: fontSize === 'lg' ? '#fff' : '#94a3b8', fontWeight: fontSize === 'lg' ? '700' : '400', background: fontSize === 'lg' ? 'var(--primary-600)' : 'transparent', borderRadius: '4px' }}
              title="ขนาดอักษรใหญ่"
            >
              ก+
            </button>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              background: 'rgba(255,255,255,0.08)', 
              color: '#e2e8f0', 
              padding: '0.25rem 0.6rem', 
              borderRadius: '6px',
              fontSize: '0.75rem'
            }}
            title={theme === 'light' ? 'สลับเป็นโหมดกลางคืน' : 'สลับเป็นโหมดกลางวัน'}
          >
            {theme === 'light' ? <Moon size={14} style={{ color: '#fbbf24' }} /> : <Sun size={14} style={{ color: '#f59e0b' }} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
