import {Activity,ArrowRight,CheckCircle2,Clock3,Eye,FileCheck2,MoreHorizontal,Plus,Search,ShieldAlert,SlidersHorizontal,TrendingUp} from "lucide-react";
import {Link} from "react-router-dom";
import {api} from "../api";
import {Badge,ErrorBox,human,Spinner} from "../components";
import {useLoad} from "../hooks";
import type {DashboardData,Product} from "../types";
import {useLanguage} from "../i18n";

const risk=(score:number)=>score>=60?{label:"High",tone:"high"}:score>=25?{label:"Medium",tone:"medium"}:{label:"Low",tone:"low"};
export function Dashboard(){
 const{t,language}=useLanguage();
 const d=useLoad(()=>Promise.all([api<DashboardData>("/dashboard"),api<Product[]>("/products")]));
 if(d.loading)return <Spinner/>;if(d.error||!d.data)return <ErrorBox message={d.error} retry={d.reload}/>;
 const[m,products]=d.data;
 const stats=[
  [FileCheck2,"Total products",m.total,"+12","orange"],
  [Clock3,"Awaiting AI",m.awaitingAi,"+4","orange"],
  [Eye,"Awaiting approval",m.ready,"+6","amber"],
  [ShieldAlert,"Compliance review",m.complianceReview,"+2","red"],
  [CheckCircle2,"Approved",products.filter(p=>p.status==='approved'||p.status==='ready_for_approval').length,"+10","green"],
 ] as const;
 return <div className="dashboard-page">
  <section className="stats dashboard-stats">{stats.map(([Icon,label,value,trend,tone])=><article className="stat dashboard-stat" key={label}><span className={`stat-icon ${tone}`}><Icon/></span><div><small>{t(label)}</small><strong>{value}</strong><em><TrendingUp/> {trend} {t('vs last week')}</em></div></article>)}</section>
  <section className="card submissions-card">
   <div className="submissions-title"><h2>{t('Product Submissions')}</h2><Link className="button" to="/products/new"><Plus/>{t('Create new submission')}</Link></div>
   <div className="dashboard-filters">
    <label className="search"><Search/><input placeholder={t('Search product, brand, supplier…')}/></label>
    <label><small>{t('Status')}</small><select><option>{t('All')}</option></select></label>
    <label><small>{t('Category')}</small><select><option>{t('All')}</option></select></label>
    <label><small>{t('Risk level')}</small><select><option>{t('All')}</option></select></label>
    <Link className="button secondary filter-button" to="/products"><SlidersHorizontal/>{t('Filters')}</Link>
   </div>
   <div className="table-wrap dashboard-table"><table><thead><tr><th>{t('Product')}</th><th>{t('Brand')}</th><th>{t('Supplier')}</th><th>{t('Category')}</th><th>{t('Status')}</th><th>{t('Completion')}</th><th>{t('Risk')}</th><th>{t('Last updated')}</th><th>{t('Action')}</th></tr></thead><tbody>{products.map(p=>{const r=risk(p.riskScore);return <tr key={p.id}>
    <td><Link className="product-link" to={`/products/${p.id}`}><span>{p.name.slice(0,2).toUpperCase()}</span><div><strong>{p.name}</strong><small>SKU: {p.id.toUpperCase()}</small></div></Link></td>
    <td>{p.brand}</td><td>{p.supplier?.name}</td><td>{p.category}</td><td><Badge>{t(human(p.status))}</Badge></td>
    <td><div className={`completion-ring ${p.completenessScore<60?'critical':''}`} style={{"--completion":`${p.completenessScore*3.6}deg`} as React.CSSProperties}><b>{p.completenessScore}%</b></div></td>
    <td><span className={`risk-label ${r.tone}`}><i/>{t(r.label)}</span></td><td>{new Date(p.updatedAt).toLocaleDateString(language==='vi'?'vi-VN':'en-US')}</td>
    <td><Link className="more-action" to={`/products/${p.id}`} aria-label={`Open ${p.name}`}><MoreHorizontal/></Link></td>
   </tr>})}</tbody></table></div>
   <Link className="view-all" to="/products">{t('View all products')} <ArrowRight/></Link>
  </section>
  <section className="card compact-activity"><div className="card-head"><div><h2>{t('Recent activity')}</h2><p>{t('Latest automated and reviewer events')}</p></div><Activity/></div><div>{m.recentActivity.slice(0,3).map((a:any)=><span key={a.id}><i/><strong>{t(human(a.action))}</strong><small>{a.notes}</small></span>)}</div></section>
  <footer className="app-footer"><span>{language==='vi'?'© 2026 Guardian Việt Nam. Đã đăng ký bản quyền.':'© 2026 Guardian Vietnam. All rights reserved.'}</span><span>ProductGuard AI v1.0</span></footer>
 </div>
}
