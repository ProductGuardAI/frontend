'use client';

import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';

export type Language = 'vi' | 'en';

const vi: Record<string, string> = {
  'Dashboard': 'Bảng điều khiển',
  'Products': 'Sản phẩm',
  'New submission': 'Tạo hồ sơ mới',
  'Tasks': 'Công việc',
  'Reports': 'Báo cáo',
  'Demo mode': 'Chế độ demo',
  'Settings': 'Cài đặt',
  'Welcome to ProductGuard AI': 'Chào mừng đến với ProductGuard AI',
  'Category Manager': 'Quản lý ngành hàng',
  'AI-Powered Compliance': 'Tuân thủ được hỗ trợ bởi AI',
  'Commercial Reviewer': 'Người duyệt thương mại',
  'Ecommerce Reviewer': 'Người duyệt sàn TMĐT',
  'Compliance Reviewer': 'Chuyên viên tuân thủ',
  'Administrator': 'Quản trị viên',
  'Log out': 'Đăng xuất',
  'Total products': 'Tổng số sản phẩm',
  'Awaiting AI': 'Chờ AI xử lý',
  'Awaiting approval': 'Chờ phê duyệt',
  'Compliance review': 'Cần xem xét tuân thủ',
  'Approved': 'Đã phê duyệt',
  'vs last week': 'so với tuần trước',
  'Product Submissions': 'Hồ sơ sản phẩm',
  'Create new submission': 'Tạo hồ sơ mới',
  'Search product, brand, supplier…': 'Tìm sản phẩm, thương hiệu, nhà cung cấp…',
  'Status': 'Trạng thái',
  'Category': 'Danh mục',
  'Risk level': 'Mức rủi ro',
  'All': 'Tất cả',
  'Filters': 'Bộ lọc',
  'Product': 'Sản phẩm',
  'Brand': 'Thương hiệu',
  'Supplier': 'Nhà cung cấp',
  'Completion': 'Độ hoàn thiện',
  'Risk': 'Rủi ro',
  'Last updated': 'Cập nhật lần cuối',
  'Action': 'Thao tác',
  'Low': 'Thấp',
  'Medium': 'Trung bình',
  'High': 'Cao',
  'View all products': 'Xem tất cả sản phẩm',
  'Recent activity': 'Hoạt động gần đây',
  'Latest automated and reviewer events': 'Các sự kiện AI và người duyệt mới nhất',
  'Ready For Approval': 'Sẵn sàng phê duyệt',
  'Supplier Clarification Required': 'Cần nhà cung cấp bổ sung',
  'Compliance Review Required': 'Cần xem xét tuân thủ',
  'LIVE GUIDED DEMONSTRATION': 'TRÌNH DIỄN TƯƠNG TÁC TRỰC TIẾP',
  'See ProductGuard AI find, explain, and route product risks': 'Xem ProductGuard AI phát hiện, giải thích và phân luồng rủi ro sản phẩm',
  'Reset all scenarios': 'Đặt lại tất cả tình huống',
  'Open a scenario': 'Mở một tình huống',
  'Watch AI investigate': 'Xem AI kiểm tra',
  'Review the fix': 'Xem giải pháp',
  'Make the decision': 'Đưa ra quyết định',
  'Human approval stays mandatory': 'Luôn cần con người phê duyệt',
  'Open approval workspace': 'Mở không gian phê duyệt',
  'Decision support only': 'Chỉ hỗ trợ quyết định',
  'Human review required': 'Cần người đánh giá',
  'of': 'trong',
  'products': 'sản phẩm',
  'Clear': 'Xóa lọc',
  'Clear filters': 'Xóa bộ lọc',
  'No products match your filters': 'Không có sản phẩm phù hợp bộ lọc',
  'No products yet': 'Chưa có sản phẩm nào',
  'No recent activity': 'Chưa có hoạt động gần đây',
};

type I18n = { language: Language; setLanguage: (v: Language) => void; t: (value: string) => string };

const Context = createContext<I18n>({ language: 'vi', setLanguage: () => undefined, t: (v) => v });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('productguard-language') as Language;
    if (saved === 'vi' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (v: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('productguard-language', v);
    }
    setLanguageState(v);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (text: string) => (language === 'vi' ? (vi[text] ?? text) : text),
    }),
    [language]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useLanguage = () => useContext(Context);
