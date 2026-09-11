import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, Settings, Database, Activity, 
  UserPlus, KeyRound, RefreshCw, Download, Search, 
  Trash2, Edit, CheckCircle2, AlertTriangle, Lock, 
  Sliders, Shield, HardDrive, Cpu, Terminal, Sparkles, LogOut, ArrowRight, Eye
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { COOP_INFO, KEY_STATS, INTEREST_RATES } from '../data/mockData';

export default function AdminDashboardPage() {
  const { user, isLoggedIn, logout, switchRole, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  // User Management State
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'นายธีระพงษ์ ผู้ดูแลระบบสูงสุด', username: 'admin', email: 'admin@rayongcoop.com', role: 'super_admin', roleName: 'Super Admin', status: 'active', lastLogin: '11 มี.ค. 14:15 น.' },
    { id: 2, name: 'นางสาวกานดา ใจดี', username: 'staff1', email: 'staff1@rayongcoop.com', role: 'staff', roleName: 'Loan & Finance Staff', status: 'active', lastLogin: '11 มี.ค. 13:45 น.' },
    { id: 3, name: 'นายวรวุฒิ สมบูรณ์ทรัพย์', username: 'rayongcoop1', email: 'rayongcoop1@rayongcoop.com', role: 'auditor', roleName: 'Auditor & Manager', status: 'active', lastLogin: '11 มี.ค. 11:20 น.' },
    { id: 4, name: 'นายสมชาย มีสุข', username: '04892', email: 'somchai.m@rayongcoop.com', role: 'member', roleName: 'Cooperative Member', status: 'active', lastLogin: '10 มี.ค. 18:30 น.' },
    { id: 5, name: 'นางวันดี ศรีระยอง', username: '04893', email: 'wandee.s@rayongcoop.com', role: 'member', roleName: 'Cooperative Member', status: 'active', lastLogin: '09 มี.ค. 09:12 น.' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', username: '', email: '', role: 'staff' });
  const [backupTriggered, setBackupTriggered] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Financial rates local state for real-time adjustments
  const [rates, setRates] = useState({
    savingSpecial: '2.50',
    fixed24Month: '3.10',
    emergencyLoan: '5.50',
    ordinaryLoan: '5.25',
    dividendForecast: '5.25',
    refundForecast: '12.50'
  });

  const isSuperAdmin = user && user.role === 'super_admin';

  if (!isLoggedIn) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}>
            <Lock size={48} style={{ color: 'var(--accent-rose)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>เฉพาะผู้ดูแลระบบ Super Admin</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              กรุณาเข้าสู่ระบบด้วยบัญชี Super Admin เพื่อเข้าถึงแผงควบคุมระบบ
            </p>
            <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ width: '100%' }}>
              <span>เข้าสู่ระบบ Super Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: usersList.length + 1,
      name: newUserData.name,
      username: newUserData.username,
      email: newUserData.email,
      role: newUserData.role,
      roleName: newUserData.role === 'super_admin' ? 'Super Admin' : newUserData.role === 'staff' ? 'Loan Staff' : newUserData.role === 'auditor' ? 'Auditor' : 'Member',
      status: 'active',
      lastLogin: 'เพิ่งสร้างใหม่'
    };
    setUsersList([...usersList, newUser]);
    setNewUserModal(false);
    setNewUserData({ name: '', username: '', email: '', role: 'staff' });
  };

  const handleToggleUserStatus = (id) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const handleTriggerBackup = () => {
    setBackupTriggered(true);
    setTimeout(() => {
      setBackupTriggered(false);
      alert('สำรองฐานข้อมูล MySQL และไฟล์ระบบ (rayongcoop_backup_2026.sql.gz) สำเร็จสมบูรณ์!');
    }, 1000);
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section" style={{ background: 'var(--bg-main)', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Top Warning if logged in as another role */}
        {!isSuperAdmin && (
          <div style={{
            background: 'var(--accent-rose-light)',
            border: '1px solid var(--accent-rose)',
            color: 'var(--accent-rose)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
              <AlertTriangle size={18} />
              <span>คุณกำลังเข้าสู่ระบบในฐานะ <strong>{user?.roleName}</strong> (กดปุ่มสลับเป็น Super Admin เพื่อควบคุมระบบเต็มรูปแบบ)</span>
            </div>
            <button onClick={() => switchRole('super_admin')} className="btn btn-sm btn-primary" style={{ fontSize: '0.78rem' }}>
              👑 สลับเป็น Super Admin
            </button>
          </div>
        )}

        {/* Super Admin Top Header */}
        <div className="surface-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.9))', color: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #991b1b)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
              }}>
                👑
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
                  <h1 style={{ fontSize: '1.45rem', color: '#ffffff', margin: 0 }}>ศูนย์ควบคุมและบริหารระบบ Super Admin</h1>
                  <span className="badge badge-rose">Full Access Control</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  ผู้ดูแลระบบ: <strong>{isSuperAdmin ? user.name : 'นายธีระพงษ์ ผู้ดูแลระบบสูงสุด (admin)'}</strong> • ระบบ: {COOP_INFO.nameTh}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleTriggerBackup} 
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                disabled={backupTriggered}
              >
                <HardDrive size={15} />
                <span>{backupTriggered ? 'กำลังสำรอง...' : 'สำรอง DB ด่วน'}</span>
              </button>

              <button 
                onClick={() => logout()} 
                className="btn btn-sm btn-outline"
                style={{ color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.4)' }}
              >
                <LogOut size={15} />
                <span>ออกจากระบบ</span>
              </button>
            </div>

          </div>
        </div>

        {/* Real-time System Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-rose)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Users size={16} style={{ color: 'var(--accent-rose)' }} />
              <span>ผู้ใช้งานทั้งหมดในระบบ</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {usersList.length.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 4,850 คน</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-dark)', marginTop: '0.2rem' }}>Active 99.4%</div>
          </div>

          <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Cpu size={16} style={{ color: 'var(--primary-600)' }} />
              <span>ประสิทธิภาพเซิร์ฟเวอร์ & RAM</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>
              CPU 18% <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ RAM 42%</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-dark)', marginTop: '0.2rem' }}>Node.js Vite 6 + PHP 8.2 FastCGI</div>
          </div>

          <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-teal)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Database size={16} style={{ color: 'var(--accent-teal)' }} />
              <span>ฐานข้อมูล MySQL (MariaDB)</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-teal-dark)' }}>
              38 ตาราง
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ขนาด: 45.2 MB • Replication OK</div>
          </div>

          <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-gold-dark)' }} />
              <span>สถานะความปลอดภัย & PDPA</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-dark)' }}>
              เกรด A+
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-dark)', marginTop: '0.2rem' }}>ไม่พบการบุกรุก (0 Threat detected)</div>
          </div>

        </div>

        {/* Super Admin Module Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-subtle'}`}
            style={{ borderRadius: '8px', fontSize: '0.88rem' }}
          >
            <Users size={16} />
            <span>จัดการผู้ใช้งานและสิทธิ์ (Users & RBAC)</span>
          </button>

          <button 
            onClick={() => setActiveTab('financial')} 
            className={`btn ${activeTab === 'financial' ? 'btn-primary' : 'btn-subtle'}`}
            style={{ borderRadius: '8px', fontSize: '0.88rem' }}
          >
            <Sliders size={16} />
            <span>กำหนดอัตราดอกเบี้ย & ปันผล (Master Rates)</span>
          </button>

          <button 
            onClick={() => setActiveTab('audit')} 
            className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-subtle'}`}
            style={{ borderRadius: '8px', fontSize: '0.88rem' }}
          >
            <Terminal size={16} />
            <span>บันทึกความปลอดภัย (Audit Logs)</span>
          </button>

          <button 
            onClick={() => setActiveTab('maintenance')} 
            className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-subtle'}`}
            style={{ borderRadius: '8px', fontSize: '0.88rem' }}
          >
            <Settings size={16} />
            <span>ตั้งค่าระบบ & สำรองข้อมูล</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: USER & RBAC MANAGEMENT
            ========================================================================= */}
        {activeTab === 'users' && (
          <div className="surface-card animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', margin: 0 }}>รายชื่อผู้ใช้งานและบทบาทในระบบ</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>จัดการผู้ใช้ เพิ่ม/แก้ไขสิทธิ์ และระงับการใช้งาน</p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control"
                    style={{ paddingLeft: '2.2rem', paddingRight: '1rem', width: '220px', fontSize: '0.85rem' }}
                    placeholder="ค้นหาชื่อ, username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button onClick={() => setNewUserModal(true)} className="btn btn-primary btn-sm">
                  <UserPlus size={15} />
                  <span>เพิ่มผู้ใช้ใหม่</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '0.85rem' }}>ผู้ใช้งาน / สังกัด</th>
                    <th style={{ padding: '0.85rem' }}>Username / Email</th>
                    <th style={{ padding: '0.85rem' }}>บทบาท (Role)</th>
                    <th style={{ padding: '0.85rem' }}>เข้าสู่ระบบล่าสุด</th>
                    <th style={{ padding: '0.85rem', textAlign: 'center' }}>สถานะ</th>
                    <th style={{ padding: '0.85rem', textAlign: 'right' }}>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.85rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                            {u.name.charAt(3)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                        <div><strong>{u.username}</strong></div>
                        <div style={{ fontSize: '0.78rem' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span className={`badge badge-${u.role === 'super_admin' ? 'rose' : u.role === 'staff' ? 'primary' : u.role === 'auditor' ? 'gold' : 'emerald'}`}>
                          {u.roleName}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {u.lastLogin}
                      </td>
                      <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                        <span className={`badge badge-${u.status === 'active' ? 'emerald' : 'rose'}`}>
                          {u.status === 'active' ? 'เปิดใช้งาน' : 'ระงับชั่วคราว'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="btn btn-subtle btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            title="สลับสถานะเปิด/ระงับ"
                          >
                            {u.status === 'active' ? 'ระงับ' : 'ปลดล็อค'}
                          </button>
                          <button 
                            onClick={() => alert(`รีเซ็ตรหัสผ่านสำหรับ: ${u.username} เป็น 123456 เรียบร้อย`)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            title="รีเซ็ตรหัสผ่าน"
                          >
                            <KeyRound size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: MASTER FINANCIAL RATES
            ========================================================================= */}
        {activeTab === 'financial' && (
          <div className="surface-card animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', margin: 0 }}>กำหนดอัตราดอกเบี้ยและปันผลกลาง (Master Cooperative Rates)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>การเปลี่ยนแปลงนี้จะมีผลต่อโปรแกรมคำนวณและประกาศหน้าเว็บไซต์ทันที</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              
              <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-700)', marginBottom: '0.75rem' }}>อัตราดอกเบี้ยเงินฝาก</h4>
                <div className="form-group">
                  <label className="form-label">ออมทรัพย์พิเศษพลัส (% ต่อปี)</label>
                  <input type="text" className="form-control" value={rates.savingSpecial} onChange={(e) => setRates({ ...rates, savingSpecial: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">เงินฝากประจำ 24 เดือน (% ต่อปี)</label>
                  <input type="text" className="form-control" value={rates.fixed24Month} onChange={(e) => setRates({ ...rates, fixed24Month: e.target.value })} />
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold-dark)', marginBottom: '0.75rem' }}>อัตราดอกเบี้ยเงินกู้</h4>
                <div className="form-group">
                  <label className="form-label">เงินกู้ฉุกเฉิน (% ต่อปี)</label>
                  <input type="text" className="form-control" value={rates.emergencyLoan} onChange={(e) => setRates({ ...rates, emergencyLoan: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">เงินกู้สามัญสวัสดิการ (% ต่อปี)</label>
                  <input type="text" className="form-control" value={rates.ordinaryLoan} onChange={(e) => setRates({ ...rates, ordinaryLoan: e.target.value })} />
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--accent-teal-dark)', marginBottom: '0.75rem' }}>ประมาณการปันผล - เฉลี่ยคืน</h4>
                <div className="form-group">
                  <label className="form-label">เงินปันผลตามหุ้น (% ต่อปี)</label>
                  <input type="text" className="form-control" value={rates.dividendForecast} onChange={(e) => setRates({ ...rates, dividendForecast: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">เงินเฉลี่ยคืนดอกเบี้ยเงินกู้ (%)</label>
                  <input type="text" className="form-control" value={rates.refundForecast} onChange={(e) => setRates({ ...rates, refundForecast: e.target.value })} />
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => alert('บันทึกอัตราดอกเบี้ยและปันผลกลางสำเร็จเรียบร้อย')} className="btn btn-primary">
                <CheckCircle2 size={16} />
                <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: SYSTEM AUDIT TRAIL LOGS
            ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="surface-card animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', margin: 0 }}>บันทึกเหตุการณ์ความปลอดภัย (System Audit Trail)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>บันทึกทุกกิจกรรมการเข้าสู่ระบบ การอนุมัติ และการปรับเปลี่ยนข้อมูลในระบบ</p>
              </div>

              <button onClick={() => alert('ส่งออก Audit Logs (CSV / Excel)')} className="btn btn-outline btn-sm">
                <Download size={15} />
                <span>ส่งออกรายงาน Logs (CSV)</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>14:15:22</span>
                  <span>ผู้ใช้ <strong>admin</strong> เข้าสู่ระบบจาก IP <code>192.168.1.102</code> (Super Admin Dashboard)</span>
                </div>
                <span className="badge badge-emerald">Success</span>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>13:45:10</span>
                  <span>ผู้ใช้ <strong>staff1</strong> อนุมัติสัญญาสินเชื่อฉุกเฉิน LN-6703-01 ยอดเงิน 50,000 บาท</span>
                </div>
                <span className="badge badge-primary">Approved</span>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>11:20:00</span>
                  <span>ผู้ใช้ <strong>rayongcoop1</strong> ดึงรายงานกระทบยอดบัญชีเงินฝากและหุ้นประจำเดือน</span>
                </div>
                <span className="badge badge-gold">Audit Read</span>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>04:00:00</span>
                  <span>ระบบ Cron Automated Task ดำเนินการสำรองฐานข้อมูลประจำวัน <code>db_backup.sql</code></span>
                </div>
                <span className="badge badge-teal">System Cron</span>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: SYSTEM SETTINGS & MAINTENANCE
            ========================================================================= */}
        {activeTab === 'maintenance' && (
          <div className="surface-card animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', marginBottom: '1.5rem' }}>
              การบำรุงรักษาและการสำรองข้อมูลระบบ
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>สำรองฐานข้อมูล (Manual Backup)</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  สร้างไฟล์สำรอง SQL และบีบอัดฐานข้อมูลระบบทั้งหมดเก็บไว้ในไดเรกทอรีที่ปลอดภัย
                </p>
                <button onClick={handleTriggerBackup} className="btn btn-primary btn-sm" disabled={backupTriggered}>
                  <HardDrive size={15} />
                  <span>{backupTriggered ? 'กำลังประมวลผล...' : 'กดสำรองข้อมูลทันที'}</span>
                </button>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>ล้างแคชระบบ (Clear Cache)</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  ล้างไฟล์แคช View, Router และ Session ชั่วคราวเพื่อให้ระบบโหลดข้อมูลใหม่ล่าสุด
                </p>
                <button onClick={() => alert('ล้างแคชระบบเรียบร้อย (System Cache Cleared)')} className="btn btn-outline btn-sm">
                  <RefreshCw size={15} />
                  <span>ล้างแคชระบบ</span>
                </button>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>โหมดปิดปรับปรุงชั่วคราว (Maintenance Mode)</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  สถานะปัจจุบัน: <strong>{maintenanceMode ? 'เปิดใช้งาน (ปิดปรับปรุง)' : 'ปิด (บริการปกติ)'}</strong>
                </p>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)} 
                  className={`btn btn-sm ${maintenanceMode ? 'btn-primary' : 'btn-outline'}`}
                >
                  <Sliders size={15} />
                  <span>{maintenanceMode ? 'ปิดโหมดปรับปรุง' : 'เปิดโหมดปิดปรับปรุง'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Modal: Add New User */}
        {newUserModal && (
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
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)' }}>เพิ่มผู้ใช้งานใหม่เข้าระบบ</h3>
                <button onClick={() => setNewUserModal(false)} style={{ color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>

              <form onSubmit={handleAddUser}>
                <div className="form-group">
                  <label className="form-label">ชื่อ - นามสกุล</label>
                  <input type="text" className="form-control" required value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} placeholder="เช่น นายวรเทพ เจริญผล" />
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" required value={newUserData.username} onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })} placeholder="เช่น staff2 หรือ 04895" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" required value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} placeholder="example@rayongcoop.com" />
                </div>

                <div className="form-group">
                  <label className="form-label">บทบาทและสิทธิ์ (Role)</label>
                  <select className="form-control" value={newUserData.role} onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}>
                    <option value="super_admin">Super Admin (ผู้ดูแลระบบสูงสุด)</option>
                    <option value="staff">Loan & Finance Staff (เจ้าหน้าที่สินเชื่อ/การเงิน)</option>
                    <option value="auditor">Auditor (ผู้ตรวจสอบกิจการ)</option>
                    <option value="member">Member (สมาชิกสหกรณ์)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setNewUserModal(false)} className="btn btn-subtle" style={{ flex: 1 }}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    <span>สร้างผู้ใช้</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
