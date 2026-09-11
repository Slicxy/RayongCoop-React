import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            404
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem 0', color: 'var(--primary-900)' }}>
            ไม่พบหน้าที่คุณต้องการ
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            หน้าที่คุณกำลังค้นหาอาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              <Home size={18} />
              <span>กลับสู่หน้าแรก</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
