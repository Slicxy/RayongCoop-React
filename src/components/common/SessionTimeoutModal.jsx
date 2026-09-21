import React from 'react';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

export default function SessionTimeoutModal({
  isOpen,
  remainingSeconds,
  onExtendSession,
  onLogout
}) {
  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
      className="session-timeout-backdrop animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10001,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="surface-card animate-scale-up shadow-2xl"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.75rem',
          border: '2px solid var(--accent-gold)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Warning Icon Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.25rem auto',
            borderRadius: '50%',
            background: 'var(--accent-gold-light)',
            color: 'var(--accent-gold-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Clock size={32} />
        </div>

        <h3 id="session-timeout-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.4rem' }}>
          เซสชันการใช้งานกำลังจะหมดอายุ
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
          เนื่องจากไม่มีการใช้งานระบบมาระยะหนึ่ง เพื่อความปลอดภัยของข้อมูลทางการเงิน ระบบจะออกจากระบบอัตโนมัติภายใน
        </p>

        {/* Live Countdown Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.65rem 1.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-rose-light)',
            color: 'var(--accent-rose)',
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: '1.75rem',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}
        >
          {timeFormatted}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-outline"
            style={{
              minHeight: '44px',
              padding: '0.65rem 1.2rem',
              color: 'var(--accent-rose)',
              borderColor: 'var(--accent-rose)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600
            }}
          >
            <LogOut size={16} />
            <span>ออกจากระบบ</span>
          </button>

          <button
            type="button"
            onClick={onExtendSession}
            className="btn btn-primary"
            style={{
              minHeight: '44px',
              padding: '0.65rem 1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700
            }}
            autoFocus
          >
            <RefreshCw size={16} />
            <span>ต่ออายุเซสชัน</span>
          </button>
        </div>
      </div>
    </div>
  );
}
