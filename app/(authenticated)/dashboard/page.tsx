'use client';

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  Plus,
  Search,
  ShieldAlert,
  PackageSearch,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/components/api";
import { Badge, ErrorBox, Spinner, human } from "@/components/shared";
import { useLoad } from "@/components/hooks";
import type { DashboardData, Product } from "@/components/types";
import { useLanguage } from "@/components/i18n";
import React, { useState } from "react";

const risk = (score: number) =>
  score >= 60
    ? { label: "High", tone: "high" }
    : score >= 25
      ? { label: "Medium", tone: "medium" }
      : { label: "Low", tone: "low" };

export default function Dashboard() {
  const { t, language } = useLanguage();
  const d = useLoad(() =>
    Promise.all([api<DashboardData>("/dashboard"), api<Product[]>("/products")])
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  if (d.loading) return <Spinner />;
  if (d.error || !d.data) return <ErrorBox message={d.error} retry={d.reload} />;

  const [m, products] = d.data;
  const approvedCount = products.filter((p) => p.status === 'approved' || p.status === 'ready_for_approval').length;

  const stats = [
    { Icon: FileCheck2, label: "Total products", value: m.total, tone: "orange" },
    { Icon: Clock3, label: "Awaiting AI", value: m.awaitingAi, tone: "orange" },
    { Icon: Eye, label: "Awaiting approval", value: m.ready, tone: "amber" },
    { Icon: ShieldAlert, label: "Compliance review", value: m.complianceReview, tone: "red" },
    { Icon: CheckCircle2, label: "Approved", value: approvedCount, tone: "green" },
  ];

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const statuses = [...new Set(products.map((p) => p.status))];
  const riskLevel = (score: number) => score >= 60 ? 'high' : score >= 25 ? 'medium' : 'low';

  const filtered = products.filter((p) => {
    const matchesSearch = !search || `${p.name} ${p.brand} ${p.supplier?.name ?? ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesRisk = !riskFilter || riskLevel(p.riskScore) === riskFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesRisk;
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setRiskFilter("");
  };

  const hasFilters = search || statusFilter || categoryFilter || riskFilter;

  return (
    <div className="dashboard-page">
      {/* Stats */}
      <section className="stats dashboard-stats">
        {stats.map(({ Icon, label, value, tone }) => (
          <article className="stat dashboard-stat" key={label}>
            <span className={`stat-icon ${tone}`}>
              <Icon />
            </span>
            <div>
              <small>{t(label)}</small>
              <strong>{value}</strong>
              {value > 0 && (
                <em>
                  <TrendingUp size={11} /> {t('vs last week')}
                </em>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* Submissions Table */}
      <section className="card submissions-card">
        <div className="submissions-title">
          <div>
            <h2>{t('Product Submissions')}</h2>
            <p>{filtered.length} {t('of')} {products.length} {t('products')}</p>
          </div>
          <Link className="button" href="/products/new">
            <Plus size={16} />
            {t('Create new submission')}
          </Link>
        </div>

        <div className="dashboard-filters">
          <label className="search">
            <Search />
            <input placeholder={t('Search product, brand, supplier…')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <label>
            <small>{t('Status')}</small>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t('All')}</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{t(human(s))}</option>
              ))}
            </select>
          </label>
          <label>
            <small>{t('Category')}</small>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">{t('All')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            <small>{t('Risk level')}</small>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="">{t('All')}</option>
              <option value="low">{t('Low')}</option>
              <option value="medium">{t('Medium')}</option>
              <option value="high">{t('High')}</option>
            </select>
          </label>
          {hasFilters && (
            <button className="button ghost clear-filters" onClick={clearFilters}>
              {t('Clear')}
            </button>
          )}
        </div>

        <div className="table-wrap dashboard-table">
          {filtered.length === 0 ? (
            <div className="dashboard-empty">
              <PackageSearch size={40} />
              <p>{hasFilters ? t('No products match your filters') : t('No products yet')}</p>
              {hasFilters && (
                <button className="button secondary" onClick={clearFilters}>
                  {t('Clear filters')}
                </button>
              )}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t('Product')}</th>
                  <th>{t('Supplier')}</th>
                  <th>{t('Category')}</th>
                  <th>{t('Status')}</th>
                  <th className="col-center">{t('Completion')}</th>
                  <th className="col-center">{t('Risk')}</th>
                  <th className="col-right">{t('Last updated')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const r = risk(p.riskScore);
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link className="product-link" href={`/products/${p.id}`}>
                          <span>{p.name.slice(0, 2).toUpperCase()}</span>
                          <div>
                            <strong>{p.name}</strong>
                            <small>{p.brand}</small>
                          </div>
                        </Link>
                      </td>
                      <td>{p.supplier?.name ?? "—"}</td>
                      <td>{p.category}</td>
                      <td>
                        <Badge>{t(human(p.status))}</Badge>
                      </td>
                      <td className="col-center">
                        <div
                          className={`completion-ring ${p.completenessScore < 60 ? 'critical' : ''}`}
                          style={{ "--completion": `${p.completenessScore * 3.6}deg` } as React.CSSProperties}
                        >
                          <b>{p.completenessScore}%</b>
                        </div>
                      </td>
                      <td className="col-center">
                        <span className={`risk-label ${r.tone}`}>
                          <i />
                          {t(r.label)}
                        </span>
                      </td>
                      <td className="col-right">
                        <small className="date-cell">
                          {new Date(p.updatedAt).toLocaleDateString(
                            language === 'vi' ? 'vi-VN' : 'en-US',
                            { day: '2-digit', month: 'short' }
                          )}
                        </small>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {filtered.length > 0 && (
          <Link className="view-all" href="/products">
            {t('View all products')} <ArrowRight size={16} />
          </Link>
        )}
      </section>

      {/* Recent Activity */}
      <section className="card compact-activity">
        <div className="card-head">
          <div>
            <h2>{t('Recent activity')}</h2>
            <p>{t('Latest automated and reviewer events')}</p>
          </div>
          <Activity size={20} />
        </div>
        <div>
          {m.recentActivity.length > 0 ? (
            m.recentActivity.slice(0, 6).map((a: any) => (
              <span key={a.id}>
                <i />
                <strong>{t(human(a.action))}</strong>
                <small>{a.notes}</small>
              </span>
            ))
          ) : (
            <span className="activity-empty">
              <small>{t('No recent activity')}</small>
            </span>
          )}
        </div>
      </section>

      <footer className="app-footer">
        <span>
          {language === 'vi'
            ? '© 2026 Guardian Việt Nam. Đã đăng ký bản quyền.'
            : '© 2026 Guardian Vietnam. All rights reserved.'}
        </span>
        <span>ProductGuard AI v1.0</span>
      </footer>
    </div>
  );
}