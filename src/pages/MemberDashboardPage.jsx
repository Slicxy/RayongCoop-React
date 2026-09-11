import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Coins, Landmark, ShieldCheck, TrendingUp, 
  FileText, Download, LogOut, CreditCard, Clock, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COOP_INFO } from '../data/mockData';

export default function MemberDashboardPage() {
  const { user, isLoggedIn, logout, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)' }}>
            <User size={48} style={{ color: 'var(--primary-600)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>กรุณาเข้าสู่ระบบสมาชิก</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              เพื่อเข้าถึงข้อมูลทางการเงิน ทุนเรือนหุ้น เงินฝาก และใบเสร็จรับเงินของคุณ
            </p>
            <button onClick={() => setShowAuthModal(true)} className="btn btn-primary" style={{ width: '100%' }}>
              <span>เข้าสู่ระบบสมาชิก</span>
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

  return (
    <div className="section" style={{ background: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Member Profile Header Card */}
        <div className="surface-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', background: 'var(--gradient-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-md)'
              }}>
                {user.name.charAt(3)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-900)' }}>{user.name}</h2>
                  <span className="badge badge-emerald">สมาชิกภาพปกติ</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  เลขสมาชิก: <strong>{user.memberId}</strong> • สังกัด: {user.department} ({user.position})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  เป็นสมาชิกเมื่อ: {user.memberSince} • ค่าหุ้นรายเดือน: {user.monthlyShare.toLocaleString()} บาท/เดือน
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>
              <LogOut size={16} />
              <span>ออกจากระบบ</span>
            </button>

          </div>
        </div>

        {/* 4 Key Balances Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Coins size={16} style={{ color: 'var(--primary-600)' }} />
              <span>ทุนเรือนหุ้นสะสม</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-display)' }}>
              {user.shares.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald-dark)', marginTop: '0.4rem' }}>
              ส่งเพิ่มเดือนละ {user.monthlyShare.toLocaleString()} บ.
            </div>
          </div>

          <div className="surface-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-teal)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Landmark size={16} style={{ color: 'var(--accent-teal)' }} />
              <span>เงินฝากรวม ({user.accounts.length} บัญชี)</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-teal-dark)', fontFamily: 'var(--font-display)' }}>
              {user.savings.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
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
              {user.loanBalance.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
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
              {(user.dividendEstimated + user.loanRefundEstimated).toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>บาท</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              ปันผล {user.dividendEstimated.toLocaleString()} + คืน {user.loanRefundEstimated.toLocaleString()}
            </div>
          </div>

        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('overview')} style={tabNavBtn(activeTab === 'overview')}>บัญชีเงินฝาก & หนี้</button>
          <button onClick={() => setActiveTab('receipts')} style={tabNavBtn(activeTab === 'receipts')}>ใบเสร็จรับเงิน (e-Receipt)</button>
        </div>

        {activeTab === 'overview' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Savings Accounts List */}
            <div className="surface-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>บัญชีเงินฝากของสมาชิก</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {user.accounts.map((acc, idx) => (
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

            {/* Active Loans */}
            <div className="surface-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>สัญญาเงินกู้ที่ผูกพัน</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {user.loans.map((loan, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 700 }}>{loan.type} ({loan.contractNo})</div>
                      <span className="badge badge-gold">ผ่อนชำระปกติ</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>วงเงินตามสัญญา:</span> <strong>{loan.principal.toLocaleString()} ฿</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>ยอดเงินคงเหลือ:</span> <strong style={{ color: 'var(--accent-rose)' }}>{loan.balance.toLocaleString()} ฿</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>ผ่อนเดือนละ:</span> <strong>{loan.monthlyPay.toLocaleString()} ฿</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>งวดคงเหลือ:</span> <strong>{loan.termRemaining}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Receipts Tab */
          <div className="surface-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)', marginBottom: '1.25rem' }}>
              ประวัติใบเสร็จรับเงินประจำเดือน (e-Receipt)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {user.recentReceipts.map((rc, idx) => (
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
