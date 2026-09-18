import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Polite and accessible Empty State component for Cooperative Dashboard
 */
export default function EmptyState({
  title = 'ไม่พบข้อมูลในขณะนี้',
  description = 'ยังไม่มีรายการข้อมูลที่ต้องแสดงผล หรือไม่มีรายการที่ตรงกับเงื่อนไขการค้นหา',
  icon: Icon = Inbox,
  actionButton,
  className = ''
}) {
  return (
    <div
      className={`empty-state-card ${className}`}
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0.5rem 0'
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'var(--bg-surface)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Icon size={26} style={{ opacity: 0.7 }} />
      </div>

      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
