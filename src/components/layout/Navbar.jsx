import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, UserCheck, Calculator, 
  Landmark, ShieldCheck, HeartHandshake, FileText, 
  Bell, PhoneCall, LayoutDashboard, LogIn, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COOP_INFO } from '../../data/mockData';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isLoggedIn, setShowAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: isScrolled ? 'var(--glass-bg)' : 'var(--bg-surface)',
      backdropFilter: isScrolled ? 'var(--glass-blur)' : 'none',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem' }}>
        
        {/* Logo & Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <img 
            src="/assets/img/logo.webp" 
            alt="Logo" 
            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
            onError={(e) => { e.target.src = '/img/logo.webp'; }}
          />
          <div>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 800, 
              fontSize: '1.15rem', 
              color: 'var(--primary-700)', 
              lineHeight: 1.2 
            }}>
              {COOP_INFO.nameTh}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)', 
              fontWeight: 500,
              letterSpacing: '0.02em' 
            }}>
              {COOP_INFO.nameEn}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            style={navLinkStyle(isActive('/'))}
          >
            หน้าแรก
          </Link>

          {/* Dropdown: เกี่ยวกับเรา */}
          <div style={{ position: 'relative' }} onMouseLeave={() => setActiveDropdown(null)}>
            <button 
              onClick={() => toggleDropdown('about')}
              onMouseEnter={() => setActiveDropdown('about')}
              style={{ ...navLinkStyle(isActive('/about') || isActive('/board') || isActive('/statistics')), display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>เกี่ยวกับเรา</span>
              <ChevronDown size={14} />
            </button>
            {activeDropdown === 'about' && (
              <div className="dropdown-menu" style={dropdownMenuStyle}>
                <Link to="/about" style={dropdownItemStyle}>
                  <Landmark size={16} style={{ color: 'var(--primary-600)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>ประวัติและวิสัยทัศน์</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ความเป็นมาและพันธกิจ</div>
                  </div>
                </Link>
                <Link to="/board" style={dropdownItemStyle}>
                  <Award size={16} style={{ color: 'var(--accent-gold-dark)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>คณะกรรมการดำเนินการ</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>และฝ่ายจัดการบริหาร</div>
                  </div>
                </Link>
                <Link to="/statistics" style={dropdownItemStyle}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent-teal)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>ฐานะและสถิติทางการเงิน</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ความมั่นคงของสหกรณ์</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Dropdown: บริการการเงิน */}
          <div style={{ position: 'relative' }} onMouseLeave={() => setActiveDropdown(null)}>
            <button 
              onClick={() => toggleDropdown('financial')}
              onMouseEnter={() => setActiveDropdown('financial')}
              style={{ ...navLinkStyle(isActive('/deposits') || isActive('/loans') || isActive('/calculator') || isActive('/loan-checklist') || isActive('/dividend-estimator')), display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>บริการทางการเงิน</span>
              <ChevronDown size={14} />
            </button>
            {activeDropdown === 'financial' && (
              <div className="dropdown-menu" style={dropdownMenuStyle}>
                <Link to="/deposits" style={dropdownItemStyle}>
                  <Landmark size={16} style={{ color: 'var(--accent-teal)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>เงินฝากและดอกเบี้ย</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ออมทรัพย์ และเงินฝากประจำ</div>
                  </div>
                </Link>
                <Link to="/loans" style={dropdownItemStyle}>
                  <ShieldCheck size={16} style={{ color: 'var(--primary-600)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>ผลิตภัณฑ์สินเชื่อ</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ฉุกเฉิน, สามัญ, พิเศษ</div>
                  </div>
                </Link>
                <Link to="/calculator" style={dropdownItemStyle}>
                  <Calculator size={16} style={{ color: 'var(--accent-gold-dark)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>โปรแกรมคำนวณเงินกู้</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>คำนวณค่างวดและดอกเบี้ย</div>
                  </div>
                </Link>
                <Link to="/loan-checklist" style={dropdownItemStyle}>
                  <FileText size={16} style={{ color: 'var(--accent-emerald)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>เช็คความพร้อมการกู้</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ตรวจคุณสมบัติและเอกสาร</div>
                  </div>
                </Link>
                <Link to="/dividend-estimator" style={dropdownItemStyle}>
                  <Award size={16} style={{ color: 'var(--accent-rose)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>ประมาณการเงินปันผล</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>และเงินเฉลี่ยคืนสิ้นปี</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link to="/welfare" style={navLinkStyle(isActive('/welfare'))}>สวัสดิการ</Link>
          <Link to="/eservice" style={navLinkStyle(isActive('/eservice'))}>e-Services</Link>
          <Link to="/news" style={navLinkStyle(isActive('/news'))}>ข่าวสาร</Link>
          <Link to="/documents" style={navLinkStyle(isActive('/documents'))}>ดาวน์โหลด</Link>
          <Link to="/contact" style={navLinkStyle(isActive('/contact'))}>ติดต่อเรา</Link>

        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          <Link to="/calculator" className="btn btn-gold btn-sm hide-mobile" style={{ fontSize: '0.85rem' }}>
            <Calculator size={15} />
            <span>คำนวณเงินกู้</span>
          </Link>

          {isLoggedIn ? (
            <Link to="/member/dashboard" className="btn btn-primary btn-sm" style={{ fontSize: '0.85rem' }}>
              <LayoutDashboard size={15} />
              <span>พอร์ทัลสมาชิก</span>
            </Link>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.85rem' }}
            >
              <LogIn size={15} />
              <span>เข้าสู่ระบบสมาชิก</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="show-mobile-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              padding: '0.5rem', 
              color: 'var(--text-main)', 
              background: 'var(--bg-subtle)', 
              borderRadius: '8px',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <Link to="/" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>หน้าแรก</Link>
          <Link to="/about" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>เกี่ยวกับสหกรณ์</Link>
          <Link to="/board" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>คณะกรรมการและฝ่ายจัดการ</Link>
          <Link to="/statistics" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ฐานะทางการเงินและสถิติ</Link>
          <Link to="/deposits" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>เงินฝากและอัตราดอกเบี้ย</Link>
          <Link to="/loans" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ผลิตภัณฑ์สินเชื่อ</Link>
          <Link to="/calculator" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>โปรแกรมคำนวณเงินกู้</Link>
          <Link to="/dividend-estimator" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ประมาณการปันผล-เฉลี่ยคืน</Link>
          <Link to="/welfare" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>สวัสดิการสมาชิก</Link>
          <Link to="/eservice" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ศูนย์บริการออนไลน์ (e-Services)</Link>
          <Link to="/news" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ข่าวสารและประกาศ</Link>
          <Link to="/documents" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ดาวน์โหลดแบบฟอร์ม</Link>
          <Link to="/verify-receipt" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ตรวจสอบใบเสร็จออนไลน์</Link>
          <Link to="/contact" style={mobileItemStyle} onClick={() => setMobileMenuOpen(false)}>ติดต่อเรา / ร้องเรียน</Link>
        </div>
      )}
    </header>
  );
}

const navLinkStyle = (active) => ({
  padding: '0.5rem 0.85rem',
  fontSize: '0.92rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: active ? '700' : '500',
  color: active ? 'var(--primary-600)' : 'var(--text-main)',
  borderRadius: '8px',
  background: active ? 'var(--primary-50)' : 'transparent',
  transition: 'all 0.2s ease',
  cursor: 'pointer'
});

const dropdownMenuStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  minWidth: '240px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  boxShadow: 'var(--shadow-xl)',
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  zIndex: 1050
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.6rem 0.85rem',
  borderRadius: '8px',
  fontSize: '0.88rem',
  color: 'var(--text-main)',
  transition: 'background 0.15s ease'
};

const mobileItemStyle = {
  padding: '0.65rem 0',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 600,
  color: 'var(--text-main)',
  borderBottom: '1px solid var(--border-subtle)'
};
