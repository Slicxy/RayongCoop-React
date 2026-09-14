import React, { useState } from 'react';
import { 
  X, CreditCard, DollarSign, Calculator, Clock, 
  FileText, ShieldCheck, CheckCircle2, AlertCircle, UploadCloud, 
  ArrowRight, Landmark, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LOAN_TYPES = [
  {
    id: 'emergency',
    name: 'เงินกู้เพื่อเหตุฉุกเฉิน (Emergency Loan)',
    shortName: 'กู้ฉุกเฉิน',
    maxAmount: 100000,
    rate: 5.75,
    maxTerm: 12,
    guarantorReq: 'ไม่ต้องใช้ผู้ค้ำประกัน (ใช้วงเงินหุ้นค้ำ)',
    badge: 'อนุมัติไว 24 ชม.',
    badgeColor: 'emerald'
  },
  {
    id: 'ordinary',
    name: 'เงินกู้สามัญเพื่อสวัสดิการ (Ordinary Loan)',
    shortName: 'กู้สามัญ',
    maxAmount: 1500000,
    rate: 5.25,
    maxTerm: 84,
    guarantorReq: 'ใช้ผู้ค้ำประกัน 1 - 2 ท่าน',
    badge: 'ดอกเบี้ยต่ำ',
    badgeColor: 'primary'
  },
  {
    id: 'special-housing',
    name: 'เงินกู้พิเศษเพื่อที่อยู่อาศัย (Housing Loan)',
    shortName: 'กู้ซื้อ/สร้างบ้าน',
    maxAmount: 3000000,
    rate: 4.75,
    maxTerm: 240,
    guarantorReq: 'จำนองอสังหาริมทรัพย์เป็นประกัน',
    badge: 'ผ่อนยาวสูงสุด 20 ปี',
    badgeColor: 'gold'
  }
];

export default function NewLoanRequestModal({ isOpen, onClose, onSubmitLoan }) {
  const { user } = useAuth();
  
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0]);
  const [amount, setAmount] = useState(50000);
  const [term, setTerm] = useState(12);
  const [purpose, setPurpose] = useState('ใช้จ่ายฉุกเฉินและจำเป็นในครอบครัว');
  const [uploadedDocName, setUploadedDocName] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  // Calculate rough monthly payment (Amortization estimate)
  const monthlyRate = (selectedType.rate / 100) / 12;
  const estMonthly = monthlyRate > 0
    ? (amount * (monthlyRate * Math.pow(1 + monthlyRate, term))) / (Math.pow(1 + monthlyRate, term) - 1)
    : amount / term;

  const handleTypeChange = (typeObj) => {
    setSelectedType(typeObj);
    if (amount > typeObj.maxAmount) {
      setAmount(typeObj.maxAmount);
    }
    if (term > typeObj.maxTerm) {
      setTerm(Math.min(term, typeObj.maxTerm));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('กรุณากดยอมรับข้อกำหนดและเงื่อนไขการยื่นกู้');
      return;
    }
    if (amount <= 0 || amount > selectedType.maxAmount) {
      alert(`วงเงินกู้ต้องอยู่ระหว่าง 1 ถึง ${selectedType.maxAmount.toLocaleString()} บาท`);
      return;
    }

    setSubmitting(true);

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newId = `LN-6709-${randomSuffix}`;
    const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

    const newLoanItem = {
      id: newId,
      memberName: user.name || 'นายสมชาย มีสุข',
      memberId: user.memberId || '04892',
      department: user.department || 'โรงพยาบาลระยอง',
      phone: user.phone || '081-234-5678',
      type: selectedType.name,
      shortType: selectedType.shortName,
      amount: `${Number(amount).toLocaleString()} บาท`,
      rawAmount: Number(amount),
      term: `${term} งวด`,
      interestRate: `${selectedType.rate}% ต่อปี`,
      monthlyEstimate: `${Math.round(estMonthly).toLocaleString()} บาท/เดือน`,
      purpose: purpose.trim(),
      guarantor: guarantorName.trim() || selectedType.guarantorReq,
      attachedDoc: uploadedDocName || 'สลิปเงินเดือน_ล่าสุด.pdf',
      date: dateStr,
      status: 'รอดำเนินการ',
      currentStep: 2, // Step 1: ยื่นคำขอ (เสร็จ), Step 2: รอเจ้าหน้าที่ตรวจสอบ
      note: 'ยื่นคำขอเรียบร้อยแล้ว รอเจ้าหน้าที่สินเชื่อตรวจสอบคุณสมบัติและเอกสารแนบ',
      lastUpdated: `${dateStr} (เพิ่งยื่น)`
    };

    setTimeout(() => {
      onSubmitLoan(newLoanItem);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="surface-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-primary">e-Loan Application</span>
                <span className="badge badge-emerald">ระบบคำขอดิจิทัล 24 ชม.</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', fontWeight: 800, margin: 0 }}>
                ยื่นคำขอกู้เงินออนไลน์
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Member Profile Banner */}
        <div style={{
          background: 'var(--bg-subtle)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>ผู้ยื่นคำขอ:</span>{' '}
            <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong>{' '}
            <span style={{ color: 'var(--primary-600)' }}>(สมาชิกเลขที่: {user.memberId || '04892'})</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>สังกัด:</span>{' '}
            <strong>{user.department || 'โรงพยาบาลระยอง'}</strong>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Step 1: Select Loan Product */}
          <div>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
              1. เลือกประเภทสินเชื่อที่ต้องการขอกู้:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {LOAN_TYPES.map(t => {
                const isSelected = selectedType.id === t.id;
                return (
                  <div 
                    key={t.id}
                    onClick={() => handleTypeChange(t)}
                    style={{
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--primary-50, rgba(37, 99, 235, 0.06))' : 'var(--bg-surface)',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className={`badge badge-${t.badgeColor}`} style={{ fontSize: '0.7rem' }}>{t.badge}</span>
                      {isSelected && <CheckCircle2 size={18} style={{ color: 'var(--primary-600)' }} />}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold-dark)', fontWeight: 600 }}>
                      ดอกเบี้ย {t.rate}% ต่อปี (วงเงินสูงสุด {t.maxAmount.toLocaleString()} บ.)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Amount & Terms */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                2. วงเงินที่ประสงค์ขอกู้ (บาท):
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number"
                  className="form-control"
                  value={amount}
                  min={1000}
                  max={selectedType.maxAmount}
                  step={5000}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-700)', paddingRight: '3rem' }}
                  required
                />
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  บาท
                </span>
              </div>
              
              {/* Quick Amount Chips */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {[30000, 50000, 100000, 300000, 500000]
                  .filter(val => val <= selectedType.maxAmount)
                  .map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAmount(chip)}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                        background: amount === chip ? 'var(--primary-600)' : 'var(--bg-subtle)',
                        color: amount === chip ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {chip.toLocaleString()}
                    </button>
                  ))}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                3. ระยะเวลาผ่อนชำระ (งวด/เดือน):
              </label>
              <select 
                className="form-control"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                style={{ fontWeight: 600, fontSize: '1rem' }}
              >
                {[6, 12, 24, 36, 48, 60, 72, 84, 120, 180, 240]
                  .filter(m => m <= selectedType.maxTerm)
                  .map(m => (
                    <option key={m} value={m}>{m} งวด ({Math.round(m / 12 * 10) / 10} ปี)</option>
                  ))}
              </select>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                สูงสุดไม่เกิน {selectedType.maxTerm} งวดตามระเบียบสหกรณ์
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(7, 59, 116, 0.06), rgba(11, 94, 215, 0.08))',
            border: '1px solid rgba(11, 94, 215, 0.2)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ยอดผ่อนชำระโดยประมาณต่องวด:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-display)' }}>
                  ≈ {Math.round(estMonthly).toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>บาท/เดือน</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              <div>อัตราดอกเบี้ย: <strong>{selectedType.rate}% ต่อปี (ลดต้นลดดอก)</strong></div>
              <div>หลักประกัน: <strong>{selectedType.guarantorReq}</strong></div>
            </div>
          </div>

          {/* Step 3: Purpose & Guarantor */}
          <div style={{ display: 'grid', gridTemplateColumns: selectedType.id !== 'emergency' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                4. วัตถุประสงค์การขอกู้:
              </label>
              <input 
                type="text"
                className="form-control"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="เช่น ค่าใช้จ่ายฉุกเฉิน, ซ่อมแซมบ้าน, การศึกษาบุตร"
                required
              />
            </div>

            {selectedType.id !== 'emergency' && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                  5. ข้อมูลผู้ค้ำประกัน (ชื่อ / รหัสสมาชิก):
                </label>
                <input 
                  type="text"
                  className="form-control"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  placeholder="เช่น นายประสิทธิ์ ทองดี (รหัส 03192)"
                />
              </div>
            )}
          </div>

          {/* Step 4: Document Attachment */}
          <div>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem' }}>
              {selectedType.id !== 'emergency' ? '6.' : '5.'} แนบเอกสารประกอบ (สลิปเงินเดือน / สำเนาบัตรประชาชน):
            </label>
            <div style={{
              border: '2px dashed var(--border-subtle)',
              borderRadius: '10px',
              padding: '1rem',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('loan-doc-upload')?.click()}
            >
              <UploadCloud size={24} style={{ color: 'var(--primary-600)', margin: '0 auto 0.35rem auto' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {uploadedDocName ? `✓ แนบไฟล์แล้ว: ${uploadedDocName}` : 'คลิกเพื่อเลือกไฟล์เอกสาร (PDF, JPG, PNG ขนาดไม่เกิน 10MB)'}
              </div>
              <input 
                id="loan-doc-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: '8px' }}>
            <input 
              type="checkbox"
              id="agree-loan-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ marginTop: '0.2rem', cursor: 'pointer' }}
            />
            <label htmlFor="agree-loan-terms" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.4 }}>
              ข้าพเจ้ารับรองว่าข้อมูลข้างต้นเป็นความจริงทุกประการ และยินยอมให้สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด ตรวจสอบข้อมูลคุณสมบัติและหักเงินได้รายเดือนเพื่อชำระหนี้ตามระเบียบ
            </label>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-subtle" disabled={submitting}>
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
              style={{ padding: '0.6rem 2rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {submitting ? (
                <span>กำลังส่งคำขอ...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>ยืนยันการยื่นคำขอกู้เงิน</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
