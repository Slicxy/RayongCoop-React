import React, { useState } from 'react';
import { 
  Laptop, FileCheck, Coins, FileText, HeartHandshake, 
  MapPin, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Send 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SERVICES = [
  {
    id: 'emergency-loan',
    title: 'ยื่นคำขอกู้เงินฉุกเฉินออนไลน์',
    desc: 'สำหรับสมาชิกที่ต้องการกู้เงินฉุกเฉินไม่เกิน 100,000 บาท อนุมัติและโอนเงินเข้าบัญชีภายใน 1 วันทำการ',
    icon: FileCheck,
    badge: 'อนุมัติไว',
    color: 'emerald'
  },
  {
    id: 'share-change',
    title: 'ขอเปลี่ยนแปลงค่าหุ้นรายเดือน',
    desc: 'ยื่นคำขอเพิ่มหรือลดจำนวนเงินส่งค่าหุ้นรายเดือน (ต้องยื่นก่อนวันที่ 15 ของเดือน)',
    icon: Coins,
    badge: 'สะดวก',
    color: 'gold'
  },
  {
    id: 'tax-cert',
    title: 'ขอหนังสือรับรองดอกเบี้ยเงินกู้ (ลดหย่อนภาษี)',
    desc: 'ดาวน์โหลดหนังสือรับรองยอดดอกเบี้ยเงินกู้เพื่อที่อยู่อาศัย สำหรับนำไปยื่นลดหย่อนภาษีเงินได้บุคคลธรรมดา',
    icon: FileText,
    badge: 'อัตโนมัติ',
    color: 'primary'
  },
  {
    id: 'welfare-claim',
    title: 'ยื่นคำขอรับเงินสวัสดิการสมาชิก',
    desc: 'ส่งคำขอและเอกสารแนบเพื่อขอรับสวัสดิการคลอดบุตร มงคลสมรส เจ็บป่วย หรือทุนการศึกษา',
    icon: HeartHandshake,
    badge: 'ออนไลน์',
    color: 'teal'
  },
  {
    id: 'update-profile',
    title: 'แจ้งเปลี่ยนแปลงที่อยู่ / เบอร์โทรศัพท์',
    desc: 'ปรับปรุงข้อมูลส่วนบุคคล ที่อยู่จัดส่งเอกสาร และหมายเลขโทรศัพท์ให้เป็นปัจจุบัน',
    icon: MapPin,
    badge: 'รวดเร็ว',
    color: 'primary'
  }
];

export default function EServicePage() {
  const { user, isLoggedIn, setShowAuthModal } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    memberId: user?.memberId || '04892',
    name: user?.name || 'นายเกียรติศักดิ์ พูลเพิ่ม',
    phone: '081-234-5678',
    amount: '50000',
    details: 'ประสงค์ขอยื่นกู้เพื่อเหตุฉุกเฉินทางการเงิน'
  });

  const handleOpenForm = (srv) => {
    setSelectedService(srv);
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">บริการดิจิทัล 24 ชั่วโมง</span>
          <h1 className="section-title">ศูนย์บริการสมาชิกออนไลน์ (e-Services)</h1>
          <p className="section-subtitle">ทำธุรกรรม ยื่นคำขอ และติดตามสถานะได้สะดวกรวดเร็ว ทุกที่ทุกเวลา</p>
          <div className="section-line" />
        </div>

        {/* Services Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div key={srv.id} className="surface-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} />
                    </div>
                    <span className={`badge badge-${srv.color}`}>{srv.badge}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', marginBottom: '0.4rem' }}>{srv.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {srv.desc}
                  </p>
                </div>

                <button 
                  onClick={() => handleOpenForm(srv)} 
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  <span>เริ่มทำรายการ</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Online Request Modal */}
        {selectedService && (
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
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-800)' }}>{selectedService.title}</h3>
                <button onClick={() => setSelectedService(null)} style={{ color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>ส่งคำขอสำเร็จเรียบร้อย!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    เลขที่คำขอของคุณคือ <strong>REQ-{Math.floor(100000 + Math.random() * 900000)}</strong> เจ้าหน้าที่จะดำเนินการตรวจสอบและแจ้งผลกลับผ่าน SMS ภายใน 1 วันทำการ
                  </p>
                  <button onClick={() => setSelectedService(null)} className="btn btn-primary">
                    <span>ปิดหน้าต่าง</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">เลขทะเบียนสมาชิก</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.memberId} 
                      onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ชื่อ - นามสกุล ผู้ยื่นคำขอ</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์ที่ติดต่อได้</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      required 
                    />
                  </div>

                  {selectedService.id === 'emergency-loan' && (
                    <div className="form-group">
                      <label className="form-label">จำนวนเงินที่ขอกู้ (บาท)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={formData.amount} 
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                        required 
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">รายละเอียด / เหตุผลความจำเป็น</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      value={formData.details} 
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })} 
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => setSelectedService(null)} className="btn btn-subtle" style={{ flex: 1 }}>
                      ยกเลิก
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      <Send size={16} />
                      <span>ส่งคำขอ</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
