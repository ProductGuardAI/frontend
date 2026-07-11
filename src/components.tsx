import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  PlusCircle,
  Settings,
  ShieldCheck,
  FlaskConical,
  Menu,
  X,
  RefreshCw,
  Bell,
  ChevronDown,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import {useLanguage} from "./i18n";
export const human = (s: string) =>
  s.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span
      className={`badge ${tone ?? String(children).toLowerCase().replaceAll(" ", "_")}`}
    >
      {children}
    </span>
  );
}
export function Score({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="score">
      <div
        className="score-ring"
        style={
          {
            "--score": `${value * 3.6}deg`,
            "--tone": `var(--${tone})`,
          } as React.CSSProperties
        }
      >
        <strong>{value}</strong>
      </div>
      <span>{label}</span>
    </div>
  );
}
export function Empty({ text }: { text: string }) {
  return (
    <div className="empty">
      <PackageSearch size={34} />
      <p>{text}</p>
    </div>
  );
}
export function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}
export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const {language,setLanguage,t}=useLanguage();
  return (
    <div className="app">
      <aside className={open ? "open" : ""}>
        <Link to="/dashboard" className="brand">
          <div className="brand-logo">
            <strong>guardian</strong>
            <small>healthy beauty</small>
          </div>
          <div className={`language-toggle ${language}`} role="group" aria-label={language==='vi'?'Chọn ngôn ngữ':'Select language'}>
            <span aria-hidden="true"/>
            <button type="button" title="Tiếng Việt" aria-label="Tiếng Việt" aria-pressed={language==='vi'} onClick={()=>setLanguage('vi')}>VI</button>
            <button type="button" title="English" aria-label="English" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button>
          </div>
        </Link>
        <nav>
          {[
            [LayoutDashboard, "Dashboard", "/dashboard", ""],
            [PackageSearch, "Products", "/products", ""],
            [PlusCircle, "New submission", "/products/new", ""],
            [ClipboardList, "Tasks", "/products?view=tasks", "tasks"],
            [BarChart3, "Reports", "/dashboard?view=reports", "reports"],
            [FlaskConical, "Demo mode", "/demo", ""],
            [Settings, "Settings", "/settings", ""],
          ].map(([I, l, p, view]: any) => (
            <NavLink key={p} to={p} className={({isActive})=>isActive&&((view&&new URLSearchParams(loc.search).get("view")===view)||(!view&&!loc.search))?"active":""} onClick={() => setOpen(false)}>
              <I size={19} />
              {t(l)}
            </NavLink>
          ))}
        </nav>
        <div className="legal productguard-panel">
          <ShieldCheck size={25} />
          <p><strong>ProductGuard AI</strong><br /><small>{t('AI-Powered Compliance')}</small></p>
        </div>
      </aside>
      <header>
        <button className="icon mobile" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <div>
          {loc.pathname === "/dashboard" ? <div className="header-welcome"><small>{language==='vi'?'Xin chào,':'Hello,'}</small><strong>{t('Welcome to ProductGuard AI')}</strong></div> : <span className="crumb">Guardian / {t(human(loc.pathname.split("/").filter(Boolean).at(-1) ?? "Dashboard"))}</span>}
        </div>
        <div className="header-actions">
          <span className="notification"><Bell/><b>3</b></span>
          <div className="reviewer"><span>NT</span>
          <div>
            Nguyen Tran<small>{t('Category Manager')}</small>
          </div>
          <ChevronDown size={16}/>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="error">
      <p>{message}</p>
      {retry && (
        <button className="button secondary" onClick={retry}>
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
