"use client";

import React, { useState, useEffect } from 'react';
import {
  Gavel, RefreshCw, ArrowLeft, CheckCircle2,
  Send, Gauge,
} from 'lucide-react';

/* ═════════════════════════════════════════════════════════════
   TYPES & MOCK DATA
   ═════════════════════════════════════════════════════════════ */
export type SupplierStage = 'invite' | 'declined' | 'pqq' | 'evaluating' | 'ineligible' | 'bidding' | 'submission';

interface PortalLineItem {
  id: string;
  description: string;
  qty: number;
  startPrice: number;
  currentLowest: number;
  yourLastBid: number;
}

const PORTAL_LINE_ITEMS: PortalLineItem[] = [
  { id: 'LI1', description: 'Lenovo ThinkPad E15 Laptop', qty: 50, startPrice: 4800, currentLowest: 4250, yourLastBid: 4250 },
  { id: 'LI2', description: 'Dell 27" QHD Monitor',        qty: 50, startPrice: 1600, currentLowest: 1420, yourLastBid: 1420 },
  { id: 'LI3', description: 'Lenovo Docking Station',      qty: 50, startPrice: 900,  currentLowest: 790,  yourLastBid: 790 },
];

const fmtSAR = (v: number) => 'SAR ' + Math.round(v).toLocaleString('en-US');

function fmtCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

interface Props {
  onNavigate?: (view: string, data?: any) => void;
}

export default function VendorBidPortal({ onNavigate }: Props) {
  const [stage, setStage] = useState<SupplierStage>('invite');
  const [vatUploaded, setVatUploaded] = useState(true);
  const [leadTime, setLeadTime] = useState(7);
  const [saso, setSaso] = useState<'yes' | 'no'>('yes');
  const [support, setSupport] = useState<'yes' | 'no'>('yes');
  const [warranty, setWarranty] = useState('3-year on-site warranty on laptops and docking stations, 2-year on monitors.');
  const [reasons, setReasons] = useState<string[]>([]);

  // Submission view state
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(PORTAL_LINE_ITEMS.map(i => [i.id, String(i.yourLastBid - 70)]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(5027);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const setPrice = (id: string, v: string) => setPrices(p => ({ ...p, [id]: v }));
  const totalBid = PORTAL_LINE_ITEMS.reduce((s, i) => s + (parseFloat(prices[i.id]) || 0) * i.qty, 0);
  const lastTotal = PORTAL_LINE_ITEMS.reduce((s, i) => s + i.yourLastBid * i.qty, 0);
  const startTotal = PORTAL_LINE_ITEMS.reduce((s, i) => s + i.startPrice * i.qty, 0);
  const savingsPct = startTotal > 0 ? ((startTotal - totalBid) / startTotal) * 100 : 0;
  const allPriced = PORTAL_LINE_ITEMS.every(i => (parseFloat(prices[i.id]) || 0) > 0);

  const stepIdx: Record<SupplierStage, number> = {
    invite: 1,
    declined: 1,
    pqq: 2,
    evaluating: 3,
    ineligible: 3,
    bidding: 4,
    submission: 4,
  };
  const STAGE_LABELS = ['Invitation', 'Pre-Qualification', 'Eligibility', 'Bidding'];

  const statusBadge: Record<SupplierStage, { text: string; cls: string }> = {
    invite: { text: 'Invitation pending response', cls: '' },
    declined: { text: 'Declined', cls: '' },
    pqq: { text: 'Pre-qualification pending', cls: 'badge-pending' },
    evaluating: { text: 'Evaluating…', cls: 'badge-pending' },
    ineligible: { text: 'Not eligible', cls: 'badge-rejected' },
    bidding: { text: 'Eligible — bidding open', cls: 'badge-approved' },
    submission: { text: 'Bidding in progress', cls: 'badge-live' },
  };

  const acknowledge = (accept: boolean) => setStage(accept ? 'pqq' : 'declined');

  const evaluateEligibility = () => {
    const found: string[] = [];
    if (!vatUploaded) found.push('VAT registration certificate was not uploaded (required).');
    if (!leadTime || leadTime > 15) found.push(`Lead time of ${leadTime || '—'} working days exceeds the buyer's 15-day requirement.`);
    if (saso !== 'yes') found.push('SASO standards & CE marking compliance was not confirmed (required).');
    if (support !== 'yes') found.push('On-site KSA support was not confirmed (required).');
    setReasons(found);
    setStage(found.length === 0 ? 'bidding' : 'ineligible');
  };

  const submitPQQ = () => {
    setStage('evaluating');
    setTimeout(evaluateEligibility, 800);
  };

  const submitBid = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const nav = (v: string, d?: any) => {
    if (onNavigate) onNavigate(v, d);
  };

  return (
    <div className="auction-module">
      <style>{`
        .auction-module {
          --vw-color-white: #ffffff;
          --vw-color-gray-50: #f9fafb; --vw-color-gray-100: #f3f4f6; --vw-color-gray-200: #e5e7eb;
          --vw-color-gray-300: #d1d5db; --vw-color-gray-400: #9ca3af; --vw-color-gray-500: #6b7280;
          --vw-color-gray-600: #4b5563; --vw-color-gray-700: #374151; --vw-color-gray-800: #1f2937; --vw-color-gray-900: #111827;

          --vw-color-slate-50: #f8fafc; --vw-color-slate-100: #f1f5f9; --vw-color-slate-200: #e2e8f0;
          --vw-color-slate-300: #cbd5e1; --vw-color-slate-400: #94a3b8; --vw-color-slate-500: #64748b;
          --vw-color-slate-600: #475569; --vw-color-slate-700: #334155; --vw-color-slate-800: #1e293b; --vw-color-slate-900: #0f172a;

          --vw-color-blue-50: #eff6ff; --vw-color-blue-100: #dbeafe; --vw-color-blue-500: #3b82f6; --vw-color-blue-600: #2563eb;
          --vw-color-green-50: #f0fdf4; --vw-color-green-100: #dcfce7; --vw-color-green-200: #bbf7d0; --vw-color-green-600: #16a34a; --vw-color-green-700: #15803d; --vw-color-green-800: #166534;
          --vw-color-amber-50: #fffbeb; --vw-color-amber-100: #fef3c7; --vw-color-amber-200: #fde68a; --vw-color-amber-600: #d97706; --vw-color-amber-700: #b45309; --vw-color-amber-800: #92400e;
          --vw-color-red-50: #fef2f2; --vw-color-red-100: #fee2e2; --vw-color-red-200: #fecaca; --vw-color-red-600: #dc2626; --vw-color-red-700: #b91c1c; --vw-color-red-800: #991b1b;

          --brand: var(--vw-color-gray-900);
          --brand-hover: var(--vw-color-gray-800);
          --ink: var(--vw-color-gray-900);
          --paper: var(--vw-color-gray-50);
          --faint: var(--vw-color-gray-100);
          --border: var(--vw-color-gray-200);
          --card: var(--vw-color-white);

          --text-primary: var(--vw-color-gray-900);
          --text-muted: var(--vw-color-gray-500);
          --text-light: var(--vw-color-gray-400);

          --r-xs: 4px; --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-pill: 999px;

          --red: var(--vw-color-red-600);
          --green: var(--vw-color-green-600);
          --amber: var(--vw-color-amber-600);
          --teal: var(--brand);

          font-family: inherit;
          background: var(--paper);
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.4;
          min-height: 100vh;
        }

        .auction-module * { box-sizing: border-box; }
        .auction-module .av-page { padding: 24px 20px; max-width: 1400px; margin: 0 auto; }
        .auction-module .av-page-narrow { padding: 24px 20px; max-width: 900px; margin: 0 auto; }

        .auction-module .supplier-view-banner {
          background: var(--vw-color-slate-900);
          border-radius: var(--r-lg);
          padding: 18px 22px;
          color: #fff;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .auction-module .sv-badge {
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.28);
          color: #fff;
          font-size: 11.5px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: var(--r-pill);
        }

        .auction-module .stepper {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 4px 0;
        }
        .auction-module .step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
        }
        .auction-module .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11.5px;
          font-weight: 600;
          flex-shrink: 0;
          background: #fff;
        }
        .auction-module .step.active .step-num {
          background: var(--brand);
          border-color: var(--brand);
          color: #fff;
        }
        .auction-module .step.active { color: var(--ink); }
        .auction-module .step.done .step-num {
          background: var(--brand);
          border-color: var(--brand);
          color: #fff;
        }
        .auction-module .step.done { color: var(--text-muted); }
        .auction-module .step-line {
          flex: 1;
          height: 1px;
          background: var(--border);
          margin: 0 8px;
          min-width: 16px;
        }
        .auction-module .step-line.done { background: var(--brand); }

        .auction-module .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .auction-module .card-hdr {
          padding: 14px 16px;
          border-bottom: 1px solid var(--faint);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .auction-module .card-hdr-title { font-size: 14px; font-weight: 600; color: var(--ink); }
        .auction-module .card-body { padding: 16px; }

        .auction-module .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 10px;
          border-radius: var(--r-pill);
          font-size: 12px;
          font-weight: 500;
          line-height: 18px;
        }
        .auction-module .badge-live { background: var(--vw-color-red-100); color: var(--vw-color-red-700); }
        .auction-module .badge-live::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--vw-color-red-600);
          display: inline-block;
          animation: av-pulse 1.2s infinite;
        }
        .auction-module .badge-approved { background: var(--vw-color-green-100); color: var(--vw-color-green-700); }
        .auction-module .badge-rejected { background: var(--vw-color-red-100); color: var(--vw-color-red-700); }
        .auction-module .badge-pending { background: var(--vw-color-amber-100); color: var(--vw-color-amber-800); }

        @keyframes av-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

        .auction-module .info-row { display: flex; gap: 28px; flex-wrap: wrap; }
        .auction-module .info-item { display: flex; flex-direction: column; gap: 3px; }
        .auction-module .info-item .ik {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: .4px;
        }
        .auction-module .info-item .iv { font-size: 13.5px; font-weight: 600; color: var(--ink); }

        .auction-module .q-item {
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 12px 14px;
          background: #fff;
        }
        .auction-module .q-text { font-size: 13px; font-weight: 500; color: var(--ink); }

        .auction-module .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: var(--r-sm);
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background-color .12s ease-out, border-color .12s ease-out, color .12s ease-out;
          font-family: inherit;
        }
        .auction-module .btn:disabled { opacity: .45; cursor: not-allowed; }
        .auction-module .btn-primary { background: var(--brand); color: #fff; padding: 8px 16px; font-size: 14px; border-radius: var(--r-md); }
        .auction-module .btn-primary:hover:not(:disabled) { background: var(--brand-hover); }
        .auction-module .btn-outline { background: #fff; color: var(--text-primary); border: 1px solid var(--border); padding: 7px 15px; font-size: 14px; border-radius: var(--r-md); }
        .auction-module .btn-outline:hover:not(:disabled) { border-color: var(--vw-color-gray-400); background: var(--vw-color-gray-50); }
        .auction-module .btn-ghost { background: transparent; color: var(--text-muted); border: none; padding: 6px 10px; font-size: 13px; }
        .auction-module .btn-ghost:hover { color: var(--text-primary); background: var(--vw-color-gray-100); }
        .auction-module .btn-sm { padding: 5px 10px; font-size: 12.5px; border-radius: var(--r-sm); }
        .auction-module .btn-lg { padding: 10px 22px; font-size: 14px; border-radius: var(--r-md); }

        .auction-module .ext-alert {
          background: var(--vw-color-amber-50);
          border: 1px solid var(--vw-color-amber-200);
          border-radius: var(--r-md);
          padding: 11px 14px;
          font-size: 12.5px;
          color: var(--vw-color-amber-800);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .auction-module .tbl-wrap { overflow-x: auto; }
        .auction-module table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .auction-module th {
          background: var(--vw-color-gray-50);
          padding: 10px 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }
        .auction-module td {
          padding: 11px 14px;
          border-bottom: 1px solid var(--faint);
          vertical-align: middle;
          color: var(--text-primary);
        }
        .auction-module tr:last-child td { border-bottom: none; }
        .auction-module tr:hover td { background: var(--vw-color-gray-50); }
        .auction-module .td-mono { font-variant-numeric: tabular-nums; font-size: 12.5px; }
        .auction-module .td-bold { font-weight: 500; color: var(--ink); }

        .auction-module input, .auction-module textarea {
          min-height: 34px;
          padding: 6px 10px;
          border: 1px solid var(--vw-color-gray-200);
          border-radius: var(--r-sm);
          font-size: 13px;
          font-family: inherit;
          color: var(--vw-color-gray-700);
          background: #fff;
          outline: none;
        }
        .auction-module input:focus, .auction-module textarea:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
        }
        .auction-module textarea { resize: vertical; min-height: 64px; width: 100%; }
      `}</style>

      {/* When in dedicated Submission sub-view */}
      {stage === 'submission' ? (
        submitted ? (
          <div className="av-page-narrow" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%' }}>
              <div className="card-body" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ width: 56, height: 56, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 className="w-7 h-7" color="#fff" />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>Bid submitted</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Total bid <b>{fmtSAR(totalBid)}</b> · Savings {savingsPct.toFixed(1)}% vs start price.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                  <button className="btn btn-outline" onClick={() => { setSubmitted(false); setStage('bidding'); }}>
                    Back to portal
                  </button>
                  <button className="btn btn-primary" onClick={() => nav('ebid-list')}>
                    View auction list
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ background: 'var(--vw-color-slate-900)', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: 'var(--vw-color-slate-700)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gavel className="w-4 h-4" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>Submit bid — AUC-2025-0041</div>
                  <div style={{ fontSize: 11.5, color: 'var(--vw-color-slate-400)' }}>Lenovo Middle East FZE</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--vw-color-slate-400)' }}>Remaining time</div>
                  <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>{fmtCountdown(seconds)}</div>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ background: 'transparent', color: '#e5e7eb', borderColor: 'var(--vw-color-slate-700)' }}
                  onClick={() => setStage('bidding')}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Exit
                </button>
              </div>
            </div>

            <div className="av-page">
              <div className="ext-alert">
                <b>Rules:</b> Your bid cannot exceed the start price. Min decrement per item: SAR 500. Bids are binding once submitted.
              </div>
              <div className="card">
                <div className="card-hdr">
                  <span className="card-hdr-title">Submit or update your bid</span>
                </div>
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Start price</th>
                        <th>Current lowest</th>
                        <th>Your last bid</th>
                        <th>New bid (per unit)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PORTAL_LINE_ITEMS.map(item => (
                        <tr key={item.id}>
                          <td className="td-bold">{item.description}</td>
                          <td>{item.qty}</td>
                          <td className="td-mono">{fmtSAR(item.startPrice)}</td>
                          <td className="td-mono" style={{ color: 'var(--teal)' }}>{fmtSAR(item.currentLowest)}</td>
                          <td className="td-mono">{fmtSAR(item.yourLastBid)}</td>
                          <td>
                            <input
                              type="number"
                              value={prices[item.id]}
                              style={{ width: 110 }}
                              onChange={e => setPrice(item.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ margin: 16, padding: 12, background: 'var(--vw-color-green-50)', border: '1px solid var(--vw-color-green-100)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--vw-color-green-700)' }}>New total bid</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--vw-color-green-700)' }}>{fmtSAR(totalBid)}</div>
                    <div style={{ fontSize: 11, color: 'var(--vw-color-green-600)' }}>
                      {totalBid < lastTotal ? '↓' : '↑'} {fmtSAR(Math.abs(totalBid - lastTotal))} vs your last bid · ↓ {savingsPct.toFixed(1)}% vs start
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg" disabled={!allPriced || submitting} onClick={submitBid}>
                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit bid →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Standard Supplier Journey: Invite → PQQ → Eligibility → Bidding Overview */
        <div className="av-page">
          <div className="supplier-view-banner">
            <div>
              <div style={{ fontSize: 11, color: 'var(--vw-color-slate-400)', marginBottom: 4 }}>SUPPLIER PORTAL — SIMULATED VIEW</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Lenovo Middle East FZE · Supplier dashboard</div>
              <div style={{ fontSize: 12, color: 'var(--vw-color-slate-400)', marginTop: 4 }}>Contact: ahmed.hassan@lenovo-me.com · Vendor ID: VND-1042</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                className={`badge ${statusBadge[stage].cls}`}
                style={!statusBadge[stage].cls ? { background: 'var(--vw-color-slate-700)', color: '#fff' } : undefined}
              >
                {statusBadge[stage].text}
              </span>
              <span className="sv-badge">Simulated supplier view</span>
            </div>
          </div>

          <div className="stepper">
            {STAGE_LABELS.map((label, i) => {
              const n = i + 1;
              const cls = n < stepIdx[stage] ? 'step done' : n === stepIdx[stage] ? 'step active' : 'step';
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', flex: n < STAGE_LABELS.length ? 1 : undefined }}>
                  <div className={cls}>
                    <div className="step-num">{n}</div>
                    {label}
                  </div>
                  {n < STAGE_LABELS.length && <div className={`step-line ${n < stepIdx[stage] ? 'done' : ''}`} />}
                </div>
              );
            })}
          </div>

          {stage === 'invite' && (
            <div className="card">
              <div className="card-hdr">
                <span className="card-hdr-title">Auction invitation</span>
                <span className="badge badge-live">Live now</span>
              </div>
              <div className="card-body">
                <div className="info-row" style={{ marginBottom: 10 }}>
                  <div className="info-item"><span className="ik">Auction</span><span className="iv">AUC-2025-0041</span></div>
                  <div className="info-item"><span className="ik">Title</span><span className="iv">IT Hardware — Laptops & Monitors Q2</span></div>
                  <div className="info-item"><span className="ik">Buyer</span><span className="iv">NetSingularity Procurement</span></div>
                  <div className="info-item"><span className="ik">Format</span><span className="iv">Dynamic reverse auction</span></div>
                </div>
                <div className="info-row" style={{ marginBottom: 14 }}>
                  <div className="info-item"><span className="ik">Bidding window</span><span className="iv">27 Mar 2025 · 14:00 – 16:00</span></div>
                  <div className="info-item"><span className="ik">Items</span><span className="iv">3 line items · 150 units total</span></div>
                  <div className="info-item"><span className="ik">Start price</span><span className="iv">{fmtSAR(1250000)}</span></div>
                </div>
                <div style={{ background: 'var(--vw-color-amber-50)', border: '1px solid var(--vw-color-amber-200)', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: 'var(--vw-color-amber-800)', marginBottom: 14 }}>
                  Accepting requires completing a 5-question pre-qualification questionnaire before you're eligible to bid. Declining removes you from this auction.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={() => acknowledge(true)}>Accept invitation →</button>
                  <button className="btn btn-outline" onClick={() => acknowledge(false)}>Decline</button>
                </div>
              </div>
            </div>
          )}

          {stage === 'declined' && (
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Invitation declined</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
                  You won't be invited to bid on AUC-2025-0041. The buyer has been notified.
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setStage('invite')}>
                  <RefreshCw className="w-3.5 h-3.5" /> Reconsider — restart
                </button>
              </div>
            </div>
          )}

          {stage === 'pqq' && (
            <div className="card">
              <div className="card-hdr">
                <span className="card-hdr-title">Pre-qualification questionnaire</span>
                <span className="badge badge-pending">Not submitted</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="q-item">
                  <div className="q-text">1. Do you have a valid VAT registration certificate? Please upload a copy. <span style={{ color: 'var(--red)' }}>*</span></div>
                  <div style={{ marginTop: 8 }}>
                    {vatUploaded ? (
                      <>
                        <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Uploaded: VAT_Certificate_Lenovo_ME.pdf</span>
                        <button className="btn btn-sm btn-outline" style={{ marginLeft: 10 }} onClick={() => setVatUploaded(false)}>Remove</button>
                      </>
                    ) : (
                      <>
                        <span style={{ color: 'var(--vw-color-amber-700)', fontWeight: 600 }}>Not uploaded</span>
                        <button className="btn btn-sm btn-outline" style={{ marginLeft: 10 }} onClick={() => setVatUploaded(true)}>Simulate upload</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="q-item">
                  <div className="q-text">2. What is your lead time for delivery after PO issuance? (in working days) <span style={{ color: 'var(--red)' }}>*</span></div>
                  <div style={{ marginTop: 6 }}>
                    <input
                      type="number"
                      value={leadTime}
                      style={{ width: 80, display: 'inline-block' }}
                      onChange={e => setLeadTime(parseInt(e.target.value) || 0)}
                    />{' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>working days — buyer requires 15 or fewer</span>
                  </div>
                </div>

                <div className="q-item">
                  <div className="q-text">3. Confirm that all equipment meets Saudi SASO standards and CE marking requirements. <span style={{ color: 'var(--red)' }}>*</span></div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                      <input type="radio" name="saso" checked={saso === 'yes'} onChange={() => setSaso('yes')} /> Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                      <input type="radio" name="saso" checked={saso === 'no'} onChange={() => setSaso('no')} /> No
                    </label>
                  </div>
                </div>

                <div className="q-item">
                  <div className="q-text">4. Provide warranty terms for each item category.</div>
                  <div style={{ marginTop: 6 }}>
                    <textarea value={warranty} onChange={e => setWarranty(e.target.value)} />
                  </div>
                </div>

                <div className="q-item">
                  <div className="q-text">5. Do you offer on-site support and maintenance services in KSA? <span style={{ color: 'var(--red)' }}>*</span></div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                      <input type="radio" name="support" checked={support === 'yes'} onChange={() => setSupport('yes')} /> Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                      <input type="radio" name="support" checked={support === 'no'} onChange={() => setSupport('no')} /> No
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={submitPQQ}>Submit questionnaire →</button>
                </div>
              </div>
            </div>
          )}

          {stage === 'evaluating' && (
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Evaluating your responses against the buyer's eligibility rules…</div>
              </div>
            </div>
          )}

          {stage === 'ineligible' && (
            <div className="card">
              <div className="card-hdr">
                <span className="card-hdr-title">Pre-qualification result</span>
                <span className="badge badge-rejected">Not eligible</span>
              </div>
              <div className="card-body">
                <div style={{ background: 'var(--vw-color-red-50)', border: '1px solid var(--vw-color-red-200)', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: 'var(--vw-color-red-800)', marginBottom: 14 }}>
                  <b>You do not meet this auction's pre-qualification criteria:</b>
                  <ul style={{ margin: '8px 0 0 18px' }}>
                    {reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setStage('pqq')}>
                  <RefreshCw className="w-3.5 h-3.5" /> Revise answers and resubmit
                </button>
              </div>
            </div>
          )}

          {stage === 'bidding' && (
            <div>
              <div style={{ background: 'var(--vw-color-green-50)', border: '1px solid var(--vw-color-green-200)', borderRadius: 6, padding: '10px 14px', fontSize: 12.5, color: 'var(--vw-color-green-800)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700 }}>✓ Pre-qualified</span> — you're eligible to bid on AUC-2025-0041.
                <button className="btn-ghost" style={{ marginLeft: 'auto', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setStage('pqq')}>
                  Review answers
                </button>
              </div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="card-hdr"><span className="card-hdr-title">Auction status</span></div>
                <div className="card-body">
                  <div className="info-row">
                    <div className="info-item"><span className="ik">Lowest bid (total)</span><span className="iv" style={{ color: 'var(--teal)' }}>{fmtSAR(323000)}</span></div>
                    <div className="info-item"><span className="ik">Your current rank</span><span className="iv" style={{ color: 'var(--vw-color-green-600)' }}>#1</span></div>
                    <div className="info-item"><span className="ik">Your total bid</span><span className="iv">{fmtSAR(323000)}</span></div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: 24 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Ready to submit or update your bid?</p>
                  <button className="btn btn-primary btn-lg" onClick={() => setStage('submission')}>
                    <Gauge className="w-4 h-4" /> Go to bid submission →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
