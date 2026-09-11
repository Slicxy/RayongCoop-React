import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, User, KeyRound, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { COOP_INFO } from '../../data/mockData';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [memberId, setMemberId] = useState('04892');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!showAuthModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!memberId || !password) {
        setError('กรุณากรอกเลขสมาชิกและรหัสผ่านให้ครบถ้วน');
        setLoading(false);
        return;
      }

      login(memberId, password);
      setLoading(false);
      navigate('/member/dashboard');
    }, 400);
  };

  const handleFillDemo = () => {
    setMemberId('04892');
    setPassword('123456');
    setError('');
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
          maxWidth: '440px',
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
          padding: '1.75rem 1.5rem',
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

          <div style={{ width: '56px', height: '56px', margin: '0 auto 0.75rem auto', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
            <img 
              src="/assets/img/logo.webp" 
              alt="Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = '/img/logo.webp'; }}
            />
          </div>

          <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.25rem' }}>ระบบบริการสมาชิกออนไลน์</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{COOP_INFO.nameTh}</p>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
          <button
            onClick={() => setRole('member')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: role === 'member' ? 'var(--primary-600)' : 'var(--text-muted)',
              borderBottom: role === 'member' ? '2px solid var(--primary-600)' : 'none',
              background: role === 'member' ? 'var(--bg-surface)' : 'transparent'
            }}
          >
            สมาชิกสหกรณ์
          </button>
          <button
            onClick={() => setRole('staff')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: role === 'staff' ? 'var(--primary-600)' : 'var(--text-muted)',
              borderBottom: role === 'staff' ? '2px solid var(--primary-600)' : 'none',
              background: role === 'staff' ? 'var(--bg-surface)' : 'transparent'
            }}
          >
            เจ้าหน้าที่ / ผู้ดูแลระบบ
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.75rem' }}>
          
          {/* Demo Login Hint Alert */}
          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-800)' }}>
              <Sparkles size={16} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
              <span>รหัสทดสอบ: <strong>04892</strong> / <strong>123456</strong></span>
            </div>
            <button 
              type="button"
              onClick={handleFillDemo}
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary-700)',
                fontWeight: 700,
                textDecoration: 'underline'
              }}
            >
              เติมอัตโนมัติ
            </button>
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
              <label className="form-label">เลขทะเบียนสมาชิก หรือ เลขประจำตัวประชาชน</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="เช่น 04892 หรือ 1210100045892"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>รหัสผ่าน (PIN 6 หลัก)</label>
                <a href="#forgot" style={{ fontSize: '0.78rem', color: 'var(--primary-600)' }} onClick={(e) => { e.preventDefault(); alert('กรณีลืมรหัสผ่าน กรุณาติดต่อสำนักงานสหกรณ์ โทร. 038-611-199 เพื่อยืนยันตัวตน'); }}>
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="รหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>

          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ยังไม่ได้ลงทะเบียนใช้งานออนไลน์?{' '}
            <button 
              onClick={() => { setShowAuthModal(false); navigate('/eservice'); }}
              style={{ color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'underline' }}
            >
              ลงทะเบียนเปิดใช้งานที่นี่
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
