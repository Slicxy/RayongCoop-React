import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Coins, Landmark, ShieldCheck, TrendingUp, 
  FileText, Download, LogOut, CreditCard, Clock, 
  CheckCircle2, ShieldAlert, Users, Settings, Database, 
  Activity, Check, X, Search, FileCheck, Eye 
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { COOP_INFO, KEY_STATS } from '../data/mockData';
import StaffReviewModal from '../components/staff/StaffReviewModal';

export default function MemberDashboardPage() {
  const { user, isLoggedIn, logout, switchRole, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [staffFilter, setStaffFilter] = useState('all');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewRequest, setSelectedReviewRequest] = useState(null);

  const [loanQueue, setLoanQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('coop_service_requests');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return [
      { id: 'LN-6703-01', memberName: 'นายสมชาย มีสุข', memberId: '04892', department: 'โรงพยาบาลระยอง', phone: '081-234-5678', type: 'คำขอกู้เงินฉุกเฉินออนไลน์', amount: '50,000 บาท', date: '11 มี.ค. 2567', status: 'รอดำเนินการ', currentStep: 2, note: 'รอการตรวจสอบเอกสารและอนุมัติจากเจ้าหน้าที่สินเชื่อ' },
      { id: 'LN-6703-02', memberName: 'นางสาววิมลรัตน์ จันทร์เพ็ญ', memberId: '05120', department: 'สสจ.ระยอง', phone: '089-987-6543', type: 'เงินกู้สามัญเพื่อสวัสดิการ', amount: '400,000 บาท', date: '10 มี.ค. 2567', status: 'รอตรวจเอกสารผู้ค้ำ', currentStep: 2, note: 'ตรวจสอบเอกสารผู้ค้ำประกัน 2 ท่าน' },
      { id: 'REQ-6703-09', memberName: 'นายเอกชัย บุญรอด', memberId: '03411', department: 'รพ.สต.บ้านแลง', phone: '086-555-4321', type: 'ขอเปลี่ยนแปลงค่าหุ้นรายเดือน', amount: '4,000 บ./ด.', date: '10 มี.ค. 2567', status: 'รอดำเนินการ', currentStep: 2, note: 'ขอปรับเพิ่มค่าหุ้นรายเดือนเป็น 4,000 บาท' },
      { id: 'WF-6703-05', memberName: 'นางสาวจารุณี รัตนโชติ', memberId: '06214', department: 'รพ.แกลง', phone: '082-111-2233', type: 'ขอรับสวัสดิการคลอดบุตร', amount: '3,000 บาท', date: '09 มี.ค. 2567', status: 'อนุมัติเรียบร้อยแล้ว', currentStep: 4, note: 'โอนเงินสวัสดิการเข้าบัญชีเรียบร้อย' }
    ];
  });
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}>
            <User size={48} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>กรุณาเข้าสู่ระบบ</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              เพื่อเข้าถึงหน้าแดชบอร์ดตามสิทธิ์การใช้งานของคุณ
            </p>
            <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ width: '100%' }}>
              <span>เข้าสู่ระบบ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleApproveLoan = (id, remarks) => {
    const updated = loanQueue.map(item => item.id === id ? { 
      ...item, 
      status: 'อนุมัติเรียบร้อยแล้ว (Approved)', 
      statusColor: 'emerald',
      currentStep: 3,
      note: remarks || 'ผ่านการตรวจสอบและอนุมัติจากเจ้าหน้าที่สินเชื่อเรียบร้อยแล้ว',
      lastUpdated: '11 มี.ค. 2567 14:55 น.'
    } : item);
    setLoanQueue(updated);
    try {
      localStorage.setItem('coop_service_requests', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    alert(`อนุมัติคำขอ ${id} เรียบร้อยแล้ว! (ข้อมูลซิงก์ไปยัง e-Tracking และระบบสมาชิกทันที)`);
  };

  const handleRejectLoan = (id, remarks) => {
    const updated = loanQueue.map(item => item.id === id ? { 
      ...item, 
      status: 'ส่งกลับแก้ไข (Revision Required)', 
      statusColor: 'rose',
      currentStep: 2,
      note: remarks || 'เอกสารไม่สมบูรณ์ กรุณาแนบหลักฐานเพิ่มเติม',
      lastUpdated: '11 มี.ค. 2567 14:55 น.'
    } : item);
    setLoanQueue(updated);
    try {
      localStorage.setItem('coop_service_requests', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    alert(`ส่งกลับคำขอ ${id} ให้สมาชิกแก้ไขเรียบร้อยแล้ว!`);
  };

  const handleAddNote = (id, remarks) => {
    const updated = loanQueue.map(item => item.id === id ? { 
      ...item, 
      note: remarks,
      lastUpdated: '11 มี.ค. 2567 14:55 น.'
    } : item);
    setLoanQueue(updated);
    try {
      localStorage.setItem('coop_service_requests', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    alert(`บันทึกหมายเหตุสำหรับคำขอ ${id} เรียบร้อยแล้ว`);
  };

  const userRole = user.role || 'member';

  return (
    <div className="section" style={{ background: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Quick Role Switcher Bar (For Testing) */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            สลับสิทธิ์การทดสอบ (Switch Role Test):
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => switchRole('super_admin')} 
              className={`btn btn-sm ${userRole === 'super_admin' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ fontSize: '0.78rem' }}
            >
              👑 Super Admin
            </button>
            <button 
              onClick={() => switchRole('staff')} 
              className={`btn btn-sm ${userRole === 'staff' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ fontSize: '0.78rem' }}
            >
              💼 เจ้าหน้าที่สินเชื่อ
            </button>
            <button 
              onClick={() => switchRole('auditor')} 
              className={`btn btn-sm ${userRole === 'auditor' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ fontSize: '0.78rem' }}
            >
              🔍 ผู้ตรวจสอบกิจการ
            </button>
            <button 
              onClick={() => switchRole('member')} 
              className={`btn btn-sm ${userRole === 'member' ? 'btn-primary' : 'btn-subtle'}`}
              style={{ fontSize: '0.78rem' }}
            >
              👤 สมาชิกสหกรณ์
            </button>
          </div>
        </div>

        {/* User Header Profile Card */}
        <div className="surface-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: userRole === 'super_admin' ? 'linear-gradient(135deg, #ef4444, #991b1b)' : userRole === 'staff' ? 'var(--gradient-primary)' : userRole === 'auditor' ? 'var(--gradient-gold)' : 'var(--gradient-teal)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-md)'
              }}>
                {userRole === 'super_admin' ? '👑' : userRole === 'staff' ? '💼' : userRole === 'auditor' ? '🔍' : '👤'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)' }}>{user.name}</h2>
                  <span className={`badge badge-${user.badgeColor || 'primary'}`}>{user.roleBadge || user.roleName}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  สังกัด: <strong>{user.department}</strong> ({user.position})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Username / รหัส: <strong>{user.username || user.memberId}</strong> • สิทธิ์: {user.roleName}
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
              <LogOut size={16} />
              <span>ออกจากระบบ</span>
            </button>

          </div>
        </div>

        {/* =========================================================================
            ROLE 1: SUPER ADMIN DASHBOARD
            ========================================================================= */}
        {userRole === 'super_admin' && (
          <div className="animate-fade-in">
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-rose)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Users size={16} style={{ color: 'var(--accent-rose)' }} />
                  <span>ผู้ใช้งานทั้งหมดในระบบ</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>4,850 คน</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald-dark)', marginTop: '0.2rem' }}>Admin 3 / Staff 12 / Member 4,835</div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Activity size={16} style={{ color: 'var(--primary-600)' }} />
                  <span>สถานะความปลอดภัย & เซิร์ฟเวอร์</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald-dark)' }}>100% ปกติ</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>SSL TLS 1.3 / Firewall Active</div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Database size={16} style={{ color: 'var(--accent-gold-dark)' }} />
                  <span>ฐานข้อมูล & การสำรอง</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-dark)' }}>Auto Backup</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>สำรองข้อมูลล่าสุด: 11 มี.ค. 04:00 น.</div>
              </div>
            </div>

            {/* Admin Management Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="surface-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={18} />
                  <span>จัดการสิทธิ์และบทบาท (RBAC Management)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>1. Super Admin (ผู้ดูแลระบบสูงสุด)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>สิทธิ์เต็ม 100% ทุกโมดูล</div>
                    </div>
                    <span className="badge badge-rose">Full Control</span>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>2. Loan & Finance Staff (เจ้าหน้าที่)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>จัดการสมาชิก เงินกู้ เงินฝาก และเอกสาร</div>
                    </div>
                    <span className="badge badge-primary">Operational</span>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>3. Auditor (ผู้ตรวจสอบกิจการ)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ตรวจสอบบัญชี Audit Logs และรายงาน</div>
                    </div>
                    <span className="badge badge-gold">Audit Access</span>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>4. Member (สมาชิกสหกรณ์)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ดูข้อมูลตนเอง หุ้น เงินฝาก หนี้สิน e-Receipt</div>
                    </div>
                    <span className="badge badge-emerald">Self Service</span>
                  </div>
                </div>
              </div>

              <div className="surface-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} />
                  <span>บันทึกความปลอดภัยล่าสุด (System Audit Trail)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                  <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>13:45:20</span> • ผู้ใช้ <strong>staff1</strong> อนุมัติสัญญาสินเชื่อฉุกเฉิน LN-6703-01
                  </div>
                  <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>12:30:10</span> • ผู้ใช้ <strong>admin</strong> อัปเดตการตั้งค่าระบบความปลอดภัย
                  </div>
                  <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>11:15:00</span> • สำรองฐานข้อมูลอัตโนมัติประจำวันเสร็จสมบูรณ์
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 2: STAFF (LOAN & FINANCE OFFICER WORKFLOW)
            ========================================================================= */}
        {userRole === 'staff' && (
          <div className="animate-fade-in">
            
            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>คำขอรอดำเนินการ (Pending)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-dark)' }}>
                  {loanQueue.filter(i => !i.status.includes('เรียบร้อย') && !i.status.includes('Approved')).length} รายการ
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>คำขอกู้ฉุกเฉินและบริการสมาชิก</div>
              </div>

              <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>วงเงินรอเบิกจ่ายรวม</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-700)' }}>450,000 ฿</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>พร้อมโอนเข้าบัญชีสมาชิก</div>
              </div>

              <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>อนุมัติแล้ววันนี้ (Completed)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald-dark)' }}>
                  {loanQueue.filter(i => i.status.includes('เรียบร้อย') || i.status.includes('Approved')).length} รายการ
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald-dark)' }}>ดำเนินการเสร็จสมบูรณ์</div>
              </div>

              <div className="surface-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-rose)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ส่งกลับแก้ไข (Revisions)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                  {loanQueue.filter(i => i.status.includes('แก้ไข')).length} รายการ
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>รอสมาชิกส่งเอกสารเพิ่มเติม</div>
              </div>
            </div>

            {/* Worklist Section */}
            <div className="surface-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCheck size={22} style={{ color: 'var(--primary-600)' }} />
                    <span>ระบบจัดการและพิจารณาคำขอสมาชิก (Staff Approval Workflow)</span>
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ตรวจสอบคุณสมบัติ อนุมัติวงเงิน หรือส่งกลับแก้ไขแบบเรียลไทม์
                  </p>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setStaffFilter('all')} 
                    className={`btn btn-sm ${staffFilter === 'all' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ทั้งหมด ({loanQueue.length})
                  </button>
                  <button 
                    onClick={() => setStaffFilter('pending')} 
                    className={`btn btn-sm ${staffFilter === 'pending' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    รอดำเนินการ ({loanQueue.filter(i => !i.status.includes('เรียบร้อย') && !i.status.includes('Approved')).length})
                  </button>
                  <button 
                    onClick={() => setStaffFilter('approved')} 
                    className={`btn btn-sm ${staffFilter === 'approved' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    อนุมัติแล้ว ({loanQueue.filter(i => i.status.includes('เรียบร้อย') || i.status.includes('Approved')).length})
                  </button>
                </div>
              </div>

              {/* Worklist Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {loanQueue
                  .filter(item => {
                    if (staffFilter === 'pending') return !item.status.includes('เรียบร้อย') && !item.status.includes('Approved');
                    if (staffFilter === 'approved') return item.status.includes('เรียบร้อย') || item.status.includes('Approved');
                    return true;
                  })
                  .map((item) => {
                    const isApproved = item.status.includes('เรียบร้อย') || item.status.includes('Approved');
                    const isRevision = item.status.includes('แก้ไข');

                    return (
                      <div 
                        key={item.id} 
                        style={{ 
                          background: 'var(--bg-subtle)', 
                          padding: '1.25rem', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          flexWrap: 'wrap', 
                          gap: '1rem',
                          border: isApproved ? '1px solid rgba(16, 185, 129, 0.3)' : isRevision ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '260px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{item.memberName}</span>
                            <span className="badge badge-primary">{item.type}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({item.id})</span>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <span>วงเงินที่ขอ: <strong style={{ color: 'var(--primary-700)' }}>{item.amount}</strong></span>
                            <span>วันที่ยื่น: <strong>{item.date || item.submitDate}</strong></span>
                            <span>สังกัด: <strong>{item.department || 'โรงพยาบาลระยอง'}</strong></span>
                          </div>

                          {item.note && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                              📝 หมายเหตุ: {item.note}
                            </div>
                          )}

                          <div style={{ 
                            fontSize: '0.82rem', 
                            color: isApproved ? 'var(--accent-emerald-dark)' : isRevision ? 'var(--accent-rose)' : 'var(--accent-gold-dark)', 
                            fontWeight: 700, 
                            marginTop: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            <span>สถานะ: {item.status}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            onClick={() => {
                              setSelectedReviewRequest(item);
                              setReviewModalOpen(true);
                            }} 
                            className={`btn btn-sm ${isApproved ? 'btn-outline' : 'btn-teal'}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <ShieldCheck size={15} />
                            <span>{isApproved ? 'ดูผลการอนุมัติ' : '🔍 ตรวจสอบ & พิจารณา'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 3: AUDITOR / MANAGER
            ========================================================================= */}
        {userRole === 'auditor' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>คะแนนความถูกต้องทางบัญชี</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold-dark)' }}>99.8%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ผ่านเกณฑ์มาตรฐานกรมส่งเสริมสหกรณ์</div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-teal)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>สินทรัพย์ที่ตรวจสอบแล้ว</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-teal-dark)' }}>3,210.80 M฿</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>กระทบยอดตรงกับสมุดบัญชีแยกประเภท</div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>รายการที่รอตรวจสอบ</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)' }}>0 รายการ</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald-dark)' }}>ตรวจสอบครบถ้วนทุกรอบเดือน</div>
              </div>
            </div>

            <div className="surface-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>
                รายงานการตรวจสอบงบการเงินและเงินปันผลประจำงวด (Auditor Verification)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                ผู้ตรวจสอบกิจการได้ทำการสุ่มตรวจยอดเงินกู้ เงินฝาก และสูตรคำนวณเงินปันผลหุ้น 5.25% และเงินเฉลี่ยคืน 12.50% พบว่าถูกต้องตามระเบียบข้อบังคับ
              </p>
              <button onClick={() => alert('ดาวน์โหลดรายงานผลการตรวจสอบกิจการฉบับเต็ม (PDF)')} className="btn btn-gold">
                <Download size={16} />
                <span>ดาวน์โหลดรายงานผลการตรวจสอบกิจการ (PDF)</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE 4: REGULAR MEMBER DASHBOARD
            ========================================================================= */}
        {userRole === 'member' && (
          <div className="animate-fade-in">
            {/* 4 Balances Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              
              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Coins size={16} style={{ color: 'var(--primary-600)' }} />
                  <span>ทุนเรือนหุ้นสะสม</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-display)' }}>
                  {user.shares ? user.shares.toLocaleString() : '485,000'} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald-dark)', marginTop: '0.4rem' }}>
                  ส่งเพิ่มเดือนละ {user.monthlyShare ? user.monthlyShare.toLocaleString() : '3,000'} บ.
                </div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-teal)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Landmark size={16} style={{ color: 'var(--accent-teal)' }} />
                  <span>เงินฝากรวม ({user.accounts ? user.accounts.length : 2} บัญชี)</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-teal-dark)', fontFamily: 'var(--font-display)' }}>
                  {user.savings ? user.savings.toLocaleString() : '245,300.50'} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  ดอกเบี้ยสะสมรายวัน
                </div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-rose)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <CreditCard size={16} style={{ color: 'var(--accent-rose)' }} />
                  <span>หนี้สินเงินกู้คงเหลือ</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)', fontFamily: 'var(--font-display)' }}>
                  {user.loanBalance ? user.loanBalance.toLocaleString() : '820,000'} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  สัญญา ส.66/0129 (เหลือ 96 งวด)
                </div>
              </div>

              <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <TrendingUp size={16} style={{ color: 'var(--accent-gold-dark)' }} />
                  <span>ปันผล+เฉลี่ยคืน (ประมาณการ)</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-dark)', fontFamily: 'var(--font-display)' }}>
                  {((user.dividendEstimated || 25462.50) + (user.loanRefundEstimated || 5125)).toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  ปันผล 25,462.50 + คืน 5,125.00 บ.
                </div>
              </div>

            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveTab('overview')} style={tabNavBtn(activeTab === 'overview')}>บัญชีเงินฝาก & หนี้</button>
              <button onClick={() => setActiveTab('receipts')} style={tabNavBtn(activeTab === 'receipts')}>ใบเสร็จรับเงิน (e-Receipt)</button>
            </div>

            {activeTab === 'overview' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div className="surface-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>บัญชีเงินฝากของสมาชิก</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(user.accounts || DEMO_USERS.member.accounts).map((acc, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{acc.type}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>เลขที่บัญชี: {acc.accNo}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-teal-dark)' }}>
                            {acc.balance.toLocaleString()} ฿
                          </div>
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{acc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>สัญญาเงินกู้ที่ผูกพัน</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(user.loans || DEMO_USERS.member.loans).map((loan, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: 700 }}>{loan.type} ({loan.contractNo})</div>
                          <span className="badge badge-gold">ผ่อนชำระปกติ</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <div><span style={{ color: 'var(--text-muted)' }}>วงเงินตามสัญญา:</span> <strong>{loan.principal.toLocaleString()} ฿</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>ยอดคงเหลือ:</span> <strong style={{ color: 'var(--accent-rose)' }}>{loan.balance.toLocaleString()} ฿</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>ผ่อนเดือนละ:</span> <strong>{loan.monthlyPay.toLocaleString()} ฿</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>งวดคงเหลือ:</span> <strong>{loan.termRemaining}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="surface-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '1.25rem' }}>
                  ประวัติใบเสร็จรับเงินประจำเดือน (e-Receipt)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(user.recentReceipts || DEMO_USERS.member.recentReceipts).map((rc, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)' }}>
                          <FileText size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>ใบเสร็จประจำเดือน {rc.period}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>เลขที่: {rc.receiptNo} • วันที่: {rc.date}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                            {rc.totalAmount.toLocaleString()} บาท
                          </div>
                          <span className="badge badge-emerald">{rc.status}</span>
                        </div>

                        <button onClick={() => navigate('/verify-receipt')} className="btn btn-outline btn-sm">
                          <Download size={14} />
                          <span>ดู/พิมพ์</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Staff Review Modal */}
        <StaffReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          request={selectedReviewRequest}
          onApprove={handleApproveLoan}
          onReject={handleRejectLoan}
          onAddNote={handleAddNote}
        />

      </div>
    </div>
  );
}

const tabNavBtn = (active) => ({
  padding: '0.5rem 1.25rem',
  fontSize: '0.9rem',
  fontWeight: active ? '700' : '500',
  borderRadius: '8px',
  background: active ? 'var(--primary-600)' : 'transparent',
  color: active ? '#ffffff' : 'var(--text-main)',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
});
