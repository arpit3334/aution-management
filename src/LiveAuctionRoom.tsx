import { useState } from 'react';
import {
  Clock, Zap, CheckCircle, Shield, AlertCircle,
  Send, Award, Lock, GitMerge, MessageSquare, Flag, Layers,
  Copy, Gauge, TrendingUp, TrendingDown,
} from 'lucide-react';

// Every room's data below is sourced from Auction_Module_v2_4_4.html's
// #v-live section — all 9 room-format previews (Dynamic reverse / Sealed
// bid / Two-envelope / Multi-attribute / Hybrid RFQ / BAFO / Negotiation /
// English / Dutch), in the same order as the HTML's "Preview format" tabs.
const fmtSAR = (v: number) => `SAR ${v.toLocaleString('en-US')}`;

interface Props { onNavigate: (view: string, data?: any) => void; data?: any; }
type RoomTab = 'dynamic-reverse' | 'sealed-bid' | 'two-envelope' | 'multi-attribute' | 'hybrid' | 'bafo' | 'negotiation' | 'english' | 'dutch';

const ROOM_TABS: { id: RoomTab; label: string; icon: any }[] = [
  { id: 'dynamic-reverse', label: 'Dynamic reverse',  icon: Layers },
  { id: 'sealed-bid',      label: 'Sealed bid',        icon: Lock },
  { id: 'two-envelope',    label: 'Two-envelope',      icon: Copy },
  { id: 'multi-attribute', label: 'Multi-attribute',   icon: Gauge },
  { id: 'hybrid',          label: 'Hybrid RFQ',        icon: GitMerge },
  { id: 'bafo',            label: 'BAFO',              icon: Flag },
  { id: 'negotiation',     label: 'Negotiation',       icon: MessageSquare },
  { id: 'english',         label: 'English',           icon: TrendingUp },
  { id: 'dutch',           label: 'Dutch',             icon: TrendingDown },
];

/* ── Shared style primitives ───────────────────────────────────────────── */
const card = (extra?: object): React.CSSProperties => ({ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', ...extra });
const th: React.CSSProperties = { padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', background: '#f8fafc', whiteSpace: 'nowrap' };
const thR: React.CSSProperties = { ...th, textAlign: 'right' };

function SectionCard({ title, badge, children, action }: { title?: string; badge?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={card()}>
      {title && (
        <div style={{ padding: '13px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>{title}</p>
            {badge}
          </div>
          {action}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function LiveBanner({ accentColor, icon, label, title, sub, timerLabel, timer }: { accentColor: string; icon?: React.ReactNode; label: string; title: string; sub: string; timerLabel: string; timer: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ height: 3, background: accentColor }} />
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {icon}
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{title}</p>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{sub}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <Clock size={14} color="#9ca3af" />
            <span style={{ fontSize: 28, fontWeight: 300, fontFamily: 'monospace', color: '#111827', letterSpacing: '.03em' }}>{timer}</span>
          </div>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>{timerLabel}</p>
        </div>
      </div>
    </div>
  );
}

function AlertBanner({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '11px 14px', marginBottom: 14 }}>
      {icon}
      <p style={{ fontSize: 13, color: '#78350f', margin: 0 }}>{text}</p>
    </div>
  );
}

/* ── Chip helper ───────────────────────────────────────────────────────── */
function Chip({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    Submitted: 'vw-chip vw-chip--success',
    'Not Submitted': 'vw-chip vw-chip--neutral',
    Pending: 'vw-chip vw-chip--warning',
    Shortlisted: 'vw-chip vw-chip--success',
    'Not Shortlisted': 'vw-chip vw-chip--error',
    Active: 'vw-chip vw-chip--success',
    Idle: 'vw-chip vw-chip--neutral',
    Live: 'vw-chip vw-chip--error',
    Locked: 'vw-chip vw-chip--neutral-solid',
  };
  return <span className={cfg[status] || 'vw-chip vw-chip--neutral'}>{status}</span>;
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Multi-Round Room — HTML: #room-multiround (Dynamic reverse auction)  */
/* ══════════════════════════════════════════════════════════════════════ */
const MR_ROWS = [
  { rank: 1, supplier: 'Lenovo Middle East FZE', laptop: 4250, monitor: 1420, docking: 790, total: 323000, savings: 11.5, lastBid: '14:36:04' },
  { rank: 2, supplier: 'Dell Technologies KSA',   laptop: 4380, monitor: 1450, docking: 820, total: 332500, savings: 8.9,  lastBid: '14:35:48' },
  { rank: 3, supplier: 'HP Inc. Arabia',           laptop: 4520, monitor: 1480, docking: 850, total: 342500, savings: 6.2,  lastBid: '14:34:12' },
  { rank: 4, supplier: 'Acer Gulf Distribution',   laptop: 4650, monitor: 1530, docking: 880, total: 353000, savings: 3.3,  lastBid: '14:31:57' },
  { rank: 5, supplier: 'Samsung Gulf',             laptop: 4750, monitor: 1580, docking: 920, total: 362500, savings: 0.7,  lastBid: '14:28:30' },
];
const ACT_LOG = [
  { time: '14:36:04', supplier: 'Lenovo ME FZE',  item: 'Laptop',  newBid: 4250, prev: 4320, changeAmt: 70 },
  { time: '14:35:48', supplier: 'Dell Tech KSA',   item: 'Monitor', newBid: 1450, prev: 1490, changeAmt: 40 },
  { time: '14:35:21', supplier: 'Lenovo ME FZE',  item: 'Docking', newBid: 790,  prev: 810,  changeAmt: 20 },
  { time: '14:34:12', supplier: 'HP Inc. Arabia',  item: 'Laptop',  newBid: 4520, prev: 4580, changeAmt: 60 },
  { time: '14:33:45', supplier: 'Dell Tech KSA',   item: 'Laptop',  newBid: 4380, prev: 4450, changeAmt: 70 },
  { time: '14:31:57', supplier: 'Acer Gulf',       item: 'Monitor', newBid: 1530, prev: 1570, changeAmt: 40 },
  { time: '14:28:30', supplier: 'Samsung Gulf',    item: 'Docking', newBid: 920,  prev: 960,  changeAmt: 40 },
];

function MultiRoundRoom() {
  const [itemTab, setItemTab] = useState('All Items');
  const itemTabs = ['All Items', 'Laptop', 'Monitor', 'Docking'];

  return (
    <div>
      <LiveBanner
        accentColor="#ef4444"
        label="Live · Dynamic Reverse"
        title="AUC-2025-0041 · IT Hardware — Laptops & Monitors Q2"
        sub="Dynamic reverse auction · Continuous open window · 5 Suppliers · Rank only visible · Auto-extension: last 5 min → +5 min"
        timer="01:23:47"
        timerLabel="Remaining Time"
        icon={
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#ef4444', opacity: .5, animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'block', position: 'relative' }} />
          </span>
        }
      />
      <AlertBanner
        icon={<Zap size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />}
        text={<><span style={{ fontWeight: 600 }}>Auto-Extension Active:</span> A bid was placed with 4:32 remaining — timer reset to 5:00. Extension #3</>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14 }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Live Bid Board */}
          <SectionCard title="Live Bid Board">
            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
              {itemTabs.map(t => (
                <button key={t} onClick={() => setItemTab(t)}
                  style={{ padding: '9px 16px', fontSize: 12, fontWeight: itemTab === t ? 600 : 400, color: itemTab === t ? '#1a1a1a' : '#6b7280', background: 'none', border: 'none', borderBottom: itemTab === t ? '2px solid #1a1a1a' : '2px solid transparent', marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit', transition: 'color .12s' }}>
                  {t}
                </button>
              ))}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={th}>Rank</th>
                  <th style={th}>Supplier</th>
                  <th style={thR}>Laptop ×50</th>
                  <th style={thR}>Monitor ×50</th>
                  <th style={thR}>Docking ×50</th>
                  <th style={thR}>Total Bid</th>
                  <th style={thR}>Savings</th>
                  <th style={thR}>Last Bid At</th>
                </tr>
              </thead>
              <tbody>
                {MR_ROWS.map(row => (
                  <tr key={row.rank} style={{ borderTop: '1px solid #f1f5f9', background: row.rank === 1 ? '#f0fdf4' : undefined }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: row.rank === 1 ? '#1a1a1a' : '#f1f5f9', color: row.rank === 1 ? '#fff' : '#6b7280' }}>
                        {row.rank}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1e293b', fontSize: 12 }}>{row.supplier}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>{fmtSAR(row.laptop)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>{fmtSAR(row.monitor)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>{fmtSAR(row.docking)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmtSAR(row.total)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>↓{row.savings}%</span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{row.lastBid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          {/* Activity Log */}
          <SectionCard title="Bid Activity Log">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={th}>Time</th>
                  <th style={th}>Supplier</th>
                  <th style={th}>Item</th>
                  <th style={thR}>New Bid</th>
                  <th style={thR}>Previous Bid</th>
                  <th style={thR}>Change</th>
                </tr>
              </thead>
              <tbody>
                {ACT_LOG.map((log, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '9px 14px', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{log.time}</td>
                    <td style={{ padding: '9px 14px', color: '#374151' }}>{log.supplier}</td>
                    <td style={{ padding: '9px 14px', color: '#374151' }}>{log.item}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmtSAR(log.newBid)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: '#9ca3af' }}>{fmtSAR(log.prev)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>↓ SAR {log.changeAmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Savings */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ height: 3, background: '#10b981' }} />
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 14px' }}>Real-Time Savings</p>
              {[
                { label: 'Current Saving', value: 'SAR 42K', color: '#059669' },
                { label: 'Saving %',       value: '11.5%',   color: '#059669' },
                { label: 'vs Budget Price',value: 'SAR 23K', color: '#374151' },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 22, fontWeight: 300, color: row.color, margin: '0 0 2px' }}>{row.value}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{row.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Auction Controls</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Pause Auction',           bg: '#1a1a1a', color: '#fff' },
                { label: 'End Auction Now',          bg: '#ef4444', color: '#fff' },
                { label: 'Message Suppliers',        bg: '#fff',    color: '#374151', border: '1px solid #e2e8f0' },
                { label: 'Announce Extension',       bg: '#fff',    color: '#374151', border: '1px solid #e2e8f0' },
              ].map(btn => (
                <button key={btn.label} style={{ width: '100%', padding: '8px 12px', background: btn.bg, color: btn.color, border: (btn as any).border || 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}
                  onMouseEnter={e => { if (btn.bg === '#1a1a1a') e.currentTarget.style.background = '#374151'; if (btn.bg === '#ef4444') e.currentTarget.style.background = '#dc2626'; if (btn.bg === '#fff') e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => (e.currentTarget.style.background = btn.bg)}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier Status */}
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Supplier Status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MR_ROWS.map(row => (
                <div key={row.rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <p style={{ fontSize: 11, color: '#374151', margin: 0, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.supplier}</p>
                  <Chip status={row.rank <= 3 ? 'Active' : 'Idle'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Sealed Bid Room — HTML: #room-sealed                                 */
/* ══════════════════════════════════════════════════════════════════════ */
const SB_SUPPLIERS = [
  { name: 'Lenovo Middle East FZE', status: 'Submitted',     time: '26 Mar 2025 · 16:40' },
  { name: 'Dell Technologies KSA',  status: 'Submitted',     time: '27 Mar 2025 · 09:15' },
  { name: 'HP Inc. Arabia',         status: 'Submitted',     time: '27 Mar 2025 · 11:02' },
  { name: 'Microsoft Gulf',         status: 'Not Submitted', time: '—' },
  { name: 'Oracle Arabia',          status: 'Submitted',     time: '27 Mar 2025 · 13:55' },
  { name: 'SAP MENA',               status: 'Not Submitted', time: '—' },
];

function SealedBidRoom() {
  return (
    <div>
      <LiveBanner
        accentColor="#374151"
        label="Sealed Bid"
        title="AUC-2025-0044 · Annual Software Licensing Renewal"
        sub="6 Invited Suppliers"
        timer="04:12:30"
        timerLabel="Until Bid Opening"
        icon={<Shield size={14} color="#6b7280" />}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14 }}>
        <SectionCard title="Submission Status">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={th}>Supplier</th>
                <th style={th}>Status</th>
                <th style={thR}>Submitted At</th>
                <th style={thR}>Bid Amount</th>
              </tr>
            </thead>
            <tbody>
              {SB_SUPPLIERS.map(s => (
                <tr key={s.name} style={{ borderTop: '1px solid #f1f5f9' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1e293b' }}>{s.name}</td>
                  <td style={{ padding: '11px 14px' }}><Chip status={s.status} /></td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{s.time}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>Sealed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>Automatic Bid Opening</p>
            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>Bids open automatically the moment the countdown reaches zero. Once opened, all sealed bids become visible to procurement simultaneously and cannot be changed.</p>
          </div>
          <div style={{ ...card(), padding: 0 }}>
            {[
              { label: 'Opening Date and Time', value: '27 Mar 2025 · 17:00' },
              { label: 'Attendees',             value: 'Procurement team only' },
              { label: 'Bid Revision',          value: 'Allowed until deadline' },
              { label: 'Submitted So Far',      value: '4 of 6 suppliers' },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#1e293b', margin: 0 }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Hybrid Room — HTML: #room-hybrid                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function HybridRoom() {
  const [phase, setPhase] = useState<'phase1' | 'phase2'>('phase1');
  const phase1Rows = [
    { rank: 1, supplier: 'Accenture Gulf',              bid: 2140000, status: 'Shortlisted' },
    { rank: 2, supplier: 'Orbis Consulting',             bid: 2260000, status: 'Shortlisted' },
    { rank: 3, supplier: 'Tata Consultancy Services',   bid: 2180000, status: 'Shortlisted' },
    { rank: 4, supplier: 'Wipro Arabia',                bid: 2225000, status: 'Shortlisted' },
  ];
  const phase2Rows = [
    { supplier: 'Accenture Gulf',             status: 'Submitted', time: '09:22:11' },
    { supplier: 'Orbis Consulting',            status: 'Submitted', time: '10:05:44' },
    { supplier: 'Tata Consultancy Services',  status: 'Pending',   time: '—' },
  ];

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: 3, background: '#7c3aed' }} />
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <GitMerge size={14} color="#6b7280" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' }}>Hybrid RFQ + Auction</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>AUC-2025-0046 · Enterprise Cloud Migration Services</p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Top 4 of 9 RFQ respondents shortlisted</p>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
            {(['phase1', 'phase2'] as const).map(p => (
              <button key={p} onClick={() => setPhase(p)}
                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: phase === p ? '#1a1a1a' : 'transparent', color: phase === p ? '#fff' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s' }}>
                {p === 'phase1' ? 'Phase 1' : 'Phase 2'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {phase === 'phase1' ? (
        <SectionCard title="Blended Ranking" badge={<Chip status="Locked" />}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><th style={th}>Rank</th><th style={th}>Supplier</th><th style={thR}>Live Bid</th><th style={thR}>Status</th></tr></thead>
            <tbody>
              {phase1Rows.map(row => (
                <tr key={row.rank} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: '#6b7280', fontSize: 11 }}>#{row.rank}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1e293b' }}>{row.supplier}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmtSAR(row.bid)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right' }}><Chip status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      ) : (
        <SectionCard title="Phase 2 — Live Auction Submission">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><th style={th}>Supplier</th><th style={th}>Status</th><th style={thR}>Submitted At</th></tr></thead>
            <tbody>
              {phase2Rows.map(row => (
                <tr key={row.supplier} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1e293b' }}>{row.supplier}</td>
                  <td style={{ padding: '11px 14px' }}><Chip status={row.status} /></td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Negotiation Room — HTML: #room-negotiation                           */
/* ══════════════════════════════════════════════════════════════════════ */
function NegotiationRoom() {
  const [selected, setSelected] = useState(0);
  const [counterOffer, setCounterOffer] = useState(
    'SAR 1,670,000 / year accepted with the revised 38-guard coverage model, subject to confirmed SLA on camera response time.'
  );
  const suppliers = [
    { name: 'G4S Saudi Arabia',       status: 'Active' },
    { name: 'SecureGuard KSA',        status: 'Idle' },
    { name: 'Falcon Protection Group',status: 'Idle' },
  ];
  const messages = [
    { from: 'supplier', text: 'SAR 1,840,000 / year — 3 year term, 45 guards across 2 sites.', time: '24 Mar 2025 · 10:00' },
    { from: 'buyer',    text: 'SAR 1,620,000 / year. Budget benchmark from last contract is SAR 1.58M — please revisit guard headcount or shift coverage model.', time: '25 Mar 2025 · 14:30' },
    { from: 'supplier', text: 'SAR 1,710,000 / year with revised coverage model (38 guards, smart-camera augmentation on site 2). This is close to our floor given current minimum wage requirements.', time: '26 Mar 2025 · 11:15' },
  ];

  return (
    <div>
      <LiveBanner
        accentColor="#0369a1"
        label="Negotiation · Round 2 of Max 3"
        title="AUC-2025-0048 · Executive Security Services Contract"
        sub="Private negotiation mode · one supplier at a time"
        timer="22:14:05"
        timerLabel="Response Window"
        icon={<MessageSquare size={14} color="#6b7280" />}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 14 }}>
        {/* Supplier list */}
        <div style={card()}>
          <div style={{ padding: '11px 14px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>Suppliers</p>
          </div>
          {suppliers.map((s, i) => (
            <button key={i} onClick={() => setSelected(i)}
              style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderBottom: '1px solid #f1f5f9', background: selected === i ? '#f8fafc' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = selected === i ? '#f8fafc' : 'transparent')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.status === 'Active' ? '#10b981' : '#d1d5db', flexShrink: 0 }} />
                <p style={{ fontSize: 12, fontWeight: 500, color: '#1e293b', margin: 0 }}>{s.name}</p>
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 0 15px' }}>{s.status}</p>
            </button>
          ))}
        </div>

        {/* Message thread */}
        <div style={{ ...card(), display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>{suppliers[selected].name}</p>
          </div>
          <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'buyer' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: 12, background: msg.from === 'buyer' ? '#374151' : '#f1f5f9', color: msg.from === 'buyer' ? '#fff' : '#374151' }}>
                  <p style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 4px' }}>{msg.text}</p>
                  <p style={{ fontSize: 10, color: msg.from === 'buyer' ? 'rgba(255,255,255,.45)' : '#9ca3af', margin: 0 }}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: '1px solid #f1f5f9' }}>
            <textarea value={counterOffer} onChange={e => setCounterOffer(e.target.value)} placeholder="Type your counter-offer message…" rows={3}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', color: '#374151' }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              {[
                { label: 'Save Draft',           bg: '#fff',     color: '#374151', border: '1px solid #e2e8f0' },
                { label: 'Accept Their Offer',   bg: '#fff',     color: '#374151', border: '1px solid #e2e8f0' },
                { label: 'Send Counter-Offer',   bg: '#1a1a1a',  color: '#fff' },
              ].map(btn => (
                <button key={btn.label} style={{ padding: '7px 14px', background: btn.bg, color: btn.color, border: (btn as any).border || 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
                  onMouseEnter={e => { if (btn.bg === '#1a1a1a') e.currentTarget.style.background = '#374151'; }}
                  onMouseLeave={e => (e.currentTarget.style.background = btn.bg)}>
                  {btn.label === 'Send Counter-Offer' && <Send size={12} />}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  BAFO Room — HTML: #room-bafo                                         */
/* ══════════════════════════════════════════════════════════════════════ */
function BafoRoom() {
  const rows = [
    { supplier: 'Lenovo Middle East FZE', priorBid: 856200, status: 'Submitted', time: '28 Mar 2025 · 10:12' },
    { supplier: 'Dell Technologies KSA',  priorBid: 868500, status: 'Pending',   time: '—' },
    { supplier: 'HP Inc. Arabia',         priorBid: 879000, status: 'Submitted', time: '28 Mar 2025 · 09:40' },
  ];

  return (
    <div>
      <LiveBanner
        accentColor="#b45309"
        label="BAFO — Best and Final Offer"
        title="AUC-2025-0037 · Network Infrastructure — Switches & Routers"
        sub="Final sealed round · 3 shortlisted suppliers"
        timer="05:47:12"
        timerLabel="Until BAFO Deadline"
        icon={<Award size={14} color="#6b7280" />}
      />
      <AlertBanner
        icon={<AlertCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />}
        text="This is the final round. BAFO submissions are sealed and open automatically at the deadline. There is no further negotiation or re-bid after this — award proceeds directly from these results."
      />
      <SectionCard title="Shortlisted for BAFO">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={th}>Supplier</th>
              <th style={thR}>Prior Best Bid</th>
              <th style={th}>BAFO Status</th>
              <th style={thR}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.supplier} style={{ borderTop: '1px solid #f1f5f9' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1e293b' }}>{row.supplier}</td>
                <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, color: '#374151' }}>{fmtSAR(row.priorBid)}</td>
                <td style={{ padding: '11px 14px' }}><Chip status={row.status} /></td>
                <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Two-Envelope Room — HTML: #room-twoenvelope                          */
/* ══════════════════════════════════════════════════════════════════════ */
const TE_ROWS = [
  { supplier: 'SAP SE',           score: 88, pass: 70, status: 'Qualified',    evaluator: 'Mariam Al-Dosari' },
  { supplier: 'Oracle Arabia',    score: 84, pass: 70, status: 'Qualified',    evaluator: 'Mariam Al-Dosari' },
  { supplier: 'Microsoft MENA',   score: 79, pass: 70, status: 'Qualified',    evaluator: 'Abdulaziz Alrashed' },
  { supplier: 'Infor Gulf',       score: 74, pass: 70, status: 'Qualified',    evaluator: 'Abdulaziz Alrashed' },
  { supplier: 'IFS Arabia',       score: 63, pass: 70, status: 'Disqualified', evaluator: 'Sourabh Jain' },
  { supplier: 'Epicor KSA',       score: 58, pass: 70, status: 'Disqualified', evaluator: 'Sourabh Jain' },
  { supplier: 'Unit4 Arabia',     score: null as number | null, pass: 70, status: 'Pending score', evaluator: '—' },
];
const TE_STATUS_CHIP: Record<string, string> = {
  Qualified: 'vw-chip vw-chip--success',
  Disqualified: 'vw-chip vw-chip--error',
  'Pending score': 'vw-chip vw-chip--warning',
};

function TwoEnvelopeRoom() {
  const [phase, setPhase] = useState<'technical' | 'commercial'>('technical');
  return (
    <div>
      <LiveBanner
        accentColor="#374151"
        label="Two-Envelope · Phase 1 of 2"
        title="AUC-2025-0050 · Enterprise ERP System Replacement"
        sub="Technical envelopes open · 7 suppliers submitted"
        timer="—"
        timerLabel="Evaluation In Progress"
        icon={<Copy size={14} color="#6b7280" />}
      />
      <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 14 }}>
        <button onClick={() => setPhase('technical')}
          style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: phase === 'technical' ? '#1a1a1a' : 'transparent', color: phase === 'technical' ? '#fff' : '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Phase 1 · Technical opening (live)
        </button>
        <button onClick={() => alert("Commercial envelopes are locked until technical evaluation is complete and all disqualified suppliers are formally notified.")}
          style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: 'transparent', color: '#9ca3af', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          Phase 2 · Commercial opening (locked)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard title="Technical evaluation" badge={<span className="vw-chip vw-chip--warning">Scoring in progress</span>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={th}>Supplier</th>
                  <th style={thR}>Technical score</th>
                  <th style={thR}>Pass mark</th>
                  <th style={th}>Status</th>
                  <th style={th}>Evaluator</th>
                </tr>
              </thead>
              <tbody>
                {TE_ROWS.map(row => (
                  <tr key={row.supplier} style={{ borderTop: '1px solid #f1f5f9', background: row.status === 'Pending score' ? '#fffbeb' : undefined }}>
                    <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1e293b' }}>{row.supplier}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>{row.score ?? '—'} / 100</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#9ca3af' }}>{row.pass}</td>
                    <td style={{ padding: '11px 14px' }}><span className={TE_STATUS_CHIP[row.status]}>{row.status}</span></td>
                    <td style={{ padding: '11px 14px', color: '#6b7280', fontSize: 11.5 }}>{row.evaluator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px' }}>
            <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 12.5, color: '#1e40af', margin: 0 }}><b>Commercial envelopes unlock</b> once all technical scores are entered and the evaluation lead approves. Disqualified suppliers will be notified before commercial bids are opened.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Opening summary</p>
            {[
              { label: 'Submissions received',  value: '7 of 7 invited', color: '#374151' },
              { label: 'Technically qualified',  value: '4 suppliers',   color: '#059669' },
              { label: 'Disqualified',           value: '2 suppliers',   color: '#dc2626' },
              { label: 'Pending score',          value: '1 supplier',    color: '#d97706' },
              { label: 'Commercial opens',       value: 'After approval', color: '#374151' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{row.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Evaluation actions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Add evaluator score</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>View evaluation criteria</button>
              <button onClick={() => alert('All 7 scores must be entered before commercial envelopes can be unlocked.')}
                style={{ width: '100%', padding: '8px 12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Approve and unlock commercial</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Multi-Attribute Room — HTML: #room-multiattr                         */
/* ══════════════════════════════════════════════════════════════════════ */
const MA_ROWS = [
  { rank: 1, supplier: 'Accenture Gulf',   technical: 88, commercial: 82, commUp: true,  risk: 90, support: 85, esg: 78, overall: 86.3, lastBid: '14:43:52' },
  { rank: 2, supplier: 'Deloitte MENA',    technical: 92, commercial: 76, commUp: false, risk: 88, support: 90, esg: 92, overall: 85.8, lastBid: '14:41:30' },
  { rank: 3, supplier: 'McKinsey Arabia',  technical: 95, commercial: 68, commUp: false, risk: 92, support: 88, esg: 80, overall: 84.2, lastBid: '14:38:04' },
  { rank: 4, supplier: 'PwC Gulf',         technical: 82, commercial: 80, commUp: false, risk: 85, support: 82, esg: 88, overall: 82.6, lastBid: '14:35:19' },
];

function MultiAttributeRoom() {
  return (
    <div>
      <LiveBanner
        accentColor="#1e3a5f"
        label="Live · Multi-Attribute"
        title="AUC-2025-0052 · Digital Transformation Consulting — Phase 3"
        sub="Multi-attribute auction · Technical 45% · Commercial 30% · Risk 10% · Support 10% · ESG 5%"
        timer="00:38:22"
        timerLabel="Remaining Time"
        icon={<Gauge size={14} color="#6b7280" />}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard title="Weighted score leaderboard" action={<span style={{ fontSize: 11, color: '#9ca3af' }}>Last updated: 14:44:10</span>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={th}>Rank</th>
                  <th style={th}>Supplier</th>
                  <th style={thR}>Technical<br /><span style={{ fontWeight: 400, fontSize: 10 }}>45%</span></th>
                  <th style={thR}>Commercial<br /><span style={{ fontWeight: 400, fontSize: 10 }}>30%</span></th>
                  <th style={thR}>Risk<br /><span style={{ fontWeight: 400, fontSize: 10 }}>10%</span></th>
                  <th style={thR}>Support<br /><span style={{ fontWeight: 400, fontSize: 10 }}>10%</span></th>
                  <th style={thR}>ESG<br /><span style={{ fontWeight: 400, fontSize: 10 }}>5%</span></th>
                  <th style={thR}>Overall</th>
                  <th style={thR}>Last bid</th>
                </tr>
              </thead>
              <tbody>
                {MA_ROWS.map(row => (
                  <tr key={row.rank} style={{ borderTop: '1px solid #f1f5f9', background: row.rank === 1 ? '#fffbeb' : undefined }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: row.rank === 1 ? '#1a1a1a' : row.rank === 2 ? '#94a3b8' : row.rank === 3 ? '#cd7f32' : '#e2e8f0', color: row.rank <= 3 ? '#fff' : '#475569' }}>{row.rank}</div>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1e293b' }}>{row.supplier}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>{row.technical}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>{row.commercial} {row.commUp && <span style={{ fontSize: 10, color: '#059669' }}>↑</span>}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>{row.risk}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>{row.support}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>{row.esg}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#d97706' }}>{row.overall}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{row.lastBid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px' }}>
            <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 12.5, color: '#78350f', margin: 0 }}><b>Suppliers see only their own overall score and rank</b> — not the individual attribute breakdown, not other suppliers' names or scores. This prevents gaming the scoring model.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1e40af', margin: '0 0 6px' }}>Score simulation</p>
            <p style={{ fontSize: 12, color: '#1d4ed8', margin: 0, lineHeight: 1.5 }}>If Deloitte improves commercial score from 76 → 85, their overall moves from 85.8 → 88.5, taking rank 1.</p>
          </div>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Auction controls</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Pause auction</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>End auction now</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Send message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  English Auction Room — HTML: #room-english                           */
/* ══════════════════════════════════════════════════════════════════════ */
const ENG_ROWS = [
  { n: 1, bidder: 'Bidder #7',  amount: 1350000, time: '14:48:32', lead: true },
  { n: 2, bidder: 'Bidder #3',  amount: 1300000, time: '14:47:18' },
  { n: 3, bidder: 'Bidder #7',  amount: 1250000, time: '14:46:05' },
  { n: 4, bidder: 'Bidder #11', amount: 1200000, time: '14:44:50' },
  { n: 5, bidder: 'Bidder #3',  amount: 1150000, time: '14:43:30' },
  { n: 6, bidder: 'Bidder #9',  amount: 1100000, time: '14:41:15' },
  { n: 7, bidder: 'Bidder #2',  amount: 1050000, time: '14:39:02' },
  { n: 8, bidder: 'Bidder #7',  amount: 1000000, time: '14:37:00' },
];

function EnglishRoom() {
  return (
    <div>
      <LiveBanner
        accentColor="#1c4532"
        label="Live · English"
        title="ENG-2025-0003 · Excess IT Assets — Data Centre Hardware Lot"
        sub="English auction · Price rises · Highest bid wins · 12 registered bidders · Min increment: SAR 50,000"
        timer="00:14:05"
        timerLabel="Remaining Time"
        icon={<TrendingUp size={14} color="#6b7280" />}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <SectionCard title="Live bid board">
          <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
            <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, margin: '0 0 8px' }}>CURRENT HIGHEST BID</p>
            <p style={{ fontSize: 40, fontWeight: 300, color: '#15803d', letterSpacing: '-.02em', margin: 0 }}>{fmtSAR(1350000)}</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '6px 0 0' }}>Leading: Bidder #7 · Bid placed 14:48:32</p>
            <p style={{ fontSize: 12, color: '#059669', margin: '4px 0 0' }}>↑ SAR 850,000 above reserve · Next min bid: SAR 1,400,000</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><th style={th}>#</th><th style={th}>Bidder</th><th style={thR}>Amount</th><th style={thR}>Time</th></tr></thead>
            <tbody>
              {ENG_ROWS.map(row => (
                <tr key={row.n} style={{ borderTop: '1px solid #f1f5f9', background: row.lead ? '#f0fdf4' : undefined }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: row.lead ? 700 : 400, color: row.lead ? '#15803d' : '#374151' }}>{row.n}</td>
                  <td style={{ padding: '10px 14px', fontWeight: row.lead ? 700 : 500, color: '#1e293b' }}>{row.bidder}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', fontWeight: row.lead ? 700 : 400, color: row.lead ? '#15803d' : '#374151' }}>{fmtSAR(row.amount)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{row.time}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <td colSpan={3} style={{ padding: '9px 14px', fontSize: 11, color: '#9ca3af' }}>Reserve price</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>{fmtSAR(500000)}</td>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Auction details</p>
            {[
              { label: 'Reserve price',        value: fmtSAR(500000), color: '#374151' },
              { label: 'Opening bid',          value: fmtSAR(500000), color: '#374151' },
              { label: 'Min increment',        value: fmtSAR(50000),  color: '#374151' },
              { label: 'Registered bidders',   value: '12',           color: '#374151' },
              { label: 'Active right now',     value: '4 bidders',    color: '#059669' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, color: '#9ca3af' }}>{row.label}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Auction controls</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Pause auction</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>End auction now</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Extend by 10 min</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Dutch Auction Room — HTML: #room-dutch                               */
/* ══════════════════════════════════════════════════════════════════════ */
const DUTCH_BARS = [
  { h: 100 }, { h: 90 }, { h: 80 }, { h: 70 }, { h: 60 }, { h: 50 }, { h: 42, now: true }, { h: 35 }, { h: 28 }, { h: 20, floor: true },
];
const DUTCH_INSTITUTIONS = [
  { name: 'National Commercial Bank', status: 'Watching' },
  { name: 'Saudi Fransi Capital',     status: 'Watching' },
  { name: 'Riyad Bank',               status: 'Watching' },
];

function DutchRoom() {
  return (
    <div>
      <LiveBanner
        accentColor="#7c3aed"
        label="Live · Dutch"
        title="DUTCH-2025-0001 · Treasury Bills — SAR 500M Issuance"
        sub="Dutch auction · Price drops automatically every 30 seconds · First to accept wins · 8 registered institutions"
        timer="00:18"
        timerLabel="Until Next Drop"
        icon={<TrendingDown size={14} color="#6b7280" />}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>
        <SectionCard title="Price clock">
          <div style={{ textAlign: 'center', padding: '24px 20px' }}>
            <p style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, margin: '0 0 10px' }}>CURRENT PRICE</p>
            <p style={{ fontSize: 52, fontWeight: 300, color: '#7c3aed', letterSpacing: '-.02em', margin: 0, lineHeight: 1 }}>{fmtSAR(4200000)}</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '8px 0 0' }}>↓ Dropping from SAR 5,000,000 · Next: SAR 4,150,000 in 18 seconds</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 24, textAlign: 'left' }}>
              {[
                { label: 'Opening price', value: fmtSAR(5000000), color: '#111827' },
                { label: 'Current price', value: fmtSAR(4200000), color: '#7c3aed' },
                { label: 'Floor price',   value: fmtSAR(3000000), color: '#111827' },
              ].map(s => (
                <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ fontSize: 10.5, color: '#9ca3af', margin: '0 0 4px' }}>{s.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: s.color, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 10px' }}>Price drop history</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50, justifyContent: 'center' }}>
                {DUTCH_BARS.map((bar, i) => (
                  <div key={i} style={{ position: 'relative', width: 22, height: `${bar.h}%`, borderRadius: '2px 2px 0 0',
                    background: bar.floor ? '#fee2e2' : bar.now ? '#f5f3ff' : (bar.h >= 60 ? '#7c3aed' : '#e2e8f0'),
                    opacity: bar.h >= 60 && !bar.now ? 0.55 + bar.h / 250 : 1,
                    border: bar.now ? '2px solid #7c3aed' : bar.floor ? '1.5px dashed #f87171' : 'none',
                    borderBottom: bar.floor ? 'none' : undefined }}>
                    {bar.now && <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#7c3aed', fontWeight: 600, whiteSpace: 'nowrap' }}>NOW</span>}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: '#c4c9d4', margin: '4px 0 0' }}>5.0M · · · · · · 4.2M (now) · · · 3.0M (floor)</p>
            </div>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: 14, textAlign: 'center', margin: '0 18px 18px' }}>
            <p style={{ fontSize: 12, color: '#6d28d9', margin: '0 0 8px' }}>Any institution can accept the current price at any moment</p>
            <button style={{ width: '100%', padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Accept SAR 4,200,000 →
            </button>
          </div>
        </SectionCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Registered institutions</p>
            {DUTCH_INSTITUTIONS.map((inst, i) => (
              <div key={inst.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < DUTCH_INSTITUTIONS.length - 1 || true ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: 12.5, color: '#374151' }}>{inst.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#059669' }}>● {inst.status}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 12.5, color: '#374151' }}>+5 institutions</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Connected</span>
            </div>
          </div>
          <div style={{ ...card(), padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 12px' }}>Host controls</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Pause price drop</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Withdraw auction</button>
              <button style={{ width: '100%', padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Adjust drop interval</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Shell                                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
export default function LiveAuctionRoom({ onNavigate }: Props) {
  const [activeRoom, setActiveRoom] = useState<RoomTab>('dynamic-reverse');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Live auction</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Real-time monitoring and auction control</p>
        </div>

        {/* Room / format tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ fontSize: 12.5, color: '#6b7280', marginRight: 2, whiteSpace: 'nowrap' }}>Preview format:</span>
          {ROOM_TABS.map(tab => {
            const active = activeRoom === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveRoom(tab.id)}
                style={{ padding: '7px 14px', borderRadius: 999, border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#1a1a1a' : '#fff', color: active ? '#fff' : '#374151', fontSize: 12.5, fontWeight: active ? 600 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#fff'; }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeRoom === 'dynamic-reverse' && <MultiRoundRoom />}
        {activeRoom === 'sealed-bid'      && <SealedBidRoom />}
        {activeRoom === 'two-envelope'    && <TwoEnvelopeRoom />}
        {activeRoom === 'multi-attribute' && <MultiAttributeRoom />}
        {activeRoom === 'hybrid'          && <HybridRoom />}
        {activeRoom === 'bafo'            && <BafoRoom />}
        {activeRoom === 'negotiation'     && <NegotiationRoom />}
        {activeRoom === 'english'         && <EnglishRoom />}
        {activeRoom === 'dutch'           && <DutchRoom />}
      </div>
    </div>
  );
}
