import { useState } from 'react';
import {
  Clock, Zap, ArrowLeft, CheckCircle, Shield, AlertCircle,
  Send, Award, Lock, GitMerge, MessageSquare, Flag, Layers,
} from 'lucide-react';

const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

interface Props { onNavigate: (view: string, data?: any) => void; data?: any; }
type RoomTab = 'multi-round' | 'sealed-bid' | 'hybrid' | 'negotiation' | 'bafo';

const ROOM_TABS: { id: RoomTab; label: string; icon: any }[] = [
  { id: 'multi-round', label: 'Multi-Round',  icon: Layers },
  { id: 'sealed-bid',  label: 'Sealed Bid',   icon: Lock },
  { id: 'hybrid',      label: 'Hybrid',       icon: GitMerge },
  { id: 'negotiation', label: 'Negotiation',  icon: MessageSquare },
  { id: 'bafo',        label: 'BAFO',         icon: Flag },
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
/*  Multi-Round Room                                                      */
/* ══════════════════════════════════════════════════════════════════════ */
const MR_ROWS = [
  { rank: 1, supplier: 'Lenovo Middle East FZE', laptop: 4250, monitor: 1420, docking: 790,  total: 323000, savings: 11.5, lastBid: '14:36:04' },
  { rank: 2, supplier: 'Dell Technologies KSA',   laptop: 4380, monitor: 1450, docking: 820,  total: 332500, savings: 8.9,  lastBid: '14:35:12' },
  { rank: 3, supplier: 'HP Inc Arabia',            laptop: 4520, monitor: 1480, docking: 850,  total: 342500, savings: 6.2,  lastBid: '14:34:51' },
  { rank: 4, supplier: 'Acer Gulf Distribution',   laptop: 4650, monitor: 1530, docking: 880,  total: 353000, savings: 3.3,  lastBid: '14:33:29' },
  { rank: 5, supplier: 'Samsung Gulf',             laptop: 4750, monitor: 1580, docking: 920,  total: 362500, savings: 0.7,  lastBid: '14:30:08' },
];
const ACT_LOG = [
  { time: '14:36:04', supplier: 'Lenovo Middle East FZE', item: 'Laptop',  newBid: 4250, prev: 4300, change: -1.2 },
  { time: '14:35:12', supplier: 'Dell Technologies KSA',   item: 'Monitor', newBid: 1450, prev: 1480, change: -2.0 },
  { time: '14:34:51', supplier: 'HP Inc Arabia',            item: 'Docking', newBid: 850,  prev: 870,  change: -2.3 },
  { time: '14:33:29', supplier: 'Acer Gulf Distribution',   item: 'Laptop',  newBid: 4650, prev: 4700, change: -1.1 },
  { time: '14:32:10', supplier: 'Samsung Gulf',             item: 'Monitor', newBid: 1580, prev: 1600, change: -1.3 },
  { time: '14:31:05', supplier: 'Lenovo Middle East FZE',  item: 'Docking', newBid: 790,  prev: 810,  change: -2.5 },
  { time: '14:30:08', supplier: 'Samsung Gulf',             item: 'Laptop',  newBid: 4750, prev: 4800, change: -1.0 },
];

function MultiRoundRoom() {
  const [itemTab, setItemTab] = useState('All Items');
  const itemTabs = ['All Items', 'Laptop', 'Monitor', 'Docking'];

  return (
    <div>
      <LiveBanner
        accentColor="#ef4444"
        label="Live · Multi-Round"
        title="AUC-2026-0041 · IT Hardware — Laptops & Monitors Q2"
        sub="Round 2 of 3 · 5 Suppliers"
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
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>{fmtINR(row.laptop)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>{fmtINR(row.monitor)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#374151' }}>{fmtINR(row.docking)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmtINR(row.total)}</td>
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
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmtINR(log.newBid)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: '#9ca3af' }}>{fmtINR(log.prev)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>↓{Math.abs(log.change)}%</td>
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
                { label: 'Current Saving', value: '₹42K', color: '#059669' },
                { label: 'Saving %',       value: '11.5%', color: '#059669' },
                { label: 'vs Budget Price',value: '₹23K',  color: '#374151' },
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
/*  Sealed Bid Room                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
const SB_SUPPLIERS = [
  { name: 'Oracle Middle East',  status: 'Submitted',     time: '10:14:22' },
  { name: 'Microsoft Gulf FZE',  status: 'Submitted',     time: '11:02:05' },
  { name: 'SAP Arabia',          status: 'Submitted',     time: '09:48:33' },
  { name: 'Salesforce MENA',     status: 'Not Submitted', time: '—' },
  { name: 'ServiceNow KSA',      status: 'Not Submitted', time: '—' },
  { name: 'Zoho Corp',           status: 'Submitted',     time: '12:20:17' },
];

function SealedBidRoom() {
  return (
    <div>
      <LiveBanner
        accentColor="#374151"
        label="Sealed Bid"
        title="AUC-2026-0044 · Annual Software Licensing Renewal"
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
            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>All bids will be automatically revealed and ranked when the deadline expires. Suppliers cannot view competitor bids until opening.</p>
          </div>
          <div style={{ ...card(), padding: 0 }}>
            {[
              { label: 'Opening Date', value: '16 Jul 2026' },
              { label: 'Opening Time', value: '17:00 AST' },
              { label: 'Attendees', value: 'Panel + Suppliers' },
              { label: 'Bid Revision', value: 'Not Allowed' },
              { label: 'Submitted', value: '4 / 6' },
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
/*  Hybrid Room                                                           */
/* ══════════════════════════════════════════════════════════════════════ */
function HybridRoom() {
  const [phase, setPhase] = useState<'phase1' | 'phase2'>('phase1');
  const phase1Rows = [
    { rank: 1, supplier: 'Accenture Gulf',   bid: 2140000, status: 'Shortlisted' },
    { rank: 2, supplier: 'TCS Middle East',  bid: 2280000, status: 'Shortlisted' },
    { rank: 3, supplier: 'Wipro Gulf',       bid: 2410000, status: 'Shortlisted' },
    { rank: 4, supplier: 'Orbis Technology', bid: 2650000, status: 'Not Shortlisted' },
  ];
  const phase2Rows = [
    { supplier: 'Accenture Gulf',  status: 'Submitted', time: '09:22:11' },
    { supplier: 'TCS Middle East', status: 'Submitted', time: '10:05:44' },
    { supplier: 'Wipro Gulf',      status: 'Pending',   time: '—' },
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
            <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>AUC-2026-0046 · Enterprise Cloud Migration Services</p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>4 Suppliers</p>
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
        <SectionCard title="Phase 1 Final Rankings" badge={<Chip status="Locked" />}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr><th style={th}>Rank</th><th style={th}>Supplier</th><th style={thR}>Bid</th><th style={thR}>Status</th></tr></thead>
            <tbody>
              {phase1Rows.map(row => (
                <tr key={row.rank} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '11px 14px', fontWeight: 700, color: '#6b7280', fontSize: 11 }}>#{row.rank}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1e293b' }}>{row.supplier}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmtINR(row.bid)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right' }}><Chip status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      ) : (
        <SectionCard title="Phase 2 — Sealed Finale">
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
/*  Negotiation Room                                                      */
/* ══════════════════════════════════════════════════════════════════════ */
function NegotiationRoom() {
  const [selected, setSelected] = useState(0);
  const [counterOffer, setCounterOffer] = useState('');
  const suppliers = [
    { name: 'G4S Saudi Arabia',      status: 'Active' },
    { name: 'SecureGuard KSA',        status: 'Idle' },
    { name: 'Falcon Protection Group',status: 'Idle' },
  ];
  const messages = [
    { from: 'supplier', text: 'We can offer ₹18,40,000 for the full contract scope including 24×7 coverage.', time: '09:14' },
    { from: 'buyer',    text: 'Thank you. Our budget is tighter. Can you revise to ₹17,50,000?',              time: '09:22' },
    { from: 'supplier', text: 'We can meet at ₹17,80,000. This is our best offer without reducing headcount.', time: '09:45' },
    { from: 'buyer',    text: 'Noted. We will consider and revert.',                                            time: '10:01' },
  ];

  return (
    <div>
      <LiveBanner
        accentColor="#0369a1"
        label="Negotiation · Round 2 of Max 3"
        title="AUC-2026-0048 · Executive Security Services Contract"
        sub="Private negotiation mode"
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
                <div style={{ maxWidth: '60%', padding: '10px 14px', borderRadius: 12, background: msg.from === 'buyer' ? '#374151' : '#f1f5f9', color: msg.from === 'buyer' ? '#fff' : '#374151' }}>
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
/*  BAFO Room                                                             */
/* ══════════════════════════════════════════════════════════════════════ */
function BafoRoom() {
  const rows = [
    { supplier: 'Cisco Systems Gulf',    priorBid: 4820000, status: 'Submitted', time: '08:44:10' },
    { supplier: 'Huawei Enterprise KSA', priorBid: 4950000, status: 'Submitted', time: '09:12:55' },
    { supplier: 'Juniper Networks ME',   priorBid: 5100000, status: 'Pending',   time: '—' },
    { supplier: 'Aruba Networks',        priorBid: 5240000, status: 'Pending',   time: '—' },
  ];

  return (
    <div>
      <LiveBanner
        accentColor="#b45309"
        label="BAFO — Best and Final Offer"
        title="AUC-2026-0037 · Network Infrastructure — Switches & Routers"
        sub="Final sealed round · 4 suppliers"
        timer="05:47:12"
        timerLabel="Until BAFO Deadline"
        icon={<Award size={14} color="#6b7280" />}
      />
      <AlertBanner
        icon={<AlertCircle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />}
        text="This is the final round. Suppliers may submit only one revised offer. No further rounds will follow after the deadline."
      />
      <SectionCard title="BAFO Submissions">
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
                <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, color: '#374151' }}>{fmtINR(row.priorBid)}</td>
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
/*  Shell                                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
export default function LiveAuctionRoom({ onNavigate }: Props) {
  const [activeRoom, setActiveRoom] = useState<RoomTab>('multi-round');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => onNavigate('ebid-list')}
            style={{ padding: 7, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Live Auction Room</h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Real-time monitoring and auction control</p>
          </div>
        </div>

        {/* Room tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 20 }}>
          {ROOM_TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeRoom === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveRoom(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, border: 'none', background: active ? '#1a1a1a' : 'transparent', color: active ? '#fff' : '#6b7280', fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeRoom === 'multi-round' && <MultiRoundRoom />}
        {activeRoom === 'sealed-bid'  && <SealedBidRoom />}
        {activeRoom === 'hybrid'      && <HybridRoom />}
        {activeRoom === 'negotiation' && <NegotiationRoom />}
        {activeRoom === 'bafo'        && <BafoRoom />}
      </div>
    </div>
  );
}
