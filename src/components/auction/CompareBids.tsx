"use client";
import { useState } from 'react';

interface Props {
  onNavigate: (view: string, data?: any) => void;
  data?: any;
}

// Sourced verbatim from Auction_Module_v2_4_4.html's #v-compare section
// (AUC-2025-0041, the same default auction the HTML prototype opens to).
const RANKING = [
  { rank: 1, supplier: 'Lenovo Middle East FZE', bids: 14, lastBid: '14:36:04', extensions: '3 extensions triggered', total: 323000, pct: 11.5, pctColor: '#059669', canAward: true },
  { rank: 2, supplier: 'Dell Technologies KSA',   bids: 11, lastBid: '14:35:48', extensions: null,                    total: 332500, pct: 8.9,  pctColor: '#059669', canAward: false },
  { rank: 3, supplier: 'HP Inc. Arabia',           bids: 8,  lastBid: '14:34:12', extensions: null,                    total: 342500, pct: 6.2,  pctColor: '#059669', canAward: false },
  { rank: 4, supplier: 'Acer Gulf Distribution',   bids: 5,  lastBid: '14:31:57', extensions: null,                    total: 353000, pct: 3.3,  pctColor: '#d97706', canAward: false },
  { rank: 5, supplier: 'Samsung Gulf',             bids: 3,  lastBid: '14:28:30', extensions: null,                    total: 362500, pct: 0.7,  pctColor: '#9ca3af', canAward: false },
];

const ITEMS = [
  { item: 'Laptop (per unit)',          qty: 50, start: 4800, bids: [4250, 4380, 4520, 4650, 4750] },
  { item: 'Monitor (per unit)',         qty: 50, start: 1600, bids: [1420, 1450, 1480, 1530, 1580] },
  { item: 'Docking Station (per unit)', qty: 50, start: 900,  bids: [790, 820, 850, 880, 920] },
];
const ITEM_TOTALS = { start: 365000, bids: [323000, 332500, 342500, 353000, 362500] };
const SAVINGS_VS_START = ['SAR 42,000 (11.5%)', 'SAR 32,500 (8.9%)', 'SAR 22,500 (6.2%)', 'SAR 12,000 (3.3%)', 'SAR 2,500 (0.7%)'];
const VS_BUDGET = ['SAR 41,000 ✓', 'SAR 49,500 ✓', 'SAR 60,500 ✓', 'SAR 71,000 ✓', 'SAR 80,500 ✓'];
const SUPPLIER_COLS = ['#1 Lenovo ME', 'Dell KSA', 'HP Arabia', 'Acer Gulf', 'Samsung Gulf'];

const BID_HISTORY = [
  { n: 41, time: '14:36:04', supplier: 'Lenovo ME FZE', item: 'Laptop',  value: 4250, changeAmt: 70, count: 14 },
  { n: 40, time: '14:35:48', supplier: 'Dell Tech KSA',  item: 'Monitor', value: 1450, changeAmt: 40, count: 11 },
  { n: 39, time: '14:35:21', supplier: 'Lenovo ME FZE', item: 'Docking', value: 790,  changeAmt: 20, count: 13 },
  { n: 38, time: '14:34:12', supplier: 'HP Inc Arabia',  item: 'Laptop',  value: 4520, changeAmt: 60, count: 8 },
  { n: 37, time: '14:33:45', supplier: 'Dell Tech KSA',  item: 'Laptop',  value: 4380, changeAmt: 70, count: 10 },
  { n: 36, time: '14:31:57', supplier: 'Acer Gulf',      item: 'Monitor', value: 1530, changeAmt: 40, count: 5 },
  { n: 35, time: '14:28:30', supplier: 'Samsung Gulf',   item: 'Docking', value: 920,  changeAmt: 40, count: 3 },
];

const PROGRESSION_BIDS = [
  { label: 'Lenovo ME', width: 88.5, value: 'SAR 323,000', pct: '↓ 11.5%', color: '#059669' },
  { label: 'Dell KSA',  width: 91.1, value: 'SAR 332,500', pct: '↓ 8.9%',  color: '#059669' },
  { label: 'HP Arabia', width: 93.8, value: 'SAR 342,500', pct: '↓ 6.2%',  color: '#059669' },
  { label: 'Acer Gulf', width: 96.7, value: 'SAR 353,000', pct: '↓ 3.3%',  color: '#d97706' },
  { label: 'Samsung Gulf', width: 99.3, value: 'SAR 362,500', pct: '↓ 0.7%', color: '#9ca3af' },
  { label: 'Start Price', width: 100, value: 'SAR 365,000', pct: 'Ceiling', color: '#dc2626', isCeiling: true },
];
const PROGRESSION_COUNTS = [
  { label: 'Lenovo ME', width: 100, value: '14 bids' },
  { label: 'Dell KSA',  width: 79,  value: '11 bids' },
  { label: 'HP Arabia', width: 57,  value: '8 bids' },
  { label: 'Acer Gulf', width: 36,  value: '5 bids' },
  { label: 'Samsung Gulf', width: 21, value: '3 bids' },
];

const QUESTIONNAIRE = [
  { q: 'VAT registration certificate', vals: ['✓ Uploaded', '✓ Uploaded', '✓ Uploaded'], color: '#059669' },
  { q: 'Lead time (working days)',     vals: ['7 days', '10 days', '12 days'] },
  { q: 'SASO Standards Compliance',    vals: ['✓ Yes', '✓ Yes', '✓ Yes'], color: '#059669' },
  { q: 'Warranty Terms',               vals: ['3yr laptop / 3yr monitor / 2yr dock. On-site replacement within 48h.', '3yr laptop / 3yr monitor / 1yr dock. NBD courier replacement.', '2yr laptop / 2yr monitor / 1yr dock. Depot repair.'] },
  { q: 'On-site Support in KSA',       vals: ['✓ Yes — Riyadh, Jeddah, Dammam', '✓ Yes — Riyadh, Jeddah', 'Partial — Riyadh only'], colors: ['#059669', '#059669', '#d97706'] },
];

const TABS = ['Supplier ranking', 'Item-wise comparison', 'Bid history', 'Auction progression', 'Questionnaire comparison'] as const;
type Tab = typeof TABS[number];

const fmtSAR = (v: number) => `SAR ${v.toLocaleString('en-US')}`;
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 };
const th: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', background: '#f8fafc', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '10px 14px', fontSize: 12.5, color: '#374151' };

export default function CompareBids({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('Supplier ranking');

  return (
    <div style={{ padding: '24px 20px', minHeight: '100vh', background: '#f8fafc', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Bid comparison — AUC-2025-0041</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>IT Hardware — Laptops & Monitors Q2 · Closed 27 Mar 2025 · 16:00</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '7px 14px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Download Excel
          </button>
          <button onClick={() => onNavigate('reports')} style={{ padding: '7px 14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Full report
          </button>
        </div>
      </div>

      {/* Savings summary */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: '#15803d', margin: '0 0 12px' }}>Final savings summary</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {[
            { label: 'Start price (total)', value: fmtSAR(365000) },
            { label: 'Winning bid (total)', value: fmtSAR(323000) },
            { label: 'Total savings', value: fmtSAR(42000) },
            { label: 'Savings % (vs start)', value: '11.5%' },
            { label: 'Budget price (total)', value: fmtSAR(282000) },
            { label: 'Under budget', value: fmtSAR(41000) },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#15803d', margin: '0 0 2px' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#4b7c66', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '9px 14px', fontSize: 12.5, fontWeight: tab === t ? 600 : 400, color: tab === t ? '#1a1a1a' : '#6b7280', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #1a1a1a' : '2px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Supplier ranking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RANKING.map(r => (
            <div key={r.rank} style={{ ...card, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, background: r.rank === 1 ? '#1a1a1a' : r.rank === 2 ? '#94a3b8' : r.rank === 3 ? '#cd7f32' : '#e2e8f0', color: r.rank <= 3 ? '#fff' : '#475569' }}>{r.rank}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b', margin: 0 }}>{r.supplier}</p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{r.bids} bids · Last bid {r.lastBid}{r.extensions ? ` · ${r.extensions}` : ''}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'monospace' }}>{fmtSAR(r.total)}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: r.pctColor, margin: '2px 0 0' }}>↓ {r.pct}% vs start</p>
              </div>
              <button
                style={{ padding: '6px 14px', background: r.canAward ? '#ecfdf5' : '#fff', color: r.canAward ? '#15803d' : '#374151', border: r.canAward ? '1px solid #bbf7d0' : '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Award
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Item-wise comparison' && (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Item</th><th style={th}>Qty</th><th style={th}>Start price</th>
                  {SUPPLIER_COLS.map(c => <th key={c} style={th}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {ITEMS.map(row => (
                  <tr key={row.item} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ ...td, fontWeight: 600, color: '#1e293b' }}>{row.item}</td>
                    <td style={td}>{row.qty}</td>
                    <td style={{ ...td, fontFamily: 'monospace' }}>{fmtSAR(row.start)}</td>
                    {row.bids.map((b, i) => (
                      <td key={i} style={{ ...td, fontFamily: 'monospace', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#059669' : '#374151' }}>{fmtSAR(b)}</td>
                    ))}
                  </tr>
                ))}
                <tr style={{ borderTop: '1px solid #f1f5f9', background: '#f8fafc', fontWeight: 700 }}>
                  <td style={td} colSpan={2}>Total</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{fmtSAR(ITEM_TOTALS.start)}</td>
                  {ITEM_TOTALS.bids.map((b, i) => (
                    <td key={i} style={{ ...td, fontFamily: 'monospace', color: i === 0 ? '#059669' : '#374151' }}>{fmtSAR(b)}</td>
                  ))}
                </tr>
                <tr style={{ background: '#f0fdf4' }}>
                  <td style={{ ...td, fontSize: 11, color: '#059669', fontWeight: 600 }} colSpan={2}>Savings vs Start</td>
                  <td style={td}>—</td>
                  {SAVINGS_VS_START.map((s, i) => <td key={i} style={{ ...td, color: i === 0 ? '#059669' : '#374151', fontWeight: i === 0 ? 700 : 400 }}>{s}</td>)}
                </tr>
                <tr style={{ background: '#eff6ff' }}>
                  <td style={{ ...td, fontSize: 11, color: '#2563eb', fontWeight: 600 }} colSpan={2}>vs Budget Price</td>
                  <td style={td}>—</td>
                  {VS_BUDGET.map((s, i) => <td key={i} style={{ ...td, color: '#2563eb', fontWeight: i === 0 ? 700 : 400 }}>{s}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Bid history' && (
        <div style={card}>
          <div style={{ padding: '12px 16px' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 10px' }}>
              Total bids placed: <b style={{ color: '#111827' }}>41</b> · Across 3 items · 5 suppliers · 3 auto-extensions triggered
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['#', 'Time', 'Supplier', 'Item', 'Bid value', 'Change', 'Bid count'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {BID_HISTORY.map(row => (
                  <tr key={row.n} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={td}>{row.n}</td>
                    <td style={{ ...td, fontFamily: 'monospace' }}>{row.time}</td>
                    <td style={td}>{row.supplier}</td>
                    <td style={td}>{row.item}</td>
                    <td style={{ ...td, fontFamily: 'monospace' }}>{fmtSAR(row.value)}</td>
                    <td style={{ ...td, color: '#059669' }}>↓ SAR {row.changeAmt}</td>
                    <td style={td}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Auction progression' && (
        <div style={card}>
          <div style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>Auction progression — total bid value over time</p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>How each supplier's total bid evolved during the 2-hour auction window</p>

            <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.03em' }}>Final bid progression (Start → Final)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {PROGRESSION_BIDS.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 84, fontSize: 12, color: b.isCeiling ? '#dc2626' : '#374151', flexShrink: 0 }}>{b.label}</div>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', height: 24, position: 'relative' }}>
                    <div style={{ height: '100%', width: `${b.width}%`, background: b.isCeiling ? '#dc2626' : '#1a1a1a', display: 'flex', alignItems: 'center', paddingLeft: 8, borderRadius: 6 }}>
                      <span style={{ fontSize: 11, color: '#fff', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{b.value}</span>
                    </div>
                  </div>
                  <div style={{ width: 70, fontSize: 11, fontWeight: 600, color: b.color, textAlign: 'right', flexShrink: 0 }}>{b.pct}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0 16px' }} />
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.03em' }}>Bid count by supplier</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PROGRESSION_COUNTS.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 84, fontSize: 12, color: '#374151', flexShrink: 0 }}>{b.label}</div>
                  <div style={{ width: 300, maxWidth: '50%', background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', height: 22 }}>
                    <div style={{ height: '100%', width: `${b.width}%`, background: '#1a1a1a', display: 'flex', alignItems: 'center', paddingLeft: 8, borderRadius: 6 }}>
                      <span style={{ fontSize: 11, color: '#fff', whiteSpace: 'nowrap' }}>{b.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Questionnaire comparison' && (
        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th style={th}>Question</th><th style={th}>Lenovo ME #1</th><th style={th}>Dell KSA</th><th style={th}>HP Arabia</th></tr>
              </thead>
              <tbody>
                {QUESTIONNAIRE.map(row => (
                  <tr key={row.q} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ ...td, fontWeight: 500, color: '#1e293b' }}>{row.q}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} style={{ ...td, background: i === 0 ? '#fefbe8' : undefined, color: row.colors ? row.colors[i] : row.color || '#374151', fontSize: 11.5 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
