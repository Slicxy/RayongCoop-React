import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  super_admin: {
    username: 'admin',
    password: 'Admin@RayongCoop2026!',
    name: 'นายธีระพงษ์ ผู้ดูแลระบบสูงสุด',
    role: 'super_admin',
    roleName: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
    roleBadge: 'Super Admin',
    badgeColor: 'rose',
    department: 'ศูนย์เทคโนโลยีสารสนเทศและระบบกลาง',
    position: 'Chief Information Officer (CIO)',
    phone: '081-999-0001',
    avatar: '',
    permissions: ['all_access', 'user_management', 'system_config', 'audit_logs', 'financial_control', 'reports'],
    adminStats: {
      totalUsers: 4850,
      activeLoans: 1420,
      pendingApprovals: 8,
      systemHealth: '100% ปกติ'
    }
  },
  staff: {
    username: 'staff1',
    password: 'staff123',
    name: 'นางสาวกานดา ใจดี',
    role: 'staff',
    roleName: 'เจ้าหน้าที่สินเชื่อและการเงิน (Loan & Finance Officer)',
    roleBadge: 'เจ้าหน้าที่สินเชื่อ/การเงิน',
    badgeColor: 'primary',
    department: 'ฝ่ายสินเชื่อและการเงิน สหกรณ์ฯ',
    position: 'เจ้าหน้าที่ปฏิบัติการระดับชำนาญการ',
    phone: '089-888-0002',
    avatar: '',
    permissions: ['member_view', 'member_edit', 'loan_process', 'deposit_process', 'documents_manage'],
    staffQueue: [
      { id: 'LN-6703-01', memberName: 'นายประสิทธิ์ พูลสวัสดิ์', type: 'กู้ฉุกเฉิน', amount: '50,000 บาท', status: 'รออนุมัติโอนเงิน' },
      { id: 'LN-6703-02', memberName: 'นางสาววิมลรัตน์ จันทร์เพ็ญ', type: 'กู้สามัญ', amount: '400,000 บาท', status: 'รอตรวจเอกสารผู้ค้ำ' },
      { id: 'REQ-6703-09', memberName: 'นายเอกชัย บุญรอด', type: 'ขอปรับค่าหุ้น', amount: '4,000 บ./ด.', status: 'รอดำเนินการ' }
    ]
  },
  auditor: {
    username: 'rayongcoop1',
    password: 'coop1',
    name: 'นายวรวุฒิ สมบูรณ์ทรัพย์',
    role: 'auditor',
    roleName: 'ผู้ตรวจสอบกิจการ / ฝ่ายจัดการ (Auditor & Manager)',
    roleBadge: 'ผู้ตรวจสอบกิจการ',
    badgeColor: 'gold',
    department: 'คณะกรรมการฝ่ายตรวจสอบกิจการ สหกรณ์ฯ',
    position: 'หัวหน้าผู้ตรวจสอบกิจการประจำปี 2567',
    phone: '086-777-0003',
    avatar: '',
    permissions: ['financial_audit', 'logs_view', 'reports_export', 'dividend_verify', 'read_only_access'],
    auditSummary: {
      lastAuditDate: '10 มี.ค. 2567',
      unreconciledItems: 0,
      complianceScore: '99.8%',
      totalAssetAudited: '3,210.80 ล้านบาท'
    }
  },
  member: {
    username: '04892',
    memberId: '04892',
    password: '123456',
    citizenId: '1-2101-00045-89-2',
    name: 'นายสมชาย มีสุข',
    role: 'member',
    roleName: 'สมาชิกสหกรณ์ (Cooperative Member)',
    roleBadge: 'สมาชิกสหกรณ์',
    badgeColor: 'emerald',
    department: 'กลุ่มงานการพยาบาล โรงพยาบาลระยอง',
    position: 'พยาบาลวิชาชีพชำนาญการ',
    phone: '081-234-5678',
    avatar: '',
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
  }
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

  const login = (usernameOrId, password) => {
    const input = (usernameOrId || '').trim();
    
    // Check against the 4 distinct demo profiles
    let matchedProfile = null;
    if (input === 'admin' || input === 'admin@rayongcoop.com') {
      matchedProfile = DEMO_USERS.super_admin;
    } else if (input === 'staff1' || input === 'staff1@rayongcoop.com') {
      matchedProfile = DEMO_USERS.staff;
    } else if (input === 'rayongcoop1' || input === 'rayongcoop1@rayongcoop.com') {
      matchedProfile = DEMO_USERS.auditor;
    } else {
      matchedProfile = {
        ...DEMO_USERS.member,
        username: input || '04892',
        memberId: input || '04892'
      };
    }

    setUser(matchedProfile);
    setShowAuthModal(false);
    return true;
  };

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setUser(DEMO_USERS[roleKey]);
    }
  };

  const updateProfile = ({ avatar, phone }) => {
    if (!user) return false;
    const updated = {
      ...user,
      avatar: avatar !== undefined ? avatar : (user.avatar || ''),
      phone: phone !== undefined ? phone : (user.phone || '')
    };
    setUser(updated);
    try {
      localStorage.setItem('coop_auth_user', JSON.stringify(updated));
    } catch (e) {}
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
      switchRole,
      updateProfile,
      showAuthModal,
      setShowAuthModal,
      demoUsers: DEMO_USERS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
