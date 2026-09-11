import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, User, KeyRound, ShieldAlert, Sparkles, CheckCircle2, Shield, UserCheck, Search, Briefcase } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { COOP_INFO } from '../../data/mockData';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('member');
  const [username, setUsername] = useState('04892');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!showAuthModal) return null;

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const demo = DEMO_USERS[roleKey];
    if (demo) {
      setUsername(demo.username);
      setPassword(demo.password);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!username || !password) {
        setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        setLoading(false);
        return;
      }

      login(username, password);
      setLoading(false);
      navigate('/member/dashboard');
    }, 300);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div 
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        {/* Header Banner */}
        <div style={{
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          padding: '1.5rem 1.5rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button 
            onClick={() => setShowAuthModal(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'rgba(255,255,255,0.8)',
              padding: '0.25rem',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
            <img 
              src="/assets/img/logo.webp" 
              alt="Logo" 
              style={{ width: '34px', height: '34px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = '/img/logo.webp'; }}
            />
          </div>

          <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.2rem' }}>ระบบเข้าสู่ระบบแบบแบ่งสิทธิ์ (Role-Based Access)</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>{COOP_INFO.nameTh}</p>
        </div>

        {/* 4 Roles Quick Selection Pills */}
        <div style={{ padding: '0.85rem 1.25rem 0 1.25rem', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            เลือกสิทธิ์การใช้งาน (Role) เพื่อทดสอบ:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', paddingBottom: '0.85rem' }}>
            
            <button
              type="button"
              onClick={() => handleRoleSelect('super_admin')}
              style={roleBtnStyle(selectedRole === 'super_admin')}
            >
              <span>👑 Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('staff')}
              style={roleBtnStyle(selectedRole === 'staff')}
            >
              <span>💼 เจ้าหน้าที่สินเชื่อ</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('auditor')}
              style={roleBtnStyle(selectedRole === 'auditor')}
            >
              <span>🔍 ผู้ตรวจสอบกิจการ</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('member')}
              style={roleBtnStyle(selectedRole === 'member')}
            >
              <span>👤 สมาชิกสหกรณ์</span>
            </button>

          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem' }}>
          
          {/* Active Role Info Badge */}
          <div style={{
            background: selectedRole === 'super_admin' ? 'var(--accent-rose-light)' : selectedRole === 'staff' ? 'var(--primary-50)' : selectedRole === 'auditor' ? 'var(--accent-gold-light)' : 'var(--accent-emerald-light)',
            color: selectedRole === 'super_admin' ? 'var(--accent-rose)' : selectedRole === 'staff' ? 'var(--primary-700)' : selectedRole === 'auditor' ? 'var(--accent-gold-dark)' : 'var(--accent-emerald-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <Sparkles size={16} style={{ flexShrink: 0 }} />
            <div>
              <div>สิทธิ์: <strong>{DEMO_USERS[selectedRole]?.roleName}</strong></div>
              <div style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.9 }}>ชื่อ: {DEMO_USERS[selectedRole]?.name}</div>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">ชื่อผู้ใช้ / รหัสสมาชิก / อีเมล</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">รหัสผ่าน (Password / PIN)</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบในฐานะ ${DEMO_USERS[selectedRole]?.roleBadge}`}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

const roleBtnStyle = (active) => ({
  padding: '0.45rem 0.6rem',
  fontSize: '0.78rem',
  fontWeight: active ? '700' : '500',
  borderRadius: '6px',
  background: active ? 'var(--primary-600)' : 'var(--bg-surface)',
  color: active ? '#ffffff' : 'var(--text-main)',
  border: active ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
  boxShadow: active ? 'var(--shadow-sm)' : 'none',
  transition: 'all 0.15s ease',
  textAlign: 'center',
  whiteSpace: 'nowrap'
});
