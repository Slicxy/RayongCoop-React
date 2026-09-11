import React, { useState } from 'react';
import { Download, FileText, Search, Filter } from 'lucide-react';
import { DOCUMENTS } from '../data/mockData';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const categories = ['ทั้งหมด', 'แบบฟอร์มเงินกู้', 'แบบฟอร์มเงินฝาก', 'สวัสดิการ', 'รายงานประจำปี', 'ข้อบังคับ/ระเบียบ'];

  const filteredDocs = DOCUMENTS.filter((doc) => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || doc.category === selectedCategory;
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">ศูนย์ดาวน์โหลด</span>
          <h1 className="section-title">เอกสารและแบบฟอร์ม</h1>
          <p className="section-subtitle">ดาวน์โหลดแบบฟอร์มคำขอ ระเบียบ ข้อบังคับ และรายงานประจำปีของสหกรณ์</p>
          <div className="section-line" />
        </div>

        {/* Search & Category Filter Bar */}
        <div className="surface-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="form-control"
                placeholder="ค้นหาชื่อแบบฟอร์ม หรือหมวดหมู่เอกสาร..."
                style={{ paddingLeft: '2.75rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: selectedCategory === cat ? 'var(--primary-600)' : 'var(--bg-subtle)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Documents List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="surface-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-primary">{doc.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.format} • {doc.size}</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{doc.title}</h4>
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => alert(`จำลองการดาวน์โหลด: ${doc.title} (${doc.size})`)}
                >
                  <Download size={15} />
                  <span>ดาวน์โหลดไฟล์</span>
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              ไม่พบเอกสารที่ค้นหา
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
