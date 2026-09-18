import React from 'react';

/**
 * Reusable minimal & modern KPI Metric Card for Cooperative Dashboard
 */
export default function KpiCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  variant = 'primary', // 'primary' | 'teal' | 'emerald' | 'gold' | 'rose'
  badgeText,
  badgeVariant,
  trend,
  className = '',
  onClick
}) {
  const variantStyles = {
    primary: {
      borderLeft: '4px solid var(--primary-600)',
      iconBg: 'rgba(30, 58, 138, 0.08)',
      iconColor: 'var(--primary-600)',
      valueColor: 'var(--primary-900)'
    },
    teal: {
      borderLeft: '4px solid var(--accent-teal)',
      iconBg: 'rgba(13, 148, 136, 0.1)',
      iconColor: 'var(--accent-teal)',
      valueColor: 'var(--accent-teal-dark)'
    },
    emerald: {
      borderLeft: '4px solid var(--accent-emerald)',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconColor: 'var(--accent-emerald-dark)',
      valueColor: 'var(--accent-emerald-dark)'
    },
    gold: {
      borderLeft: '4px solid var(--accent-gold)',
      iconBg: 'rgba(217, 119, 6, 0.1)',
      iconColor: 'var(--accent-gold-dark)',
      valueColor: 'var(--accent-gold-dark)'
    },
    rose: {
      borderLeft: '4px solid var(--accent-rose)',
      iconBg: 'rgba(225, 29, 72, 0.1)',
      iconColor: 'var(--accent-rose)',
      valueColor: 'var(--accent-rose)'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <div
      className={`surface-card ${onClick ? 'cursor-pointer transition-transform hover:-translate-y-0.5' : ''} ${className}`}
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        borderLeft: currentVariant.borderLeft,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </div>
        {Icon && (
          <div
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              background: currentVariant.iconBg,
              color: currentVariant.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '0.35rem' }}>
        <div
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: currentVariant.valueColor,
            fontFamily: 'var(--font-display, inherit)',
            lineHeight: 1.2
          }}
        >
          {value}
          {unit && (
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
              {unit}
            </span>
          )}
        </div>
      </div>

      {(subtitle || badgeText || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.2rem', fontSize: '0.78rem' }}>
          {subtitle && (
            <span style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </span>
          )}
          {badgeText && (
            <span className={`badge badge-${badgeVariant || variant}`} style={{ fontSize: '0.7rem' }}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
