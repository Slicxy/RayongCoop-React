import React from 'react';
import { Landmark, Target, Shield, Heart, Award, CheckCircle2 } from 'lucide-react';
import { COOP_INFO } from '../data/mockData';

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container">
        
        {/* Page Header */}
        <div className="section-title-wrap">
          <span className="section-badge">ข้อมูลองค์กร</span>
          <h1 className="section-title">เกี่ยวกับสหกรณ์</h1>
          <p className="section-subtitle">{COOP_INFO.nameTh} ({COOP_INFO.nameEn})</p>
          <div className="section-line" />
        </div>

        {/* History Card */}
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>ความเป็นมา</span>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>
                ประวัติการก่อตั้งสหกรณ์
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                <strong>{COOP_INFO.nameTh}</strong> ได้รับการจดทะเบียนจัดตั้งตามพระราชบัญญัติสหกรณ์ เมื่อปี พ.ศ. {COOP_INFO.establishedYear} โดยการริเริ่มของบุคลากรสาธารณสุขจังหวัดระยอง เพื่อเป็นสถาบันการเงินที่มุ่งส่งเสริมการออมทรัพย์ และให้บริการสินเชื่อเพื่อบรรเทาความเดือดร้อนทางการเงินแก่สมาชิก
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                ตลอดระยะเวลากว่า 30 ปี สหกรณ์ได้ดำเนินงานด้วยความซื่อสัตย์ โปร่งใส มีธรรมาภิบาล และพัฒนาเทคโนโลยีการให้บริการอย่างต่อเนื่อง เพื่อประโยชน์สูงสุดและความมั่นคงของมวลสมาชิก
              </p>
            </div>

            <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-700)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} />
                <span>วิสัยทัศน์ (Vision)</span>
              </h3>
              <blockquote style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', borderLeft: '4px solid var(--accent-gold)', paddingLeft: '1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "เป็นสถาบันการเงินชั้นนำของบุคลากรสาธารณสุข บริหารงานโปร่งใส ใช้เทคโนโลยีดิจิทัล พัฒนาคุณภาพชีวิตสมาชิกอย่างยั่งยืน"
              </blockquote>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-teal-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} />
                <span>พันธกิจ (Mission)</span>
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                  <span>ส่งเสริมการออมทรัพย์และสร้างวินัยทางการเงินแก่สมาชิก</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                  <span>ให้บริการสินเชื่ออัตราดอกเบี้ยเป็นธรรม เพื่อสวัสดิการและที่อยู่อาศัย</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                  <span>จัดสวัสดิการที่ครอบคลุมทุกช่วงชีวิตของสมาชิกและครอบครัว</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                  <span>พัฒนาระบบเทคโนโลยีดิจิทัลเพื่อความสะดวกรวดเร็วและปลอดภัย</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-800)', marginBottom: '0.5rem' }}>ค่านิยมหลักขององค์กร (Core Values)</h2>
          <p style={{ color: 'var(--text-muted)' }}>หลักการทำงานที่บุคลากรสหกรณ์ทุกคนยึดถือปฏิบัติ</p>
        </div>

        <div className="grid-4">
          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Shield size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>ความซื่อสัตย์โปร่งใส</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ดำเนินงานตามหลักธรรมาภิบาล ตรวจสอบได้ทุกขั้นตอน</p>
          </div>

          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Heart size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>ใส่ใจบริการ</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ให้บริการสมาชิกด้วยความอบอุ่น รวดเร็ว และเป็นมิตร</p>
          </div>

          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Award size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>มุ่งมั่นพัฒนา</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>นำเทคโนโลยีใหม่ๆ มายกระดับการให้บริการสมาชิกรวดเร็วยิ่งขึ้น</p>
          </div>

          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Landmark size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>ความมั่นคงยั่งยืน</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>บริหารความเสี่ยงอย่างรอบคอบ เพื่อความปลอดภัยของเงินฝาก</p>
          </div>
        </div>

      </div>
    </div>
  );
}
