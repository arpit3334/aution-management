import { useState } from 'react';
import {
  Clock, Zap, ArrowLeft, CheckCircle, Shield, AlertCircle,
  Send, Award, Lock, GitMerge, MessageSquare, Flag, Layers,
  Mail, BarChart2, TrendingUp, Timer
} from 'lucide-react';

const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

interface Props { onNavigate: (view: string, data?: any) => void; data?: any; }
type RoomTab = 'multi-round' | 'sealed-bid' | 'hybrid' | 'negotiation' | 'bafo' | 'two-envelope' | 'multi-attribute' | 'english' | 'dutch';

const ROOM_TABS: { id: RoomTab; label: string; icon: any }[] = [
  { id: 'multi-round', label: 'Multi-Round',  icon: Layers },
  { id: 'sealed-bid',  label: 'Sealed Bid',   icon: Lock },
  { id: 'hybrid',      label: 'Hybrid',       icon: GitMerge },
  { id: 'negotiation', label: 'Negotiation',  icon: MessageSquare },
  { id: 'bafo',        label: 'BAFO',         icon: Flag },
  { id: 'two-envelope',label: 'Two-Envelope', icon: Mail },
  { id: 'multi-attribute',label: 'Multi-Attribute', icon: BarChart2 },
  { id: 'english',     label: 'English',      icon: TrendingUp },
  { id: 'dutch',       label: 'Dutch',        icon: Timer },
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
/* ══════════════════════════════════════════════════════════════════════ */
/*  Two-Envelope Room                                                     */
/* ══════════════════════════════════════════════════════════════════════ */
function TwoEnvelopeRoom() {
  const [tab, setTab] = useState<'phase1' | 'phase2'>('phase1');
  const rows = [
    { supplier: 'SAP SE',         score: 88, status: 'Qualified',    evaluator: 'Mariam Al-Dosari' },
    { supplier: 'Oracle Arabia',  score: 84, status: 'Qualified',    evaluator: 'Mariam Al-Dosari' },
    { supplier: 'Microsoft MENA', score: 79, status: 'Qualified',    evaluator: 'Abdulaziz Alrashed' },
    { supplier: 'Infor Gulf',     score: 74, status: 'Qualified',    evaluator: 'Abdulaziz Alrashed' },
    { supplier: 'IFS Arabia',     score: 63, status: 'Disqualified', evaluator: 'Sourabh Jain' },
    { supplier: 'Epicor KSA',     score: 58, status: 'Disqualified', evaluator: 'Sourabh Jain' },
    { supplier: 'Unit4 Arabia',   score: -1, status: 'Pending',      evaluator: '—' },
  ];

  return (
    <div>
      <div style={{ background: '#1e293b', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>AUC-2025-0050 · Enterprise ERP System Replacement</p>
            <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0 }}>Two-envelope · Phase 1 of 2 · Technical envelopes open · 7 suppliers submitted</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 26, fontWeight: 300, fontFamily: 'monospace', color: '#fff', margin: 0 }}>—</p>
            <p style={{ fontSize: 10.5, color: '#cbd5e1', margin: '3px 0 0', letterSpacing: '.03em' }}>EVALUATION IN PROGRESS</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
        <button onClick={() => setTab('phase1')}
          style={{ padding: '10px 16px', fontSize: 13, fontWeight: tab === 'phase1' ? 600 : 500, color: tab === 'phase1' ? '#111827' : '#6b7280', borderBottom: tab === 'phase1' ? '2px solid #111827' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>
          Phase 1 · Technical opening (live)
        </button>
        <button onClick={() => alert('Commercial envelopes are locked until technical evaluation is complete.')}
          style={{ padding: '10px 16px', fontSize: 13, fontWeight: tab === 'phase2' ? 600 : 500, color: tab === 'phase2' ? '#111827' : '#6b7280', borderBottom: tab === 'phase2' ? '2px solid #111827' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>
          Phase 2 · Commercial opening (locked)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <SectionCard title="Technical evaluation" badge={<Chip status="Pending" />}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr><th style={th}>Supplier</th><th style={th}>Technical score</th><th style={th}>Pass mark</th><th style={th}>Status</th><th style={th}>Evaluator</th></tr></thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.supplier} style={{ borderTop: '1px solid #f1f5f9', background: row.score === -1 ? '#fffbeb' : undefined }}>
                    <td style={{ padding: '11px 14px', fontWeight: 500, color: '#111827' }}>{row.supplier}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.score === -1 ? '—' : row.score} / 100</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>70</td>
                    <td style={{ padding: '11px 14px' }}>
                      <Chip status={row.status === 'Qualified' ? 'Active' : row.status === 'Disqualified' ? 'Idle' : 'Pending'} />
                    </td>
                    <td style={{ padding: '11px 14px' }}>{row.evaluator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
          <div style={{ ...card(), background: '#eff6ff', borderColor: '#dbeafe', marginTop: 14 }}>
            <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={20} color="#2563eb" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12.5, color: '#1e40af', margin: 0 }}><b>Commercial envelopes unlock</b> once all technical scores are entered and the evaluation lead approves. Disqualified suppliers will be notified before commercial bids are opened.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionCard title="Opening summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Submissions received</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>7 of 7 invited</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Technically qualified</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#16a34a' }}>4 suppliers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Disqualified</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#dc2626' }}>2 suppliers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Pending score</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#d97706' }}>1 supplier</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Commercial opens</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>After approval</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Evaluation actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Add evaluator score</button>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>View evaluation criteria</button>
              <button onClick={() => alert('All 7 scores must be entered before commercial envelopes can be unlocked.')} style={{ padding: '8px 16px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Approve and unlock commercial</button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Multi-Attribute Room                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
function MultiAttributeRoom() {
  const rows = [
    { rank: 1, supplier: 'Accenture Gulf',   tech: 88, comm: 82, risk: 90, supp: 85, esg: 78, overall: 86.3, time: '14:43:52' },
    { rank: 2, supplier: 'Deloitte MENA',    tech: 92, comm: 76, risk: 88, supp: 90, esg: 92, overall: 85.8, time: '14:41:30' },
    { rank: 3, supplier: 'McKinsey Arabia',  tech: 95, comm: 68, risk: 92, supp: 88, esg: 80, overall: 84.2, time: '14:38:04' },
    { rank: 4, supplier: 'PwC Gulf',         tech: 82, comm: 80, risk: 85, supp: 82, esg: 88, overall: 82.6, time: '14:35:19' },
  ];

  return (
    <div>
      <div style={{ background: '#1e3a5f', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>AUC-2025-0052 · Digital Transformation Consulting — Phase 3</p>
            <p style={{ fontSize: 12, color: '#93c5fd', margin: 0 }}>Multi-attribute auction · Technical 45% · Commercial 30% · Risk 10% · Support 10% · ESG 5%</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 26, fontWeight: 300, fontFamily: 'monospace', color: '#fff', margin: 0 }}>00:38:22</p>
            <p style={{ fontSize: 10.5, color: '#fff', margin: '3px 0 0', letterSpacing: '.03em' }}>REMAINING TIME</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div>
          <SectionCard title="Weighted score leaderboard">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={th}>Rank</th>
                  <th style={th}>Supplier</th>
                  <th style={{ ...th, color: '#3b82f6' }}>Technical<br/><span style={{ fontWeight: 400, fontSize: 10 }}>45%</span></th>
                  <th style={{ ...th, color: '#10b981' }}>Commercial<br/><span style={{ fontWeight: 400, fontSize: 10 }}>30%</span></th>
                  <th style={{ ...th, color: '#ef4444' }}>Risk<br/><span style={{ fontWeight: 400, fontSize: 10 }}>10%</span></th>
                  <th style={{ ...th, color: '#eab308' }}>Support<br/><span style={{ fontWeight: 400, fontSize: 10 }}>10%</span></th>
                  <th style={{ ...th, color: '#84cc16' }}>ESG<br/><span style={{ fontWeight: 400, fontSize: 10 }}>5%</span></th>
                  <th style={th}>Overall</th>
                  <th style={th}>Last bid</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.rank} style={{ borderTop: '1px solid #f1f5f9', background: row.rank === 1 ? '#fffbeb' : undefined }}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: row.rank === 1 ? '#f59e0b' : row.rank === 2 ? '#94a3b8' : row.rank === 3 ? '#cd7f32' : '#e2e8f0', color: row.rank === 4 ? '#475569' : '#fff', fontSize: 10.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {row.rank}
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', fontWeight: 500, color: '#111827' }}>{row.supplier}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.tech}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.comm} {row.rank === 1 && <span style={{ fontSize: 10, color: '#16a34a' }}>↑</span>}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.risk}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.supp}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.esg}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontWeight: 'bold', color: row.rank === 1 ? '#d97706' : undefined }}>{row.overall}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 11 }}>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
          <div style={{ ...card(), background: '#fffbeb', borderColor: '#fde68a', marginTop: 14 }}>
            <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12.5, color: '#92400e', margin: 0 }}><b>Suppliers see only their own overall score and rank</b> — not the individual attribute breakdown, not other suppliers' names or scores. This prevents gaming the scoring model.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: 12, padding: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', margin: '0 0 12px' }}>Score simulation</p>
            <p style={{ fontSize: 12, color: '#1d4ed8', margin: 0 }}>If Deloitte improves commercial score from 76 → 85, their overall moves from 85.8 → 88.5, taking rank 1.</p>
          </div>
          <SectionCard title="Auction controls">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Pause auction</button>
              <button style={{ padding: '8px 16px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>End auction now</button>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Send message</button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  English Auction Room                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
function EnglishRoom() {
  const rows = [
    { num: 1, bidder: 'Bidder #7', amount: 'SAR 1,350,000', time: '14:48:32' },
    { num: 2, bidder: 'Bidder #3', amount: 'SAR 1,300,000', time: '14:47:18' },
    { num: 3, bidder: 'Bidder #7', amount: 'SAR 1,250,000', time: '14:46:05' },
    { num: 4, bidder: 'Bidder #11',amount: 'SAR 1,200,000', time: '14:44:50' },
    { num: 5, bidder: 'Bidder #3', amount: 'SAR 1,150,000', time: '14:43:30' },
    { num: 6, bidder: 'Bidder #9', amount: 'SAR 1,100,000', time: '14:41:15' },
    { num: 7, bidder: 'Bidder #2', amount: 'SAR 1,050,000', time: '14:39:02' },
    { num: 8, bidder: 'Bidder #7', amount: 'SAR 1,000,000', time: '14:37:00' },
  ];

  return (
    <div>
      <div style={{ background: '#1c4532', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>ENG-2025-0003 · Excess IT Assets — Data Centre Hardware Lot</p>
            <p style={{ fontSize: 12, color: '#6ee7b7', margin: 0 }}>English auction · Price rises · Highest bid wins · 12 registered bidders · Min increment: SAR 50,000</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 26, fontWeight: 300, fontFamily: 'monospace', color: '#fff', margin: 0 }}>00:14:05</p>
            <p style={{ fontSize: 10.5, color: '#fff', margin: '3px 0 0', letterSpacing: '.03em' }}>REMAINING TIME</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <SectionCard title="Live bid board">
            <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>CURRENT HIGHEST BID</div>
              <div style={{ fontSize: 40, fontWeight: 300, color: '#15803d', letterSpacing: '-.02em' }}>SAR 1,350,000</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>Leading: Bidder #7 · Bid placed 14:48:32</div>
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>↑ SAR 850,000 above reserve · Next min bid: SAR 1,400,000</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr><th style={th}>#</th><th style={th}>Bidder</th><th style={th}>Amount</th><th style={th}>Time</th></tr></thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.num} style={{ borderTop: '1px solid #f1f5f9', background: row.num === 1 ? '#f0fdf4' : undefined }}>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontWeight: row.num === 1 ? 'bold' : 'normal', color: row.num === 1 ? '#15803d' : undefined }}>{row.num}</td>
                    <td style={{ padding: '11px 14px', fontWeight: row.num === 1 ? 'bold' : 'normal' }}>{row.bidder}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontWeight: row.num === 1 ? 'bold' : 'normal', color: row.num === 1 ? '#15803d' : undefined }}>{row.amount}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{row.time}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                  <td colSpan={2} style={{ padding: '11px 14px', fontSize: 11, color: '#6b7280' }}>Reserve price</td>
                  <td colSpan={2} style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>SAR 500,000</td>
                </tr>
              </tbody>
            </table>
          </SectionCard>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard title="Auction details">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Reserve price</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>SAR 500,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Opening bid</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>SAR 500,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Min increment</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>SAR 50,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Registered bidders</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#111827' }}>12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.4px' }}>Active right now</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#16a34a' }}>4 bidders</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Auction controls">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Pause auction</button>
              <button style={{ padding: '8px 16px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>End auction now</button>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Extend by 10 min</button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  Dutch Auction Room                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
function DutchRoom() {
  return (
    <div>
      <div style={{ background: '#7c3aed', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>DUTCH-2025-0001 · Treasury Bills — SAR 500M Issuance</p>
            <p style={{ fontSize: 12, color: '#ddd6fe', margin: 0 }}>Dutch auction · Price drops automatically every 30 seconds · First to accept wins · 8 registered institutions</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 26, fontWeight: 300, fontFamily: 'monospace', color: '#fff', margin: 0 }}>00:18</p>
            <p style={{ fontSize: 10.5, color: '#ddd6fe', margin: '3px 0 0', letterSpacing: '.03em' }}>UNTIL NEXT DROP</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <SectionCard title="Price clock">
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 10 }}>CURRENT PRICE</div>
            <div style={{ fontSize: 52, fontWeight: 300, color: '#7c3aed', letterSpacing: '-.02em', lineHeight: 1 }}>SAR 4,200,000</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>↓ Dropping from SAR 5,000,000 · Next: SAR 4,150,000 in 18 seconds</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 24, textAlign: 'left', padding: '0 24px' }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Opening price</div>
                <div style={{ fontSize: 16, color: '#111827' }}>SAR 5,000,000</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Current price</div>
                <div style={{ fontSize: 16, color: '#7c3aed' }}>SAR 4,200,000</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>Floor price</div>
                <div style={{ fontSize: 16, color: '#111827' }}>SAR 3,000,000</div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, background: '#e2e8f0', borderRadius: 1 }}></div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Price drop history</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50, justifyContent: 'center' }}>
                <div style={{ width: 22, background: '#7c3aed', height: '100%', opacity: .9, borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#7c3aed', height: '90%', opacity: .85, borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#7c3aed', height: '80%', opacity: .8, borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#7c3aed', height: '70%', opacity: .75, borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#7c3aed', height: '60%', opacity: .7, borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#7c3aed', height: '50%', opacity: .65, borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#7c3aed', height: '42%', opacity: .6, borderRadius: '2px 2px 0 0', border: '2px solid #7c3aed', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#7c3aed', whiteSpace: 'nowrap', fontWeight: 600 }}>NOW</div>
                </div>
                <div style={{ width: 22, background: '#e2e8f0', height: '35%', borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#e2e8f0', height: '28%', borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: 22, background: '#fee2e2', height: '20%', borderRadius: '2px 2px 0 0', borderTop: '1.5px dashed #f87171' }}></div>
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}>5.0M · · · · · · 4.2M (now) · · · 3.0M (floor)</div>
            </div>
          </div>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: 14, textAlign: 'center', margin: '0 24px 24px' }}>
            <div style={{ fontSize: 12, color: '#6d28d9', marginBottom: 6 }}>Any institution can accept the current price at any moment</div>
            <button onClick={() => alert('DUTCH-2025-0001 accepted at SAR 4,200,000 by Institution #3\n\nAuction ended 14:49:18. Award initiated.')} style={{ background: '#7c3aed', color: '#fff', width: '100%', justifyContent: 'center', fontSize: 15, padding: '10px 22px', border: 'none', borderRadius: 12, fontWeight: 500, cursor: 'pointer' }}>Accept SAR 4,200,000 →</button>
          </div>
        </SectionCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard title="Registered institutions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>National Commercial Bank</span><span style={{ color: '#16a34a', fontWeight: 600, fontSize: 11 }}>● Watching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Saudi Fransi Capital</span><span style={{ color: '#16a34a', fontWeight: 600, fontSize: 11 }}>● Watching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Riyad Bank</span><span style={{ color: '#16a34a', fontWeight: 600, fontSize: 11 }}>● Watching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0' }}>
                <span>+5 institutions</span><span style={{ color: '#6b7280', fontSize: 11 }}>Connected</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Host controls">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Pause price drop</button>
              <button style={{ padding: '8px 16px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Withdraw auction</button>
              <button style={{ padding: '8px 16px', background: '#fff', color: '#111827', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Adjust drop interval</button>
            </div>
          </SectionCard>
        </div>
      </div>
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
        {activeRoom === 'two-envelope'&& <TwoEnvelopeRoom />}
        {activeRoom === 'multi-attribute'&& <MultiAttributeRoom />}
        {activeRoom === 'english'     && <EnglishRoom />}
        {activeRoom === 'dutch'       && <DutchRoom />}
      </div>
    </div>
  );
}
