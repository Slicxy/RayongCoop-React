import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, KeyRound, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { COOP_INFO } from '../data/mockData';

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('member');
  const [username, setUsername] = useState('04892');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>กลับสู่หน้าแรก</span>
        </Link>

        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img 
              src="/assets/img/logo.webp" 
              alt="Logo" 
              style={{ width: '54px', height: '54px', margin: '0 auto 0.75rem auto', objectFit: 'contain' }}
              onError={(e) => { e.target.src = '/img/logo.webp'; }}
            />
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-900)' }}>เข้าสู่ระบบแยกสิทธิ์ตามบทบาท</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{COOP_INFO.nameTh}</p>
          </div>

          {/* 4 Roles Quick Selection Buttons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              เลือกบทบาทเพื่อเข้าสู่ระบบ:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
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

          {/* Active Role Info Badge */}
          <div style={{
            background: selectedRole === 'super_admin' ? 'var(--accent-rose-light)' : selectedRole === 'staff' ? 'var(--primary-50)' : selectedRole === 'auditor' ? 'var(--accent-gold-light)' : 'var(--accent-emerald-light)',
            color: selectedRole === 'super_admin' ? 'var(--accent-rose)' : selectedRole === 'staff' ? 'var(--primary-700)' : selectedRole === 'auditor' ? 'var(--accent-gold-dark)' : 'var(--accent-emerald-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <div>บทบาท: <strong>{DEMO_USERS[selectedRole]?.roleName}</strong></div>
            <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.9 }}>ผู้ใช้งาน: {DEMO_USERS[selectedRole]?.name}</div>
          </div>

          {error && (
            <div style={{ background: 'var(--accent-rose-light)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">ชื่อผู้ใช้งาน (Username / Email / รหัสสมาชิก)</label>
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
              <label className="form-label">รหัสผ่าน (Password)</label>
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบในฐานะ ${DEMO_USERS[selectedRole]?.roleBadge}`}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

const roleBtnStyle = (active) => ({
  padding: '0.55rem 0.75rem',
  fontSize: '0.82rem',
  fontWeight: active ? '700' : '500',
  borderRadius: '8px',
  background: active ? 'var(--primary-600)' : 'var(--bg-surface)',
  color: active ? '#ffffff' : 'var(--text-main)',
  border: active ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
  boxShadow: active ? 'var(--shadow-sm)' : 'none',
  transition: 'all 0.15s ease',
  textAlign: 'center',
  cursor: 'pointer'
});
