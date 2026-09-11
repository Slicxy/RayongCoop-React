import React, { useState } from 'react';
import { Award, User, Briefcase, Building } from 'lucide-react';
import { BOARD_MEMBERS, COOP_INFO } from '../data/mockData';

export default function BoardPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-title-wrap">
          <span className="section-badge">คณะผู้บริหาร</span>
          <h1 className="section-title">คณะกรรมการและฝ่ายจัดการ</h1>
          <p className="section-subtitle">
            คณะกรรมการดำเนินการชุดที่ 32 (ประจำปี 2566 - 2568) และฝ่ายจัดการ {COOP_INFO.nameTh}
          </p>
          <div className="section-line" />
        </div>

        {/* Board Members Grid */}
        <div className="grid-3">
          {BOARD_MEMBERS.map((member) => (
            <div key={member.id} className="surface-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Profile Image Wrap */}
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--primary-100)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1.25rem',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={member.image} 
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                {member.term}
              </span>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                {member.name}
              </h3>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold-dark)', marginBottom: '0.75rem' }}>
                {member.position}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={14} />
                <span>{member.workplace}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
