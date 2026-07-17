import { useState, useMemo } from 'react';
import { Search, Plus, Eye, BarChart2, Gavel, Edit2, Radio } from 'lucide-react';

interface eBidListProps {
  onNavigate: (view: string, data?: any) => void;
}

/* ── Inline types ──────────────────────────────────────────────────────── */
type eBidStatus =
  | 'Draft' | 'Published' | 'Submission Open' | 'Submission Closed'
  | 'Bids Opened' | 'Under Evaluation' | 'Awarded' | 'Cancelled';

interface BidSummary {
  id: string;
  eBidNumber: string;
  title: string;
  linkedRFQNumber: string;
  status: eBidStatus;
  bidType: 'Open' | 'Sealed' | 'Reverse Auction';
  category: string;
  department: string;
  estimatedValue: number;
  submissionDeadline: string;
  submittedCount: number;
  totalVendors: number;
}

/* ── Inline mock data ──────────────────────────────────────────────────── */
const MOCK_BIDS: BidSummary[] = [
  { id: 'EB001', eBidNumber: 'eBID-2026-001', title: 'IT Hardware Supply - Laptops & Peripherals',        linkedRFQNumber: 'RFQ-2026-102', status: 'Under Evaluation', bidType: 'Sealed',         category: 'IT Equipment',        department: 'IT Department',    estimatedValue: 450000,  submissionDeadline: '2026-05-05', submittedCount: 3, totalVendors: 5 },
  { id: 'EB002', eBidNumber: 'eBID-2026-002', title: 'Office Furniture & Fixtures Procurement',           linkedRFQNumber: 'RFQ-2026-098', status: 'Submission Open',   bidType: 'Sealed',         category: 'Furniture',           department: 'Admin',            estimatedValue: 850000,  submissionDeadline: '2026-05-25', submittedCount: 0, totalVendors: 3 },
  { id: 'EB003', eBidNumber: 'eBID-2026-003', title: 'Annual Security Services Contract',                 linkedRFQNumber: 'RFQ-2026-089', status: 'Awarded',           bidType: 'Sealed',         category: 'Security Services',   department: 'Facilities',       estimatedValue: 3600000, submissionDeadline: '2026-04-01', submittedCount: 2, totalVendors: 2 },
  { id: 'EB004', eBidNumber: 'eBID-2026-004', title: 'Printing & Stationery Supplies - Q1 2026',         linkedRFQNumber: 'RFQ-2026-015', status: 'Submission Open',   bidType: 'Open',           category: 'Office Supplies',     department: 'Procurement',      estimatedValue: 285000,  submissionDeadline: '2026-04-15', submittedCount: 3, totalVendors: 5 },
  { id: 'EB005', eBidNumber: 'eBID-2026-005', title: 'Cloud Infrastructure Services - Annual Contract',  linkedRFQNumber: 'RFQ-2026-022', status: 'Draft',             bidType: 'Sealed',         category: 'IT Services',         department: 'IT Department',    estimatedValue: 5400000, submissionDeadline: '2026-08-15', submittedCount: 0, totalVendors: 0 },
  { id: 'EB006', eBidNumber: 'eBID-2026-006', title: 'Corporate Vehicle Fleet Purchase',                 linkedRFQNumber: 'RFQ-2026-019', status: 'Published',         bidType: 'Sealed',         category: 'Vehicles',            department: 'Admin',            estimatedValue: 7200000, submissionDeadline: '2026-08-10', submittedCount: 0, totalVendors: 3 },
  { id: 'EB007', eBidNumber: 'eBID-2026-007', title: 'Medical Equipment Procurement for Health Center',  linkedRFQNumber: 'RFQ-2026-095', status: 'Submission Closed', bidType: 'Sealed',         category: 'Medical Equipment',   department: 'Health & Safety',  estimatedValue: 2850000, submissionDeadline: '2026-04-15', submittedCount: 3, totalVendors: 4 },
  { id: 'EB008', eBidNumber: 'eBID-2026-008', title: 'HVAC System Installation for New Building',        linkedRFQNumber: 'RFQ-2026-088', status: 'Bids Opened',       bidType: 'Sealed',         category: 'HVAC',                department: 'Facilities',       estimatedValue: 8500000, submissionDeadline: '2026-03-20', submittedCount: 2, totalVendors: 3 },
  { id: 'EB009', eBidNumber: 'eBID-2026-009', title: 'Network Infrastructure Upgrade - Cancelled',       linkedRFQNumber: 'RFQ-2026-076', status: 'Cancelled',         bidType: 'Sealed',         category: 'IT Infrastructure',   department: 'IT Department',    estimatedValue: 4200000, submissionDeadline: '2026-02-10', submittedCount: 1, totalVendors: 2 },
];

/* ── Helpers ───────────────────────────────────────────────────────────── */
const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

const fmtCr = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)} Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(1)} L`;
  return fmtINR(v);
};

/* ── Status chip mappings ──────────────────────────────────────────────── */
const STATUS_CHIP: Record<eBidStatus, string> = {
  'Draft':             'vw-chip vw-chip--neutral',
  'Published':         'vw-chip vw-chip--info',
  'Submission Open':   'vw-chip vw-chip--success',
  'Submission Closed': 'vw-chip vw-chip--neutral',
  'Bids Opened':       'vw-chip vw-chip--warning',
  'Under Evaluation':  'vw-chip vw-chip--warning',
  'Awarded':           'vw-chip vw-chip--neutral-solid',
  'Cancelled':         'vw-chip vw-chip--error',
};
const TYPE_CHIP: Record<string, string> = {
  'Sealed':          'vw-chip vw-chip--neutral-solid',
  'Open':            'vw-chip vw-chip--info',
  'Reverse Auction': 'vw-chip vw-chip--neutral',
};

/* ── Status filter groups ──────────────────────────────────────────────── */
const STATUS_GROUPS = [
  { key: 'live',       label: 'Live / Open',     statuses: ['Submission Open', 'Bids Opened'] as eBidStatus[] },
  { key: 'pending',    label: 'Pending Approval', statuses: ['Published'] as eBidStatus[] },
  { key: 'draft',      label: 'Draft',            statuses: ['Draft'] as eBidStatus[] },
  { key: 'evaluation', label: 'Under Evaluation', statuses: ['Submission Closed', 'Under Evaluation'] as eBidStatus[] },
  { key: 'awarded',    label: 'Awarded',          statuses: ['Awarded'] as eBidStatus[] },
];

/* ── Shared style fragments ────────────────────────────────────────────── */
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4, lineHeight: 1.3 };
const metricStyle: React.CSSProperties = { fontSize: 22, fontWeight: 300, color: '#111827', lineHeight: 1.1 };
const subStyle: React.CSSProperties = { fontSize: 11, marginTop: 4, lineHeight: 1.3 };
const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '11px 14px', verticalAlign: 'middle' };

export default function eBidList({ onNavigate }: eBidListProps) {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter]     = useState<string>('All');
  const [activeGroup, setActiveGroup]   = useState<string | null>(null);

  const filtered = useMemo(() => MOCK_BIDS.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.title.toLowerCase().includes(q) ||
      b.eBidNumber.toLowerCase().includes(q) ||
      b.linkedRFQNumber.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchType   = typeFilter === 'All'   || b.bidType === typeFilter;
    const group       = STATUS_GROUPS.find(g => g.key === activeGroup);
    const matchGroup  = !group || group.statuses.includes(b.status);
    return matchSearch && matchStatus && matchType && matchGroup;
  }), [search, statusFilter, typeFilter, activeGroup]);

  const totalValue      = MOCK_BIDS.reduce((s, b) => s + b.estimatedValue, 0);
  const savingsRealized = Math.round(totalValue * 0.142);
  const groupCount = (g: typeof STATUS_GROUPS[0]) =>
    MOCK_BIDS.filter(b => g.statuses.includes(b.status)).length;

  const handleGroupClick = (key: string) => {
    setActiveGroup(prev => prev === key ? null : key);
    setStatusFilter('All');
  };

  return (
    <div style={{ padding: '24px 20px', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--fontFamily, Poppins, sans-serif)' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>Auction</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>End-to-end electronic auctions — from RFQ to award</p>
        </div>
        <button
          onClick={() => onNavigate('ebid-create')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a1a1a', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
        >
          <Plus size={14} /> Create Auction
        </button>
      </div>

      {/* ── Portfolio KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
        {[
          { label: 'Total Auctions',           value: String(MOCK_BIDS.length), sub: '↑ 4 this month',    subColor: '#047857' },
          { label: 'Total Value Under Auction', value: fmtCr(totalValue),       sub: 'Across all statuses', subColor: '#9ca3af' },
          { label: 'Total Savings Realized',    value: fmtCr(savingsRealized),  sub: '↑ 18.4% vs budget',  subColor: '#047857' },
          { label: 'Avg Savings %',             value: '14.2%',                 sub: 'Vs start price',      subColor: '#9ca3af' },
        ].map(kpi => (
          <div key={kpi.label} style={card}>
            <p style={labelStyle}>{kpi.label}</p>
            <p style={metricStyle}>{kpi.value}</p>
            <p style={{ ...subStyle, color: kpi.subColor }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Status filter pill tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {STATUS_GROUPS.map(g => {
          const count    = groupCount(g);
          const isActive = activeGroup === g.key;
          return (
            <button
              key={g.key}
              onClick={() => handleGroupClick(g.key)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: isActive ? 600 : 400, background: isActive ? '#1a1a1a' : '#fff', color: isActive ? '#fff' : '#374151', boxShadow: isActive ? 'none' : '0 0 0 1px #e2e8f0', transition: 'all .12s' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.boxShadow = '0 0 0 1px #94a3b8'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.boxShadow = '0 0 0 1px #e2e8f0'; }}
            >
              {g.label}
              <span style={{ fontSize: 11, fontWeight: 600, minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, padding: '0 5px', background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9', color: isActive ? '#fff' : '#6b7280' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Table card ── */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          {activeGroup && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1a1a1a', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
              {STATUS_GROUPS.find(g => g.key === activeGroup)?.label}
              <button onClick={() => setActiveGroup(null)} style={{ background: 'none', border: 'none', color: '#fff', padding: 0, cursor: 'pointer', lineHeight: 1, fontSize: 14, marginLeft: 2 }}>×</button>
            </span>
          )}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by title, number, RFQ, category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 7, outline: 'none', fontFamily: 'inherit', background: '#fff', color: '#111827' }}
            />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 7, padding: '7px 10px', fontFamily: 'inherit', background: '#fff', color: '#374151', outline: 'none' }}
            >
              <option value="All">All Types</option>
              <option value="Sealed">Sealed</option>
              <option value="Open">Open</option>
              <option value="Reverse Auction">Reverse Auction</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setActiveGroup(null); }}
              style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 7, padding: '7px 10px', fontFamily: 'inherit', background: '#fff', color: '#374151', outline: 'none' }}
            >
              <option value="All">All Statuses</option>
              {(Object.keys(STATUS_CHIP) as eBidStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Auction #', 'Title', 'Type', 'Linked RFQ', 'Category', 'Vendors', 'Est. Value', 'Deadline', 'Status', ''].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bid => {
                const isLive = bid.status === 'Submission Open' || bid.status === 'Bids Opened';
                return (
                  <tr
                    key={bid.id}
                    onClick={() => onNavigate('ebid-detail', bid)}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>
                        {bid.eBidNumber.replace('eBID-', 'eAUC-')}
                      </span>
                      {isLive && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981', marginLeft: 5, verticalAlign: 'middle' }} />}
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 220 }}>
                      <span style={{ fontWeight: 500, color: '#1e293b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bid.title}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{bid.department}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <span className={TYPE_CHIP[bid.bidType] || 'vw-chip vw-chip--neutral'}>{bid.bidType}</span>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{bid.linkedRFQNumber}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#4b5563', whiteSpace: 'nowrap' }}>{bid.category}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 500, color: '#1f2937' }}>{bid.submittedCount}</span>
                      <span style={{ color: '#9ca3af', fontSize: 11 }}>/{bid.totalVendors}</span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap' }}>{fmtINR(bid.estimatedValue)}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{bid.submissionDeadline}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <span className={STATUS_CHIP[bid.status]}>{bid.status}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        <button onClick={() => onNavigate('ebid-detail', bid)} title="View"
                          style={{ padding: 5, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6, color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        ><Eye size={14} /></button>
                        {isLive && (
                          <button onClick={() => onNavigate('live-auction-room', bid)} title="Live Room"
                            style={{ padding: 5, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6, color: '#047857', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#ecfdf5')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          ><Radio size={14} /></button>
                        )}
                        {bid.status === 'Under Evaluation' && (
                          <button onClick={() => onNavigate('ebid-detail', { ...bid, _tab: 'evaluation' })} title="Evaluate"
                            style={{ padding: 5, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6, color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          ><BarChart2 size={14} /></button>
                        )}
                        {bid.status === 'Draft' && (
                          <button onClick={() => onNavigate('ebid-create', bid)} title="Edit"
                            style={{ padding: 5, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6, color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          ><Edit2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: '48px 16px', textAlign: 'center' }}>
              <Gavel size={26} color="#d1d5db" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>No auctions match your filters.</p>
              <button
                onClick={() => { setSearch(''); setStatusFilter('All'); setTypeFilter('All'); setActiveGroup(null); }}
                style={{ marginTop: 8, fontSize: 12, color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >Clear filters</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Showing {filtered.length} of {MOCK_BIDS.length} auctions</p>
          {activeGroup && (
            <button onClick={() => setActiveGroup(null)} style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Show all statuses
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
