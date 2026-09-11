import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, HeartHandshake, PhoneCall, ArrowUp } from 'lucide-react';

export default function QuickActionDock() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      right: '1.25rem',
      bottom: '1.5rem',
      zIndex: 990,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      alignItems: 'flex-end'
    }}>
      
      {/* Quick Calculator Action */}
      <Link 
        to="/calculator" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--gradient-gold)',
          color: '#ffffff',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 20px rgba(217, 119, 6, 0.4)',
          fontSize: '0.85rem',
          fontWeight: 700,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        className="quick-dock-btn"
        title="โปรแกรมคำนวณค่างวดเงินกู้"
      >
        <Calculator size={18} />
        <span className="hide-mobile">คำนวณเงินกู้</span>
      </Link>

      {/* Quick Dividend Estimator */}
      <Link 
        to="/dividend-estimator" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--gradient-teal)',
          color: '#ffffff',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 20px rgba(13, 148, 136, 0.4)',
          fontSize: '0.85rem',
          fontWeight: 700,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        className="quick-dock-btn"
        title="ประมาณการเงินปันผล-เฉลี่ยคืน"
      >
        <TrendingUp size={18} />
        <span className="hide-mobile">ประมาณการปันผล</span>
      </Link>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="เลื่อนขึ้นบนสุด"
        >
          <ArrowUp size={20} />
        </button>
      )}

    </div>
  );
}
