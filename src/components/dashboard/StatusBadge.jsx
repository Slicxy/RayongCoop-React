import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

/**
 * Standardized status badge for cooperative workflow states
 */
export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const getBadgeConfig = (st = '') => {
    const text = String(st).toLowerCase();
    if (text.includes('อนุมัติ') || text.includes('สำเร็จ') || text.includes('approved') || text.includes('success') || text.includes('active') || text.includes('ปกติ')) {
      return {
        variant: 'badge-emerald',
        icon: CheckCircle2,
        label: st
      };
    }
    if (text.includes('รอ') || text.includes('pending') || text.includes('process') || text.includes('ตรวจ')) {
      return {
        variant: 'badge-gold',
        icon: Clock,
        label: st
      };
    }
    if (text.includes('แก้ไข') || text.includes('revision') || text.includes('ปรับปรุง') || text.includes('เตือน')) {
      return {
        variant: 'badge-rose',
        icon: AlertCircle,
        label: st
      };
    }
    if (text.includes('ยกเลิก') || text.includes('ปฏิเสธ') || text.includes('rejected') || text.includes('cancelled')) {
      return {
        variant: 'badge-rose',
        icon: XCircle,
        label: st
      };
    }
    return {
      variant: 'badge-primary',
      icon: CheckCircle2,
      label: st
    };
  };

  const { variant, icon: Icon, label } = getBadgeConfig(status);
  const sizeStyles = size === 'sm' ? { fontSize: '0.72rem', padding: '0.2rem 0.5rem' } : { fontSize: '0.78rem', padding: '0.28rem 0.65rem' };

  return (
    <span
      className={`badge ${variant}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontWeight: 600,
        borderRadius: '6px',
        ...sizeStyles
      }}
    >
      {showIcon && Icon && <Icon size={size === 'sm' ? 12 : 14} style={{ flexShrink: 0 }} />}
      <span>{label}</span>
    </span>
  );
}
