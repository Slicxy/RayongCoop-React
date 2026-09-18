import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('coop_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('coop_auth_user', JSON.stringify(user));
      } catch (e) {}
    } else {
      localStorage.removeItem('coop_auth_user');
    }
  }, [user]);

  /**
   * Real Authentication Login connecting to PHP Backend /login API
   */
  const login = async (usernameOrId, password) => {
    const inputUsername = (usernameOrId || '').trim();
    const inputPassword = (password || '').trim();

    if (!inputUsername || !inputPassword) {
      return {
        success: false,
        message: 'กรุณากรอกชื่อผู้ใช้ / รหัสสมาชิก และรหัสผ่าน'
      };
    }

    try {
      const formData = new FormData();
      formData.append('username', inputUsername);
      formData.append('password', inputPassword);
      formData.append('ajax', '1');

      const response = await fetch('/login', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const roleSlug = data.user.role || data.user.role_slug || 'member';
          const authUser = {
            id: data.user.id,
            username: data.user.username || inputUsername,
            name: data.user.name || inputUsername,
            role: roleSlug,
            roleName: data.user.role_name || (roleSlug === 'super_admin' ? 'ผู้ดูแลระบบสูงสุด' : roleSlug === 'staff' ? 'เจ้าหน้าที่สินเชื่อ/การเงิน' : roleSlug === 'auditor' ? 'ผู้ตรวจสอบกิจการ' : 'สมาชิกสหกรณ์'),
            roleBadge: data.user.role_badge || (roleSlug === 'super_admin' ? 'Super Admin' : roleSlug === 'staff' ? 'เจ้าหน้าที่สหกรณ์' : roleSlug === 'auditor' ? 'ผู้ตรวจสอบกิจการ' : 'สมาชิกสหกรณ์'),
            department: data.user.department || data.user.org_name || 'สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด',
            position: data.user.position || '',
            phone: data.user.phone || '',
            avatar: data.user.avatar || '',
            memberId: data.user.member_no || data.user.memberId || inputUsername,
            shares: data.user.shares_amount || data.user.shares || 0,
            monthlyShare: data.user.monthly_share || 0,
            savings: data.user.savings_balance || data.user.savings || 0,
            loanBalance: data.user.loan_balance || 0,
            dividendEstimated: data.user.dividend_estimated || 0,
            loanRefundEstimated: data.user.loan_refund_estimated || 0,
            accounts: data.user.accounts || [],
            loans: data.user.loans || [],
            recentReceipts: data.user.recent_receipts || []
          };

          setUser(authUser);
          setShowAuthModal(false);
          return {
            success: true,
            redirect: data.redirect || (roleSlug === 'super_admin' ? '/admin/dashboard' : '/member/dashboard'),
            user: authUser
          };
        } else {
          return {
            success: false,
            message: data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
          };
        }
      } else {
        return {
          success: false,
          message: `ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้ (HTTP ${response.status}) กรุณาลองใหม่อีกครั้ง`
        };
      }
    } catch (err) {
      // If running Vite standalone or API unreachable
      console.warn('Authentication server connection error:', err);
      return {
        success: false,
        message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ระบบสหกรณ์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือบริการ backend'
      };
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

  const logout = async () => {
    try {
      fetch('/logout', { method: 'POST' }).catch(() => {});
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('coop_auth_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      updateProfile,
      showAuthModal,
      setShowAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
