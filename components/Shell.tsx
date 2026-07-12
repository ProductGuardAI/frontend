'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  PlusCircle,
  Settings,
  Menu,
  X,
  Bell,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "./i18n";
import { human, ProductGuardMark } from "./shared";

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { language, setLanguage, t } = useLanguage();

  const [user, setUser] = useState<{ fullName?: string; role?: string } | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson && userJson !== 'undefined') {
      try {
        setUser(JSON.parse(userJson));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const fullName = user?.fullName || 'Nhan Vien';
  const role = user?.role || 'commercial_reviewer';

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'NV';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navItems: Array<[any, string, string, string]> = [
    [LayoutDashboard, "Dashboard", "/dashboard", ""],
    [PackageSearch, "Products", "/products", ""],
    [PlusCircle, "New submission", "/products/new", ""],
    [ClipboardList, "Tasks", "/products", "tasks"],
    [BarChart3, "Reports", "/dashboard", "reports"],
    [Settings, "Settings", "/settings", ""],
  ];

  return (
    <div className="app">
      <aside className={open ? "open" : ""}>
        <Link href="/dashboard" className="brand">
          <div className="brand-logo">
            <strong>guardian</strong>
            <small>healthy beauty</small>
          </div>
          <div className={`language-toggle ${language}`} role="group" aria-label={language === 'vi' ? 'Chọn ngôn ngữ' : 'Select language'}>
            <span aria-hidden="true"/>
            <button type="button" title="Tiếng Việt" aria-label="Tiếng Việt" aria-pressed={language === 'vi'} onClick={() => setLanguage('vi')}>VI</button>
            <button type="button" title="English" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
          </div>
        </Link>
        <nav>
          {navItems.map(([Icon, label, path, view]) => {
            const currentView = searchParams.get("view");
            const isActive = pathname === path && (view ? currentView === view : !currentView);
            const href = view ? `${path}?view=${view}` : path;
            
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                <Icon size={19} />
                {t(label)}
              </Link>
            );
          })}
        </nav>
        <ProductGuardMark tone="inverse" compact />
      </aside>
      <header>
        <button className="icon mobile" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <div>
          {pathname === "/dashboard" ? (
            <div className="header-welcome">
              <small>{language === 'vi' ? 'Xin chào,' : 'Hello,'}</small>
              <strong>{t('Welcome to ProductGuard AI')}</strong>
            </div>
          ) : (
            <span className="crumb">Guardian / {t(human(pathname.split("/").filter(Boolean).at(-1) ?? "Dashboard"))}</span>
          )}
        </div>
        <div className="header-actions">
          <span className="notification"><Bell/><b>3</b></span>
          <div className="reviewer" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{initials}</span>
            <div>
              {fullName}
              <small>{t(human(role))}</small>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#f87171';
              }}
            >
              {t('Log out')}
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
