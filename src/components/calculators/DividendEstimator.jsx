import React, { useState, useMemo } from 'react';
import { TrendingUp, Coins, Percent, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DividendEstimator() {
  const [initialShares, setInitialShares] = useState(300000);
  const [monthlyShare, setMonthlyShare] = useState(3000);
  const [dividendRate, setDividendRate] = useState(5.25);
  const [loanInterestPaid, setLoanInterestPaid] = useState(35000);
  const [refundRate, setRefundRate] = useState(12.50);

  const results = useMemo(() => {
    const init = parseFloat(initialShares) || 0;
    const monthly = parseFloat(monthlyShare) || 0;
    const divRate = (parseFloat(dividendRate) || 0) / 100;
    const interest = parseFloat(loanInterestPaid) || 0;
    const refRate = (parseFloat(refundRate) || 0) / 100;

    // Dividend on initial shares (full 12 months)
    const initDividend = init * divRate;

    // Dividend on monthly share additions (average 6.5 months)
    // Month 1: 12/12, Month 2: 11/12, ..., Month 12: 1/12 => Sum(1..12)/12 = 78/12 = 6.5
    const monthlyDividend = (monthly * 78 * divRate) / 12;

    const totalDividend = Math.round(initDividend + monthlyDividend);
    const totalRefund = Math.round(interest * refRate);
    const grandTotal = totalDividend + totalRefund;

    return {
      totalDividend,
      totalRefund,
      grandTotal,
      endYearShares: init + (monthly * 12)
    };
  }, [initialShares, monthlyShare, dividendRate, loanInterestPaid, refundRate]);

  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp className="text-primary" />
          <span>โปรแกรมประมาณการเงินปันผลและเงินเฉลี่ยคืน</span>
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          คำนวณผลตอบแทนจากเงินปันผลตามหุ้น และเงินเฉลี่ยคืนตามส่วนธุรกิจดอกเบี้ยเงินกู้
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Input Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Share Capital */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>ทุนเรือนหุ้นสะสมต้นปี (บาท)</label>
              <strong style={{ color: 'var(--primary-600)' }}>{Number(initialShares).toLocaleString()} บาท</strong>
            </div>
            <input 
              type="number"
              step="10000"
              className="form-control"
              value={initialShares}
              onChange={(e) => setInitialShares(Number(e.target.value))}
            />
          </div>

          {/* Monthly Share */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>ค่าหุ้นส่งรายเดือน (บาท)</label>
              <strong style={{ color: 'var(--primary-600)' }}>{Number(monthlyShare).toLocaleString()} บาท/เดือน</strong>
            </div>
            <input 
              type="number"
              step="500"
              className="form-control"
              value={monthlyShare}
              onChange={(e) => setMonthlyShare(Number(e.target.value))}
            />
          </div>

          {/* Dividend Rate */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>อัตราเงินปันผลคาดการณ์ (% ต่อปี)</label>
              <strong style={{ color: 'var(--accent-gold-dark)' }}>{dividendRate}%</strong>
            </div>
            <input 
              type="number"
              step="0.05"
              className="form-control"
              value={dividendRate}
              onChange={(e) => setDividendRate(Number(e.target.value))}
            />
          </div>

          {/* Loan Interest Paid */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>ดอกเบี้ยเงินกู้ที่จ่ายในรอบปี (บาท)</label>
              <strong style={{ color: 'var(--accent-teal-dark)' }}>{Number(loanInterestPaid).toLocaleString()} บาท</strong>
            </div>
            <input 
              type="number"
              step="1000"
              className="form-control"
              value={loanInterestPaid}
              onChange={(e) => setLoanInterestPaid(Number(e.target.value))}
            />
          </div>

          {/* Refund Rate */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>อัตราเงินเฉลี่ยคืนคาดการณ์ (%)</label>
              <strong style={{ color: 'var(--accent-teal-dark)' }}>{refundRate}%</strong>
            </div>
            <input 
              type="number"
              step="0.1"
              className="form-control"
              value={refundRate}
              onChange={(e) => setRefundRate(Number(e.target.value))}
            />
          </div>

        </div>

        {/* Output Estimation Result Card */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.78rem',
                fontWeight: 600 
              }}>
                ประมาณการเงินที่จะได้รับสิ้นปี
              </span>
              <button 
                onClick={handleCelebrate}
                style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}
                title="เฉลิมฉลอง!"
              >
                <Sparkles size={20} />
              </button>
            </div>

            <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.88rem', color: '#a7f3d0' }}>ยอดรับสุทธิรวมทั้งสิ้น (ปันผล + เฉลี่ยคืน)</div>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fef08a', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
                {results.grandTotal.toLocaleString()} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#ffffff' }}>บาท</span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.85rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Coins size={18} style={{ color: '#fef08a' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>เงินปันผลตามหุ้น ({dividendRate}%)</div>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>จากหุ้นปลายปี {results.endYearShares.toLocaleString()} บ.</div>
                  </div>
                </div>
                <strong style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                  {results.totalDividend.toLocaleString()} ฿
                </strong>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.85rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} style={{ color: '#93c5fd' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>เงินเฉลี่ยคืนดอกเบี้ย ({refundRate}%)</div>
                    <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>จากดอกเบี้ยที่จ่าย {Number(loanInterestPaid).toLocaleString()} บ.</div>
                  </div>
                </div>
                <strong style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                  {results.totalRefund.toLocaleString()} ฿
                </strong>
              </div>

            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#d1fae5', lineHeight: 1.4 }}>
              * อัตราเงินปันผลและเงินเฉลี่ยคืนขึ้นอยู่กับมติที่ประชุมใหญ่สามัญประจำปีของสหกรณ์
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
