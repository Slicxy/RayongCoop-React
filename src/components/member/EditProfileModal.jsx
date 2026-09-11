import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Phone, Camera, UploadCloud, CheckCircle2, 
  Lock, X, Trash2, FileImage, ShieldCheck, AlertCircle, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || '');
      setPhone(user.phone || '');
      setSavedSuccess(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (เช่น PNG, JPG, JPEG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('ไฟล์รูปภาพมีขนาดใหญ่เกิน 5MB กรุณาเลือกไฟล์ขนาดเล็กลง');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert('กรุณาระบุเบอร์โทรศัพท์ติดต่อ');
      return;
    }

    updateProfile({ avatar, phone: phone.trim() });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
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
      <div 
        className="surface-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={22} style={{ color: 'var(--primary-600)' }} />
              <span>แก้ไขข้อมูลส่วนตัว (Edit Profile)</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem', margin: 0 }}>
              ปรับปรุงรูปภาพโปรไฟล์และเบอร์โทรศัพท์สำหรับทุกบทบาทผู้ใช้งาน
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {savedSuccess && (
          <div style={{
            background: 'var(--accent-emerald-light)',
            color: 'var(--accent-emerald-dark)',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            <CheckCircle2 size={20} />
            <span>บันทึกรูปภาพโปรไฟล์และเบอร์โทรศัพท์เรียบร้อยแล้ว!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* =========================================================================
              1. EDITABLE FIELD 1: AVATAR / PROFILE PICTURE
              ========================================================================= */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)'
          }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>1. รูปภาพโปรไฟล์ (Profile Picture)</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>อนุญาตแก้ไขได้</span>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Circular Avatar Preview */}
              <div 
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '3px solid #ffffff',
                  flexShrink: 0
                }}
                title="คลิกเพื่อเลือกรูปภาพใหม่"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name?.charAt(0) || 'U'
                )}

                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.55)',
                  padding: '3px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Camera size={14} />
                </div>
              </div>

              {/* Upload Drop Zone Box */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    border: isDragging ? '2px dashed var(--primary-600)' : '2px dashed var(--border-subtle)',
                    background: isDragging ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UploadCloud size={22} style={{ color: 'var(--primary-600)', margin: '0 auto 0.25rem auto' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {isDragging ? 'ปล่อยรูปภาพที่นี่' : 'คลิกเลือกไฟล์ หรือลากรูปภาพมาวาง'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    PNG, JPG, WEBP (สูงสุด 5MB)
                  </div>
                </div>

                {avatar && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="btn btn-sm btn-subtle"
                      style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', padding: '0.2rem 0.5rem' }}
                    >
                      <Trash2 size={13} style={{ marginRight: '0.25rem' }} />
                      <span>ลบรูปภาพ (ใช้ตัวอักษรย่อ)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. EDITABLE FIELD 2: PHONE NUMBER
              ========================================================================= */}
          <div>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>2. เบอร์โทรศัพท์มือถือ (Phone Number) <span style={{ color: 'var(--accent-rose)' }}>*</span></span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>อนุญาตแก้ไขได้</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-600)' }} />
              <input
                type="tel"
                className="form-control"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 081-234-5678"
                style={{ paddingLeft: '2.5rem', fontSize: '0.95rem', fontWeight: 600 }}
              />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', margin: '0.35rem 0 0 0' }}>
              💡 ใช้สำหรับรับการแจ้งเตือนยอดเงินกู้, เงินปันผล, และข้อความตอบกลับจากสหกรณ์
            </p>
          </div>

          {/* =========================================================================
              3. LOCKED OFFICIAL FIELDS (READ-ONLY)
              ========================================================================= */}
          <div style={{
            background: 'var(--bg-subtle)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              <Lock size={15} style={{ color: 'var(--accent-gold-dark)' }} />
              <span>ข้อมูลทางการประจำตัว (ล็อคความปลอดภัย - ไม่สามารถแก้ไขเองได้)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>ชื่อ - นามสกุล:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>{user.name}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>รหัสประจำตัว / สมาชิก:</span>
                <div style={{ fontWeight: 700, color: 'var(--primary-700)', marginTop: '0.1rem' }}>{user.username || user.memberId}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>บทบาท / สิทธิ์ในระบบ:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>{user.roleBadge || user.roleName}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>สังกัด / หน่วยงาน:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>{user.department || '-'}</div>
              </div>
            </div>

            <div style={{
              marginTop: '0.85rem',
              paddingTop: '0.75rem',
              borderTop: '1px dashed var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <AlertCircle size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>หากต้องการแก้ไขชื่อ-สกุล หรือเปลี่ยนสังกัด กรุณาติดต่อฝ่ายทะเบียนสมาชิก สหกรณ์ฯ</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-subtle"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem' }}
            >
              <Save size={16} />
              <span>บันทึกข้อมูลส่วนตัว</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
