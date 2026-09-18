import React from 'react';

/**
 * Reusable Section Header for Cooperative Dashboard
 */
export default function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'var(--primary-600)',
  actionButton,
  filters,
  className = ''
}) {
  return (
    <div
      className={`dashboard-section-header ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--primary-900)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: 0
          }}
        >
          {Icon && <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />}
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {filters}
        {actionButton}
      </div>
    </div>
  );
}
