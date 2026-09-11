import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USER = {
  memberId: '04892',
  citizenId: '1-2101-00045-89-2',
  name: 'นายเกียรติศักดิ์ พูลเพิ่ม',
  position: 'พยาบาลวิชาชีพชำนาญการ',
  department: 'โรงพยาบาลระยอง',
  memberSince: '15 พ.ค. 2554 (13 ปี 8 เดือน)',
  monthlyShare: 3000,
  shares: 485000,
  savings: 245300.50,
  loanBalance: 820000.00,
  dividendEstimated: 25462.50,
  loanRefundEstimated: 5125.00,
  accounts: [
    { accNo: '101-2-04892-1', type: 'ออมทรัพย์สุขใจ', balance: 45300.50, status: 'ปกติ' },
    { accNo: '201-4-04892-8', type: 'ออมทรัพย์พิเศษพลัส', balance: 200000.00, status: 'ปกติ' },
  ],
  loans: [
    { contractNo: 'ส.66/0129', type: 'เงินกู้สามัญ', principal: 1000000, balance: 820000, monthlyPay: 12500, termRemaining: '96 งวด' },
  ],
  recentReceipts: [
    { receiptNo: 'RC-67020084', period: 'กุมภาพันธ์ 2567', date: '28 ก.พ. 2567', totalAmount: 15500, status: 'ชำระแล้ว' },
    { receiptNo: 'RC-67010079', period: 'มกราคม 2567', date: '31 ม.ค. 2567', totalAmount: 15500, status: 'ชำระแล้ว' },
    { receiptNo: 'RC-66120092', period: 'ธันวาคม 2566', date: '29 ธ.ค. 2566', totalAmount: 15500, status: 'ชำระแล้ว' },
  ]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('coop_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('coop_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('coop_auth_user');
    }
  }, [user]);

  const login = (memberId, password) => {
    // Demo login simulation
    const loggedUser = {
      ...DEMO_USER,
      memberId: memberId || DEMO_USER.memberId
    };
    setUser(loggedUser);
    setShowAuthModal(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      showAuthModal,
      setShowAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
