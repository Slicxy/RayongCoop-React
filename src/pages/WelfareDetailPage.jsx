import React from 'react';
import { ArrowLeft, CheckCircle2, FileText, Info, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { WELFARE_ITEMS } from '../data/mockData';

export default function WelfareDetailPage() {
  const { welfareId } = useParams();
  const item = WELFARE_ITEMS.find((welfare) => welfare.id === welfareId);

  if (!item) {
    return <Navigate to="/welfare" replace />;
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link to="/welfare" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} aria-hidden="true" /> กลับไปหน้าสวัสดิการ
        </Link>

        <article className="glass-card" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: 'var(--radius-xl)' }}>
          <span className="badge badge-teal">{item.category}</span>
          <h1 className="section-title" style={{ textAlign: 'left', margin: '1rem 0 0.5rem' }}>{item.title}</h1>
          <p style={{ color: 'var(--accent-teal-dark)', fontWeight: 800, marginBottom: '1.5rem' }}>{item.status}</p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.75rem' }}>{item.desc}</p>

          <div style={{ background: 'var(--accent-teal-light)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <FileText size={21} style={{ color: 'var(--accent-teal-dark)', flex: '0 0 auto', marginTop: '0.15rem' }} aria-hidden="true" />
            <div>
              <p style={{ color: 'var(--primary-800)', fontWeight: 800, marginBottom: '0.2rem' }}>เอกสารอ้างอิงที่พบ</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.sourceLabel}</p>
            </div>
          </div>

          <section aria-labelledby="welfare-facts" style={{ marginBottom: '2rem' }}>
            <h2 id="welfare-facts" style={{ color: 'var(--primary-800)', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
              <Info size={22} style={{ color: 'var(--accent-teal-dark)' }} aria-hidden="true" />
              รายละเอียดสวัสดิการ
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {item.sections.map((section) => (
                <section key={section.title} aria-labelledby={`section-${item.id}-${section.title}`}>
                  <h3 id={`section-${item.id}-${section.title}`} style={{ color: 'var(--primary-700)', fontSize: '1.05rem', marginBottom: '0.75rem' }}>{section.title}</h3>
                  {section.items && (
                    <ul style={{ display: 'grid', gap: '0.65rem', paddingLeft: '1.4rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      {section.items.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                  )}
                  {section.table && (
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <table style={{ width: '100%', minWidth: '440px', borderCollapse: 'collapse', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <caption style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--primary-800)', background: 'var(--bg-surface)' }}>{section.table.caption}</caption>
                        <thead>
                          <tr style={{ background: 'var(--accent-teal-light)', color: 'var(--primary-800)', textAlign: 'left' }}>
                            {section.table.headers.map((header) => <th key={header} scope="col" style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{header}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row.join('-')} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                              {row.map((cell, index) => <td key={cell} style={{ padding: '0.75rem 1rem', fontWeight: index === 1 ? 700 : 400 }}>{cell}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </section>

          <section aria-labelledby="welfare-checklist" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
            <h2 id="welfare-checklist" style={{ color: 'var(--primary-800)', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
              <CheckCircle2 size={22} style={{ color: 'var(--accent-teal-dark)' }} aria-hidden="true" />
              สิ่งที่ควรตรวจสอบก่อนยื่น
            </h2>
            <ul style={{ display: 'grid', gap: '0.8rem', paddingLeft: '1.4rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {item.checklist.map((check) => <li key={check}>{check}</li>)}
            </ul>
          </section>

          <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginTop: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={21} style={{ color: 'var(--accent-teal-dark)', flex: '0 0 auto', marginTop: '0.15rem' }} aria-hidden="true" />
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              สิทธิ วงเงิน เอกสารประกอบ และช่วงเวลารับยื่นอาจเปลี่ยนตามระเบียบหรือประกาศของสหกรณ์ โปรดยืนยันข้อมูลล่าสุดกับเจ้าหน้าที่ก่อนยื่นคำขอ
            </p>
          </aside>
        </article>
      </div>
    </div>
  );
}
