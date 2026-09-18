import React from 'react';
import { User, LogOut, Edit3, Calendar, Phone } from 'lucide-react';

/**
 * Reusable Dashboard Header with Profile Info, Role Badge, and Actions
 */
export default function DashboardHeader({
  user,
  onEditProfile,
  onLogout,
  quickActions
}) {
  const role = user?.role || 'member';

  const getRoleConfig = (r) => {
    switch (r) {
      case 'super_admin':
        return {
          title: 'ผู้ดูแลระบบสูงสุด',
          badgeClass: 'badge-rose',
          gradient: 'linear-gradient(135deg, #ef4444, #991b1b)',
          defaultAvatar: '👑'
        };
      case 'staff':
        return {
          title: 'เจ้าหน้าที่สินเชื่อ/การเงิน',
          badgeClass: 'badge-primary',
          gradient: 'var(--gradient-primary)',
          defaultAvatar: '💼'
        };
      case 'auditor':
        return {
          title: 'ผู้ตรวจสอบกิจการ / ผู้จัดการ',
          badgeClass: 'badge-gold',
          gradient: 'var(--gradient-gold)',
          defaultAvatar: '🔍'
        };
      default:
        return {
          title: 'สมาชิกสหกรณ์',
          badgeClass: 'badge-emerald',
          gradient: 'var(--gradient-teal)',
          defaultAvatar: '👤'
        };
    }
  };

  const roleConfig = getRoleConfig(role);
  const todayStr = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className="surface-card dashboard-hero-header"
      style={{
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        {/* User Identity Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: roleConfig.gradient,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              border: '2px solid var(--bg-surface)',
              flexShrink: 0
            }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name || 'User Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              roleConfig.defaultAvatar
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', margin: 0 }}>
                {user?.name || 'ผู้ใช้งานสหกรณ์'}
              </h2>
              <span className={`badge ${roleConfig.badgeClass}`}>
                {user?.roleBadge || user?.roleName || roleConfig.title}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>{user?.department || 'สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด'}</span>
              {user?.position && <span> ({user.position})</span>}
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}
            >
              <span>รหัส: <strong>{user?.memberId || user?.username || '-'}</strong></span>
              {user?.phone && (
                <>
                  <span style={{ color: 'var(--border-subtle)' }}>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    <Phone size={13} />
                    {user.phone}
                  </span>
                </>
              )}
              <span style={{ color: 'var(--border-subtle)' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                <Calendar size={13} />
                {todayStr}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {quickActions}

          {onEditProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="btn btn-subtle btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-subtle)' }}
              title="แก้ไขโปรไฟล์และข้อมูลติดต่อ"
            >
              <Edit3 size={15} style={{ color: 'var(--primary-600)' }} />
              <span>แก้ไขข้อมูลส่วนตัว</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="btn btn-outline btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-rose)',
                borderColor: 'var(--accent-rose)'
              }}
              title="ออกจากระบบ"
            >
              <LogOut size={15} />
              <span>ออกจากระบบ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
