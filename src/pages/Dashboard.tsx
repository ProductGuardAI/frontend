import {Activity,ArrowRight,CheckCircle2,Clock3,Eye,FileCheck2,MoreHorizontal,Plus,Search,ShieldAlert,SlidersHorizontal,TrendingUp} from "lucide-react";
import {Link} from "react-router-dom";
import {api} from "../api";
import {Badge,ErrorBox,human,Spinner} from "../components";
import {useLoad} from "../hooks";
import type {DashboardData,Product} from "../types";

const risk=(score:number)=>score>=60?{label:"High",tone:"high"}:score>=25?{label:"Medium",tone:"medium"}:{label:"Low",tone:"low"};
export function Dashboard(){
 const d=useLoad(()=>Promise.all([api<DashboardData>("/dashboard"),api<Product[]>("/products")]));
 if(d.loading)return <Spinner/>;if(d.error||!d.data)return <ErrorBox message={d.error} retry={d.reload}/>;
 const[m,products]=d.data;
 const stats=[
  [FileCheck2,"Total products",m.total,"+12 vs last week","orange"],
  [Clock3,"Awaiting AI",m.awaitingAi,"+4 vs last week","orange"],
  [Eye,"Awaiting approval",m.ready,"+6 vs last week","amber"],
  [ShieldAlert,"Compliance review",m.complianceReview,"+2 vs last week","red"],
  [CheckCircle2,"Approved",products.filter(p=>p.status==='approved'||p.status==='ready_for_approval').length,"+10 vs last week","green"],
 ] as const;
 return <div className="dashboard-page">
  <section className="stats dashboard-stats">{stats.map(([Icon,label,value,trend,tone])=><article className="stat dashboard-stat" key={label}><span className={`stat-icon ${tone}`}><Icon/></span><div><small>{label}</small><strong>{value}</strong><em><TrendingUp/> {trend}</em></div></article>)}</section>
  <section className="card submissions-card">
   <div className="submissions-title"><h2>Product Submissions</h2><Link className="button" to="/products/new"><Plus/>Create new submission</Link></div>
   <div className="dashboard-filters">
    <label className="search"><Search/><input placeholder="Search product, brand, supplier…"/></label>
    <label><small>Status</small><select><option>All</option></select></label>
    <label><small>Category</small><select><option>All</option></select></label>
    <label><small>Risk level</small><select><option>All</option></select></label>
    <Link className="button secondary filter-button" to="/products"><SlidersHorizontal/>Filters</Link>
   </div>
   <div className="table-wrap dashboard-table"><table><thead><tr><th>Product</th><th>Brand</th><th>Supplier</th><th>Category</th><th>Status</th><th>Completion</th><th>Risk</th><th>Last updated</th><th>Action</th></tr></thead><tbody>{products.map(p=>{const r=risk(p.riskScore);return <tr key={p.id}>
    <td><Link className="product-link" to={`/products/${p.id}`}><span>{p.name.slice(0,2).toUpperCase()}</span><div><strong>{p.name}</strong><small>SKU: {p.id.toUpperCase()}</small></div></Link></td>
    <td>{p.brand}</td><td>{p.supplier?.name}</td><td>{p.category}</td><td><Badge>{human(p.status)}</Badge></td>
    <td><div className={`completion-ring ${p.completenessScore<60?'critical':''}`} style={{"--completion":`${p.completenessScore*3.6}deg`} as React.CSSProperties}><b>{p.completenessScore}%</b></div></td>
    <td><span className={`risk-label ${r.tone}`}><i/>{r.label}</span></td><td>{new Date(p.updatedAt).toLocaleDateString()}</td>
    <td><Link className="more-action" to={`/products/${p.id}`} aria-label={`Open ${p.name}`}><MoreHorizontal/></Link></td>
   </tr>})}</tbody></table></div>
   <Link className="view-all" to="/products">View all products <ArrowRight/></Link>
  </section>
  <section className="card compact-activity"><div className="card-head"><div><h2>Recent activity</h2><p>Latest automated and reviewer events</p></div><Activity/></div><div>{m.recentActivity.slice(0,3).map((a:any)=><span key={a.id}><i/><strong>{human(a.action)}</strong><small>{a.notes}</small></span>)}</div></section>
  <footer className="app-footer"><span>© 2026 Guardian Vietnam. All rights reserved.</span><span>ProductGuard AI v1.0</span></footer>
 </div>
}
