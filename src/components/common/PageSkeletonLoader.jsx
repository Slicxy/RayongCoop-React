import React from 'react';

export default function PageSkeletonLoader() {
  return (
    <div
      className="section"
      style={{
        minHeight: '75vh',
        background: 'var(--bg-main)',
        paddingTop: '2.5rem',
        paddingBottom: '3.5rem'
      }}
      role="status"
      aria-live="polite"
      aria-label="กำลังโหลดเนื้อหา..."
    >
      <div className="container" style={{ maxWidth: '1200px' }}>

        {/* Header Skeleton */}
        <div
          className="surface-card"
          style={{
            padding: '1.75rem 2rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              className="skeleton-pulse"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--bg-subtle)'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div
                className="skeleton-pulse"
                style={{
                  width: '220px',
                  height: '22px',
                  borderRadius: '6px',
                  background: 'var(--bg-subtle)'
                }}
              />
              <div
                className="skeleton-pulse"
                style={{
                  width: '160px',
                  height: '14px',
                  borderRadius: '4px',
                  background: 'var(--bg-subtle)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div
              className="skeleton-pulse"
              style={{
                width: '120px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--bg-subtle)'
              }}
            />
            <div
              className="skeleton-pulse"
              style={{
                width: '100px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--bg-subtle)'
              }}
            />
          </div>
        </div>

        {/* Grid Skeleton Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="surface-card"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  className="skeleton-pulse"
                  style={{
                    width: '110px',
                    height: '16px',
                    borderRadius: '4px',
                    background: 'var(--bg-subtle)'
                  }}
                />
                <div
                  className="skeleton-pulse"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--bg-subtle)'
                  }}
                />
              </div>
              <div
                className="skeleton-pulse"
                style={{
                  width: '140px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--bg-subtle)'
                }}
              />
              <div
                className="skeleton-pulse"
                style={{
                  width: '180px',
                  height: '12px',
                  borderRadius: '4px',
                  background: 'var(--bg-subtle)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Large Table/Content Block Skeleton */}
        <div
          className="surface-card"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div
            className="skeleton-pulse"
            style={{
              width: '260px',
              height: '24px',
              borderRadius: '6px',
              background: 'var(--bg-subtle)'
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '8px',
              background: 'var(--bg-subtle)'
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '8px',
              background: 'var(--bg-subtle)'
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '8px',
              background: 'var(--bg-subtle)'
            }}
          />
        </div>

      </div>
    </div>
  );
}
