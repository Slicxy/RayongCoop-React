import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Coins, Landmark, ShieldCheck, TrendingUp, 
  FileText, Download, LogOut, CreditCard, Clock, 
  CheckCircle2, ShieldAlert, Users, Settings, Database, 
  Activity, Check, X, Search, FileCheck, Eye, MessageSquare,
  AlertCircle, ExternalLink, Trash2, Send, PlusCircle, Edit3, Phone, Camera
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { COOP_INFO, KEY_STATS, MEMBER_COMPLAINTS } from '../data/mockData';
import StaffReviewModal from '../components/staff/StaffReviewModal';
import EditProfileModal from '../components/member/EditProfileModal';
import NewLoanRequestModal from '../components/member/NewLoanRequestModal';

export default function MemberDashboardPage() {
  const { user, isLoggedIn, logout, switchRole, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [staffFilter, setStaffFilter] = useState('all');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewRequest, setSelectedReviewRequest] = useState(null);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  // Member Loan Request State
  const [memberLoanModalOpen, setMemberLoanModalOpen] = useState(false);
  const [memberLoanFilter, setMemberLoanFilter] = useState('all');

  // Complaints & Feedback State
  const [complaintsList, setComplaintsList] = useState(() => {
    try {
      const saved = localStorage.getItem('coop_member_complaints');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return MEMBER_COMPLAINTS;
  });
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [selectedAdminComplaint, setSelectedAdminComplaint] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Member Quick Complaint Modal & Filter State
  const [memberComplaintFilter, setMemberComplaintFilter] = useState('all');
  const [memberComplaintModalOpen, setMemberComplaintModalOpen] = useState(false);
  const [newMemberComplaint, setNewMemberComplaint] = useState({
    topic: 'ข้อเสนอแนะการให้บริการ',
    message: ''
  });

  // Auto-sync complaints and loan requests from localStorage whenever updated
  useEffect(() => {
    const syncData = () => {
      try {
        const savedComplaints = localStorage.getItem('coop_member_complaints');
        if (savedComplaints) {
          setComplaintsList(JSON.parse(savedComplaints));
        }
        const savedLoans = localStorage.getItem('coop_service_requests');
        if (savedLoans) {
          setLoanQueue(JSON.parse(savedLoans));
        }
      } catch (e) {}
    };

    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('focus', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('focus', syncData);
    };
  }, []);

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

  const handleUpdateComplaintStatus = (id, newStatus) => {
    const updated = complaintsList.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setComplaintsList(updated);
    try {
      localStorage.setItem('coop_member_complaints', JSON.stringify(updated));
    } catch (e) {}
    if (selectedAdminComplaint && selectedAdminComplaint.id === id) {
      setSelectedAdminComplaint({ ...selectedAdminComplaint, status: newStatus });
    }
  };

  const handleSaveAdminComplaintReply = (id, replyText) => {
    const now = new Date().toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' น.';
    const updated = complaintsList.map(c => c.id === id ? { 
      ...c, 
      adminReply: replyText, 
      status: 'ตอบกลับแล้ว',
      replyDate: now 
    } : c);
    setComplaintsList(updated);
    try {
      localStorage.setItem('coop_member_complaints', JSON.stringify(updated));
    } catch (e) {}
    if (selectedAdminComplaint && selectedAdminComplaint.id === id) {
      setSelectedAdminComplaint({ 
        ...selectedAdminComplaint, 
        adminReply: replyText, 
        status: 'ตอบกลับแล้ว',
        replyDate: now 
      });
    }
    alert(`บันทึกข้อความตอบกลับสำหรับรหัส ${id} เรียบร้อยแล้ว (สมาชิกสามารถตรวจสอบผลได้ทันที)`);
  };

  const handleDeleteComplaint = (id) => {
    if (confirm(`ยืนยันการลบรายการ ${id}?`)) {
      const updated = complaintsList.filter(c => c.id !== id);
      setComplaintsList(updated);
      try {
        localStorage.setItem('coop_member_complaints', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
      if (selectedAdminComplaint && selectedAdminComplaint.id === id) {
        setSelectedAdminComplaint(null);
      }
    }
  };

  const handleMemberSubmitComplaint = (e) => {
    e.preventDefault();
    if (!newMemberComplaint.message.trim()) {
      alert('กรุณากรอกรายละเอียดเรื่องร้องเรียน / ข้อเสนอแนะ');
      return;
    }

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newId = `TKT-6703${randomSuffix}`;
    const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

    const newEntry = {
      id: newId,
      name: user.name || 'นายสมชาย มีสุข',
      phone: user.phone || '081-234-5678',
      email: user.email || 'somchai.m@rayongcoop.com',
      department: user.department || 'โรงพยาบาลระยอง',
      memberId: user.memberId || '04892',
      topic: newMemberComplaint.topic || 'ข้อเสนอแนะการให้บริการ',
      message: newMemberComplaint.message.trim(),
      date: dateStr,
      status: 'รอดำเนินการ',
      adminReply: '',
      replyDate: ''
    };

    const updated = [newEntry, ...complaintsList];
    setComplaintsList(updated);
    try {
      localStorage.setItem('coop_member_complaints', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    setNewMemberComplaint({ topic: 'ข้อเสนอแนะการให้บริการ', message: '' });
    setMemberComplaintModalOpen(false);
    setActiveTab('complaints');
    alert(`ส่งเรื่องร้องเรียน / ข้อเสนอแนะเรียบร้อยแล้ว!\nรหัสติดตามเรื่อง: ${newId}\n(ข้อมูลเชื่อมโยงไปยังระบบ Super Admin ทันที)`);
  };

  const handleMemberSubmitLoan = (newLoanItem) => {
    const updated = [newLoanItem, ...loanQueue];
    setLoanQueue(updated);
    try {
      localStorage.setItem('coop_service_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
    setActiveTab('loans');
    alert(`ยื่นคำขอกู้เงินออนไลน์เรียบร้อยแล้ว!\nรหัสคำขอ: ${newLoanItem.id}\nวงเงิน: ${newLoanItem.amount}\n(ส่งต่อไปยังคิวการพิจารณาของเจ้าหน้าที่สินเชื่อเรียบร้อยแล้ว)`);
  };

  const userRole = user.role || 'member';

  // Filter complaints strictly belonging to this logged-in member (Privacy Protection)
  const myComplaints = complaintsList.filter(item => {
    if (user?.memberId && item?.memberId) {
      return String(item.memberId).trim() === String(user.memberId).trim();
    }
    if (user?.name && item?.name) {
      return item.name.trim() === user.name.trim();
    }
    return false;
  });

  // Filter loan requests strictly belonging to this logged-in member
  const myLoanRequests = loanQueue.filter(item => {
    if (user?.memberId && item?.memberId) {
      return String(item.memberId).trim() === String(user.memberId).trim();
    }
    if (user?.name && item?.memberName) {
      return item.memberName.trim() === user.name.trim();
    }
    return false;
  });

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
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: userRole === 'super_admin' ? 'linear-gradient(135deg, #ef4444, #991b1b)' : userRole === 'staff' ? 'var(--gradient-primary)' : userRole === 'auditor' ? 'var(--gradient-gold)' : 'var(--gradient-teal)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                position: 'relative',
                border: '2px solid #ffffff',
                flexShrink: 0
              }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  userRole === 'super_admin' ? '👑' : userRole === 'staff' ? '💼' : userRole === 'auditor' ? '🔍' : '👤'
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-900)' }}>{user.name}</h2>
                  <span className={`badge badge-${user.badgeColor || 'primary'}`}>{user.roleBadge || user.roleName}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  สังกัด: <strong>{user.department}</strong> ({user.position})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>Username / รหัส: <strong>{user.username || user.memberId}</strong> • สิทธิ์: {user.roleName}</span>
                  <span style={{ color: 'var(--border-subtle)' }}>|</span>
                  <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>📞 {user.phone || '081-234-5678'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setEditProfileModalOpen(true)} 
                className="btn btn-subtle btn-sm" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                title="แก้ไขรูปภาพโปรไฟล์และเบอร์โทรศัพท์"
              >
                <Edit3 size={15} style={{ color: 'var(--primary-600)' }} />
                <span>แก้ไขรูปภาพ / เบอร์โทร</span>
              </button>

              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
                <LogOut size={16} />
                <span>ออกจากระบบ</span>
              </button>
            </div>

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

            {/* Quick Access to Full CMS Admin Dashboard */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(244, 63, 94, 0.08))',
              border: '1px solid rgba(30, 58, 138, 0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem 1.75rem',
              margin: '2rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--primary-600)', color: '#ffffff' }}>
                  <Settings size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.2rem' }}>
                    แผงควบคุมระบบเว็บไซต์แบบเต็มรูปแบบ (Super Admin Full CMS)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    จัดการประกาศ, ข่าวสาร, Hero Section, Pop-up แคมเปญ, และคำถาม FAQs 6 โมดูลครบวงจร
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>เปิดแผงควบคุม CMS เต็มรูปแบบ</span>
                <ExternalLink size={15} />
              </button>
            </div>

            {/* =========================================================================
                SUPER ADMIN: MEMBER COMPLAINTS & FEEDBACK INBOX
                ========================================================================= */}
            <div className="surface-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <MessageSquare size={22} style={{ color: 'var(--accent-rose)' }} />
                    <span>กล่องข้อเสนอแนะและเรื่องร้องเรียนจากสมาชิก (Feedback & Complaints Management)</span>
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    ติดตามเรื่องร้องเรียน ตรวจสอบข้อเสนอแนะ และเขียนตอบกลับให้สมาชิกทราบแบบเรียลไทม์
                  </p>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'all', label: `ทั้งหมด (${complaintsList.length})` },
                    { key: 'complaint', label: `เรื่องร้องเรียน (${complaintsList.filter(c => c.topic.includes('ร้องเรียน')).length})` },
                    { key: 'feedback', label: `ข้อเสนอแนะ (${complaintsList.filter(c => c.topic.includes('ข้อเสนอแนะ')).length})` },
                    { key: 'pending', label: `รอดำเนินการ (${complaintsList.filter(c => c.status === 'รอดำเนินการ').length})` },
                    { key: 'replied', label: `ตอบกลับแล้ว (${complaintsList.filter(c => c.status === 'ตอบกลับแล้ว').length})` }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setComplaintFilter(tab.key)}
                      className={`btn btn-sm ${complaintFilter === tab.key ? 'btn-primary' : 'btn-subtle'}`}
                      style={{ fontSize: '0.78rem' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complaints List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {complaintsList
                  .filter(item => {
                    if (complaintFilter === 'complaint') return item.topic.includes('ร้องเรียน');
                    if (complaintFilter === 'feedback') return item.topic.includes('ข้อเสนอแนะ');
                    if (complaintFilter === 'pending') return item.status === 'รอดำเนินการ';
                    if (complaintFilter === 'replied') return item.status === 'ตอบกลับแล้ว';
                    return true;
                  })
                  .map((item) => {
                    const isComplaint = item.topic.includes('ร้องเรียน');
                    const isReplied = item.status === 'ตอบกลับแล้ว';
                    const isPending = item.status === 'รอดำเนินการ';

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
                          border: isComplaint ? '1px solid rgba(244, 63, 94, 0.3)' : isReplied ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '260px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</span>
                            <span className={`badge ${isComplaint ? 'badge-rose' : 'badge-primary'}`}>{item.topic}</span>
                            <span className="badge badge-subtle">{item.id}</span>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                            <span>โทร: <strong>{item.phone}</strong></span>
                            <span>สังกัด: <strong>{item.department || 'สมาชิกสหกรณ์'}</strong></span>
                            <span>วันที่ส่ง: <strong>{item.date}</strong></span>
                          </div>

                          <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                            {item.message}
                          </div>

                          {item.adminReply && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald-dark)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <CheckCircle2 size={14} />
                              <span>ข้อความตอบกลับ: {item.adminReply}</span>
                            </div>
                          )}

                          <div style={{ 
                            fontSize: '0.82rem', 
                            color: isReplied ? 'var(--accent-emerald-dark)' : isPending ? 'var(--accent-rose)' : 'var(--accent-gold-dark)', 
                            fontWeight: 700, 
                            marginTop: '0.35rem'
                          }}>
                            สถานะ: {item.status}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            onClick={() => {
                              setSelectedAdminComplaint(item);
                              setAdminReplyText(item.adminReply || '');
                            }} 
                            className="btn btn-sm btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Eye size={14} />
                            <span>เปิดอ่าน & ตอบกลับ</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComplaint(item.id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)', padding: '0.4rem 0.6rem' }}
                            title="ลบรายการ"
                          >
                            <Trash2 size={14} />
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
              <button onClick={() => setActiveTab('loans')} style={tabNavBtn(activeTab === 'loans')}>
                📝 คำขอกู้เงิน & ติดตามสถานะ ({myLoanRequests.length})
              </button>
              <button onClick={() => setActiveTab('receipts')} style={tabNavBtn(activeTab === 'receipts')}>ใบเสร็จรับเงิน (e-Receipt)</button>
              <button onClick={() => setActiveTab('complaints')} style={tabNavBtn(activeTab === 'complaints')}>
                📬 เรื่องร้องเรียน & ข้อเสนอแนะ ({myComplaints.length})
              </button>
            </div>

            {activeTab === 'overview' && (
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
            )}

            {/* =========================================================================
                MEMBER: LOAN APPLICATIONS & STATUS TRACKER (คำขอกู้เงินของฉัน)
                ========================================================================= */}
            {activeTab === 'loans' && (
              <div className="surface-card animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                {/* Section Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <CreditCard size={22} style={{ color: 'var(--primary-600)' }} />
                      <span>รายการคำขอกู้เงินออนไลน์และสถานะการพิจารณา (My Loan Applications)</span>
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>
                      ติดตามไทม์ไลน์ขั้นตอนการตรวจสอบ อนุมัติสินเชื่อ และการทำนิติกรรมสัญญาแบบ Real-time
                    </p>
                  </div>

                  <button
                    onClick={() => setMemberLoanModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.15rem' }}
                  >
                    <PlusCircle size={16} />
                    <span>+ ยื่นคำขอกู้เงินออนไลน์ใหม่</span>
                  </button>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <button 
                    onClick={() => setMemberLoanFilter('all')} 
                    className={`btn btn-sm ${memberLoanFilter === 'all' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ทั้งหมด ({myLoanRequests.length})
                  </button>
                  <button 
                    onClick={() => setMemberLoanFilter('pending')} 
                    className={`btn btn-sm ${memberLoanFilter === 'pending' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    รอดำเนินการ ({myLoanRequests.filter(l => l.status.includes('รอดำเนินการ') || l.status.includes('รอ') || l.status.includes('Pending')).length})
                  </button>
                  <button 
                    onClick={() => setMemberLoanFilter('approved')} 
                    className={`btn btn-sm ${memberLoanFilter === 'approved' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    อนุมัติเรียบร้อย ({myLoanRequests.filter(l => l.status.includes('อนุมัติ') || l.status.includes('Approved')).length})
                  </button>
                  <button 
                    onClick={() => setMemberLoanFilter('revision')} 
                    className={`btn btn-sm ${memberLoanFilter === 'revision' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ส่งกลับแก้ไข ({myLoanRequests.filter(l => l.status.includes('ส่งกลับ') || l.status.includes('Revision')).length})
                  </button>
                </div>

                {/* Loan Requests List */}
                {myLoanRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
                    <CreditCard size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem auto' }} />
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>ยังไม่มีประวัติการยื่นคำขอกู้เงิน</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      ท่านสามารถยื่นคำขอกู้เงินฉุกเฉิน หรือกู้สามัญออนไลน์ได้สะดวกรวดเร็วตลอด 24 ชั่วโมง
                    </p>
                    <button 
                      onClick={() => setMemberLoanModalOpen(true)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <PlusCircle size={16} />
                      <span>ยื่นคำขอกู้เงินออนไลน์ตอนนี้</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {myLoanRequests
                      .filter(item => {
                        if (memberLoanFilter === 'pending') return item.status.includes('รอดำเนินการ') || item.status.includes('รอ') || item.status.includes('Pending');
                        if (memberLoanFilter === 'approved') return item.status.includes('อนุมัติ') || item.status.includes('Approved');
                        if (memberLoanFilter === 'revision') return item.status.includes('ส่งกลับ') || item.status.includes('Revision');
                        return true;
                      })
                      .map(item => {
                        const isApproved = item.status.includes('อนุมัติ') || item.status.includes('Approved');
                        const isRevision = item.status.includes('ส่งกลับ') || item.status.includes('Revision');
                        const isPending = !isApproved && !isRevision;
                        const currentStep = item.currentStep || (isApproved ? 4 : isRevision ? 2 : 2);

                        const steps = [
                          { step: 1, title: 'ยื่นคำขอดิจิทัล' },
                          { step: 2, title: 'เจ้าหน้าที่ตรวจเอกสาร' },
                          { step: 3, title: 'พิจารณาอนุมัติสินเชื่อ' },
                          { step: 4, title: 'ทำสัญญา & โอนเงิน' }
                        ];

                        return (
                          <div 
                            key={item.id}
                            style={{
                              background: 'var(--bg-subtle)',
                              borderRadius: '16px',
                              padding: '1.5rem',
                              border: isApproved 
                                ? '1px solid rgba(16, 185, 129, 0.4)' 
                                : isRevision 
                                ? '1px solid rgba(244, 63, 94, 0.4)' 
                                : '1px solid var(--border-subtle)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1.25rem'
                            }}
                          >
                            {/* Card Header Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                                  <span className="badge badge-primary">{item.id}</span>
                                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                    {item.type || item.name}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                  วันที่ยื่นคำขอ: <strong>{item.date || '11 มี.ค. 2567'}</strong> {item.lastUpdated ? `• อัปเดตล่าสุด: ${item.lastUpdated}` : ''}
                                </div>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-display)' }}>
                                  {item.amount}
                                </div>
                                <span className={`badge badge-${isApproved ? 'emerald' : isRevision ? 'rose' : 'gold'}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div style={{
                              background: 'var(--bg-surface)',
                              borderRadius: '12px',
                              padding: '1rem 1.25rem',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                              gap: '0.75rem 1rem',
                              fontSize: '0.85rem',
                              border: '1px solid var(--border-subtle)'
                            }}>
                              {item.term && (
                                <div>
                                  <span style={{ color: 'var(--text-muted)' }}>ระยะเวลาผ่อน:</span>{' '}
                                  <strong>{item.term}</strong>
                                </div>
                              )}
                              {item.monthlyEstimate && (
                                <div>
                                  <span style={{ color: 'var(--text-muted)' }}>ประมาณการค่างวด:</span>{' '}
                                  <strong style={{ color: 'var(--accent-teal-dark)' }}>{item.monthlyEstimate}</strong>
                                </div>
                              )}
                              {item.interestRate && (
                                <div>
                                  <span style={{ color: 'var(--text-muted)' }}>อัตราดอกเบี้ย:</span>{' '}
                                  <strong style={{ color: 'var(--accent-gold-dark)' }}>{item.interestRate}</strong>
                                </div>
                              )}
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>หลักประกัน / ผู้ค้ำ:</span>{' '}
                                <strong>{item.guarantor || 'ใช้วงเงินหุ้นสะสมค้ำประกัน'}</strong>
                              </div>
                              {item.purpose && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <span style={{ color: 'var(--text-muted)' }}>วัตถุประสงค์:</span>{' '}
                                  <strong style={{ color: 'var(--text-main)' }}>{item.purpose}</strong>
                                </div>
                              )}
                            </div>

                            {/* 4-Step Visual Timeline */}
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                📌 ลำดับขั้นตอนการพิจารณาสินเชื่อ (Workflow Progress):
                              </div>
                              
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '0.5rem',
                                position: 'relative'
                              }}>
                                {steps.map((s, sidx) => {
                                  const isDone = s.step < currentStep || (s.step === 4 && isApproved);
                                  const isCurrent = s.step === currentStep && !isApproved && !isRevision;
                                  const isStepRevision = s.step === 2 && isRevision;

                                  return (
                                    <div 
                                      key={s.step} 
                                      style={{ 
                                        textAlign: 'center', 
                                        padding: '0.65rem 0.35rem', 
                                        borderRadius: '8px',
                                        background: isDone 
                                          ? 'rgba(16, 185, 129, 0.12)' 
                                          : isStepRevision 
                                          ? 'rgba(244, 63, 94, 0.12)' 
                                          : isCurrent 
                                          ? 'rgba(37, 99, 235, 0.12)' 
                                          : 'var(--bg-surface)',
                                        border: isDone 
                                          ? '1px solid rgba(16, 185, 129, 0.35)' 
                                          : isStepRevision 
                                          ? '1px solid rgba(244, 63, 94, 0.4)' 
                                          : isCurrent 
                                          ? '1px solid var(--primary-600)' 
                                          : '1px solid var(--border-subtle)',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <div style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        width: '24px', 
                                        height: '24px', 
                                        borderRadius: '50%',
                                        background: isDone ? 'var(--accent-emerald)' : isStepRevision ? 'var(--accent-rose)' : isCurrent ? 'var(--primary-600)' : 'var(--bg-subtle)',
                                        color: '#ffffff',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        marginBottom: '0.25rem'
                                      }}>
                                        {isDone ? <Check size={14} /> : isStepRevision ? '!' : s.step}
                                      </div>
                                      <div style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: isCurrent || isDone ? 700 : 500, 
                                        color: isDone ? 'var(--accent-emerald-dark)' : isStepRevision ? 'var(--accent-rose)' : isCurrent ? 'var(--primary-600)' : 'var(--text-muted)' 
                                      }}>
                                        {s.title}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Officer Feedback Note Banner */}
                            {item.note && (
                              <div style={{ 
                                background: isApproved 
                                  ? 'rgba(16, 185, 129, 0.08)' 
                                  : isRevision 
                                  ? 'rgba(244, 63, 94, 0.08)' 
                                  : 'rgba(245, 158, 11, 0.08)',
                                borderLeft: `4px solid ${isApproved ? 'var(--accent-emerald)' : isRevision ? 'var(--accent-rose)' : 'var(--accent-gold)'}`,
                                padding: '0.85rem 1.15rem',
                                borderRadius: '0 8px 8px 0',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                <Info size={16} style={{ color: isApproved ? 'var(--accent-emerald)' : isRevision ? 'var(--accent-rose)' : 'var(--accent-gold-dark)', flexShrink: 0 }} />
                                <div>
                                  <strong style={{ color: 'var(--text-main)' }}>ความเห็น/หมายเหตุจากเจ้าหน้าที่สินเชื่อ:</strong>{' '}
                                  <span style={{ color: 'var(--text-main)' }}>{item.note}</span>
                                </div>
                              </div>
                            )}

                            {/* Card Footer Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                              <button 
                                onClick={() => alert(`พิมพ์เอกสารใบคำขอกู้เงินดิจิทัล รหัส: ${item.id} (PDF)`)}
                                className="btn btn-outline btn-sm"
                                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                              >
                                <Download size={14} />
                                <span>ดาวน์โหลดใบคำขอ (PDF)</span>
                              </button>
                              
                              {isRevision && (
                                <button 
                                  onClick={() => setMemberLoanModalOpen(true)}
                                  className="btn btn-rose btn-sm"
                                  style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                  <Edit3 size={14} />
                                  <span>แก้ไขและส่งเอกสารใหม่</span>
                                </button>
                              )}
                            </div>

                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'receipts' && (
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

            {activeTab === 'complaints' && (
              <div className="surface-card animate-fade-in" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                {/* Section Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <MessageSquare size={22} style={{ color: 'var(--primary-600)' }} />
                      <span>เรื่องร้องเรียน & ข้อเสนอแนะของฉัน (My Complaints & Feedback)</span>
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>
                      ติดตามสถานะคำร้องและตรวจสอบข้อความตอบกลับ/การแก้ไขปัญหาจากสหกรณ์ (แสดงเฉพาะรายการของคุณ)
                    </p>
                  </div>

                  <button
                    onClick={() => setMemberComplaintModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem' }}
                  >
                    <PlusCircle size={16} />
                    <span>ส่งเรื่องร้องเรียน / ข้อเสนอแนะใหม่</span>
                  </button>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <button 
                    onClick={() => setMemberComplaintFilter('all')} 
                    className={`btn btn-sm ${memberComplaintFilter === 'all' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ทั้งหมด ({myComplaints.length})
                  </button>
                  <button 
                    onClick={() => setMemberComplaintFilter('pending')} 
                    className={`btn btn-sm ${memberComplaintFilter === 'pending' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    รอดำเนินการ ({myComplaints.filter(c => c.status === 'รอดำเนินการ').length})
                  </button>
                  <button 
                    onClick={() => setMemberComplaintFilter('reviewing')} 
                    className={`btn btn-sm ${memberComplaintFilter === 'reviewing' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    กำลังตรวจสอบ ({myComplaints.filter(c => c.status === 'กำลังตรวจสอบ').length})
                  </button>
                  <button 
                    onClick={() => setMemberComplaintFilter('replied')} 
                    className={`btn btn-sm ${memberComplaintFilter === 'replied' ? 'btn-primary' : 'btn-subtle'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ตอบกลับแล้ว ({myComplaints.filter(c => c.status === 'ตอบกลับแล้ว').length})
                  </button>
                </div>

                {/* Complaints List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myComplaints
                    .filter(item => {
                      if (memberComplaintFilter === 'pending') return item.status === 'รอดำเนินการ';
                      if (memberComplaintFilter === 'reviewing') return item.status === 'กำลังตรวจสอบ';
                      if (memberComplaintFilter === 'replied') return item.status === 'ตอบกลับแล้ว';
                      return true;
                    })
                    .map(item => {
                      const isReplied = item.status === 'ตอบกลับแล้ว';
                      const isPending = item.status === 'รอดำเนินการ';

                      return (
                        <div 
                          key={item.id} 
                          style={{ 
                            background: 'var(--bg-subtle)', 
                            padding: '1.25rem 1.5rem', 
                            borderRadius: '12px', 
                            border: isReplied ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                          }}
                        >
                          {/* Card Top Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span className="badge badge-primary">{item.id}</span>
                              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{item.topic}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• วันที่ยื่น: {item.date}</span>
                            </div>
                            <span className={`badge badge-${isReplied ? 'emerald' : isPending ? 'rose' : 'gold'}`}>
                              {item.status}
                            </span>
                          </div>

                          {/* Message Content */}
                          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                              💬 ข้อความเรื่องร้องเรียน / ข้อเสนอแนะ:
                            </div>
                            {item.message}
                          </div>

                          {/* Admin Reply (If Available) */}
                          {item.adminReply ? (
                            <div style={{ 
                              background: 'rgba(16, 185, 129, 0.08)', 
                              borderLeft: '4px solid var(--accent-emerald)', 
                              padding: '1rem 1.25rem', 
                              borderRadius: '0 8px 8px 0',
                              fontSize: '0.88rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--accent-emerald-dark)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <CheckCircle2 size={16} />
                                  <span>ข้อความชี้แจง / ผลการดำเนินงานจากสหกรณ์ (Official Reply):</span>
                                </span>
                                {item.replyDate && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {item.replyDate}
                                  </span>
                                )}
                              </div>
                              <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.55 }}>
                                {item.adminReply}
                              </p>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontStyle: 'italic' }}>
                              <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
                              <span>อยู่ระหว่างการตรวจสอบและพิจารณาโดยเจ้าหน้าที่สหกรณ์</span>
                            </div>
                          )}

                          {/* Card Action Footer */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <button
                              onClick={() => handleDeleteComplaint(item.id)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)', padding: '0.3rem 0.6rem' }}
                            >
                              <Trash2 size={13} style={{ marginRight: '0.25rem' }} />
                              <span>ลบรายการนี้</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {myComplaints.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                      <MessageSquare size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                      <p style={{ fontSize: '1rem', fontWeight: 600 }}>ยังไม่มีประวัติการส่งเรื่องร้องเรียนหรือข้อเสนอแนะของคุณ</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 1rem 0' }}>ระบบจะแสดงเฉพาะเรื่องร้องเรียนและข้อเสนอแนะที่ส่งด้วยบัญชีของคุณเพื่อความเป็นส่วนตัว</p>
                      <button 
                        onClick={() => setMemberComplaintModalOpen(true)}
                        className="btn btn-primary btn-sm"
                      >
                        ส่งเรื่องร้องเรียนข้อแรก
                      </button>
                    </div>
                  )}
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

        {/* Super Admin Complaint Details & Reply Modal */}
        {selectedAdminComplaint && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2500,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}>
            <div className="surface-card animate-fade-in" style={{
              width: '100%',
              maxWidth: '620px',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              position: 'relative',
              maxHeight: '92vh',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)'
            }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-primary">{selectedAdminComplaint.id}</span>
                    <span className={`badge badge-${selectedAdminComplaint.status === 'ตอบกลับแล้ว' ? 'emerald' : selectedAdminComplaint.status === 'กำลังตรวจสอบ' ? 'gold' : 'rose'}`}>
                      {selectedAdminComplaint.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', fontWeight: 800, margin: 0 }}>
                    {selectedAdminComplaint.topic}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    วันที่ส่ง: <strong>{selectedAdminComplaint.date}</strong> • ผู้ส่ง: <strong>{selectedAdminComplaint.name}</strong>
                  </div>
                </div>
                <button onClick={() => setSelectedAdminComplaint(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>

              {/* Modal Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <div>📞 <strong>เบอร์โทร:</strong> {selectedAdminComplaint.phone}</div>
                  <div>✉️ <strong>อีเมล:</strong> {selectedAdminComplaint.email || '-'}</div>
                  <div style={{ gridColumn: 'span 2' }}>🏢 <strong>สังกัด/หน่วยงาน:</strong> {selectedAdminComplaint.department || 'สมาชิกทั่วไป'}</div>
                </div>

                {/* Member Message */}
                <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={16} style={{ color: 'var(--accent-rose)' }} />
                    <span>ข้อความเรื่องร้องเรียน / ข้อเสนอแนะ:</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                    {selectedAdminComplaint.message}
                  </p>
                </div>

                {/* Status Switcher Buttons */}
                <div>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
                    ปรับเปลี่ยนสถานะการดำเนินการ (Update Status):
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['รอดำเนินการ', 'กำลังตรวจสอบ', 'ตอบกลับแล้ว'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateComplaintStatus(selectedAdminComplaint.id, st)}
                        className={`btn btn-sm ${selectedAdminComplaint.status === st ? 'btn-primary' : 'btn-subtle'}`}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Reply Input */}
                <div style={{ background: 'rgba(14, 165, 233, 0.05)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
                  <label className="form-label" style={{ fontWeight: 700, color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald-dark)' }} />
                    <span>พิมพ์ข้อความตอบกลับจากผู้บริหาร/เจ้าหน้าที่ (Official Reply):</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="ระบุคำชี้แจง มาตรการแก้ไข หรือผลการตรวจสอบเพื่อแจ้งแก่สมาชิก..."
                    style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => handleSaveAdminComplaintReply(selectedAdminComplaint.id, adminReplyText)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Send size={14} />
                      <span>บันทึกและส่งข้อความตอบกลับ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteComplaint(selectedAdminComplaint.id)}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Trash2 size={14} />
                  <span>ลบรายการนี้</span>
                </button>
                <button onClick={() => setSelectedAdminComplaint(null)} className="btn btn-subtle btn-sm">
                  <span>ปิดหน้าต่าง</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member Quick Complaint Modal */}
        {memberComplaintModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2500,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}>
            <div className="surface-card animate-fade-in" style={{
              width: '100%',
              maxWidth: '560px',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              position: 'relative',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} style={{ color: 'var(--primary-600)' }} />
                  <span>ส่งเรื่องร้องเรียน / ข้อเสนอแนะ</span>
                </h3>
                <button onClick={() => setMemberComplaintModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>

              <form onSubmit={handleMemberSubmitComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* Pre-filled Member Identity */}
                <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>👤 <strong>ผู้ยื่น:</strong> {user.name || 'นายสมชาย มีสุข'}</div>
                  <div>🆔 <strong>เลขสมาชิก:</strong> {user.memberId || '04892'}</div>
                  <div style={{ gridColumn: 'span 2' }}>🏢 <strong>สังกัด:</strong> {user.department || 'โรงพยาบาลระยอง'}</div>
                </div>

                {/* Topic Selector */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block' }}>
                    หัวข้อเรื่อง / ประเภทคำร้อง <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    value={newMemberComplaint.topic}
                    onChange={(e) => setNewMemberComplaint({ ...newMemberComplaint, topic: e.target.value })}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="ข้อเสนอแนะการให้บริการ">💡 ข้อเสนอแนะการให้บริการ</option>
                    <option value="ร้องเรียนการบริการ">⚠️ ร้องเรียนการบริการ / พฤติกรรมบริการ</option>
                    <option value="แจ้งปัญหาการใช้งานระบบออนไลน์">💻 แจ้งปัญหาการใช้งานระบบออนไลน์</option>
                    <option value="สอบถามข้อมูล/สิทธิประโยชน์สมาชิก">❓ สอบถามข้อมูลทั่วไปและสิทธิประโยชน์</option>
                    <option value="เรื่องอื่นๆ">📝 เรื่องอื่นๆ</option>
                  </select>
                </div>

                {/* Message Input */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', display: 'block' }}>
                    รายละเอียดข้อความ <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    required
                    value={newMemberComplaint.message}
                    onChange={(e) => setNewMemberComplaint({ ...newMemberComplaint, message: e.target.value })}
                    placeholder="โปรดระบุรายละเอียดเรื่องร้องเรียนหรือข้อเสนอแนะของท่านให้ชัดเจน เพื่อให้เจ้าหน้าที่ตรวจสอบและดำเนินการได้อย่างถูกต้อง..."
                    style={{ fontSize: '0.88rem' }}
                  />
                </div>

                {/* Modal Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setMemberComplaintModalOpen(false)}
                    className="btn btn-subtle"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Send size={15} />
                    <span>ส่งเรื่องร้องเรียน</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Profile Modal (Avatar & Phone) */}
        <EditProfileModal 
          isOpen={editProfileModalOpen} 
          onClose={() => setEditProfileModalOpen(false)} 
        />

        {/* New Online Loan Request Modal */}
        <NewLoanRequestModal
          isOpen={memberLoanModalOpen}
          onClose={() => setMemberLoanModalOpen(false)}
          onSubmitLoan={handleMemberSubmitLoan}
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
