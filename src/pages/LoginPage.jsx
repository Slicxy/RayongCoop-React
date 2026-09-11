import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, KeyRound, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COOP_INFO } from '../data/mockData';

export default function LoginPage() {
  const { login } = useAuth();
  const [memberId, setMemberId] = useState('04892');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (!memberId || !password) {
        setError('กรุณากรอกเลขสมาชิกและรหัสผ่าน');
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
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>กลับสู่หน้าแรก</span>
        </Link>

        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img 
              src="/assets/img/logo.webp" 
              alt="Logo" 
              style={{ width: '54px', height: '54px', margin: '0 auto 0.75rem auto', objectFit: 'contain' }}
              onError={(e) => { e.target.src = '/img/logo.webp'; }}
            />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-900)' }}>เข้าสู่ระบบสมาชิกออนไลน์</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{COOP_INFO.nameTh}</p>
          </div>

          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.5rem',
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
              style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 700, textDecoration: 'underline' }}
            >
              เติมอัตโนมัติ
            </button>
          </div>

          {error && (
            <div style={{ background: 'var(--accent-rose-light)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">เลขทะเบียนสมาชิก หรือ เลขบัตร ปชช.</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="เช่น 04892"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">รหัสผ่าน (PIN 6 หลัก)</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
