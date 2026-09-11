import React, { useState } from 'react';
import { Calculator, TrendingUp, FileCheck } from 'lucide-react';
import LoanCalculator from '../components/calculators/LoanCalculator';
import DividendEstimator from '../components/calculators/DividendEstimator';
import LoanReadinessChecklist from '../components/calculators/LoanReadinessChecklist';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('loan');

  return (
    <div className="section">
      <div className="container">
        
        <div className="section-title-wrap">
          <span className="section-badge">เครื่องคำนวณทางการเงิน</span>
          <h1 className="section-title">ศูนย์คำนวณและวางแผนการเงิน</h1>
          <p className="section-subtitle">เครื่องมือช่วยวางแผนการกู้เงิน ค่างวดรายเดือน และการประมาณการเงินปันผลสหกรณ์</p>
          <div className="section-line" />
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('loan')}
            className={`btn ${activeTab === 'loan' ? 'btn-primary' : 'btn-subtle'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.5rem' }}
          >
            <Calculator size={18} />
            <span>คำนวณเงินกู้และค่างวด</span>
          </button>

          <button
            onClick={() => setActiveTab('dividend')}
            className={`btn ${activeTab === 'dividend' ? 'btn-teal' : 'btn-subtle'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.5rem' }}
          >
            <TrendingUp size={18} />
            <span>ประมาณการเงินปันผล-เฉลี่ยคืน</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`btn ${activeTab === 'checklist' ? 'btn-gold' : 'btn-subtle'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.5rem' }}
          >
            <FileCheck size={18} />
            <span>ตรวจเช็คความพร้อมการกู้</span>
          </button>
        </div>

        {/* Render Tab Content */}
        {activeTab === 'loan' && <LoanCalculator />}
        {activeTab === 'dividend' && <DividendEstimator />}
        {activeTab === 'checklist' && <LoanReadinessChecklist />}

      </div>
    </div>
  );
}
