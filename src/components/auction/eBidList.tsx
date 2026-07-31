"use client";
import { useState, useMemo } from 'react';
import { Search, Plus, Gavel, RefreshCw, Download, Columns3 } from 'lucide-react';
import { MOCK_AUCTIONS, fmtSAR, AuctionStatus } from './auctionData';

interface eBidListProps {
  onNavigate: (view: string, data?: any) => void;
}

/* ── Status chip mappings ──────────────────────────────────────────────── */
const STATUS_CHIP: Record<AuctionStatus, string> = {
  'Live':              'vw-chip vw-chip--error',
  'Pending approval':  'vw-chip vw-chip--warning',
  'Draft':             'vw-chip vw-chip--neutral',
  'Awarded':           'vw-chip vw-chip--info',
  'Closed':            'vw-chip vw-chip--neutral-solid',
};

const CATEGORIES = Array.from(new Set(MOCK_AUCTIONS.map(b => b.category))).sort();

/* ── Shared style fragments ────────────────────────────────────────────── */
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 };
const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '11px 14px', verticalAlign: 'middle' };
const filterChipStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999,
  border: '1px solid #e2e8f0', background: active ? '#1a1a1a' : '#fff', color: active ? '#fff' : '#374151',
  fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
});
const iconBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'transparent', border: '1px solid transparent', color: '#6b7280', cursor: 'pointer' };

export default function eBidList({ onNavigate }: eBidListProps) {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showStatusMenu, setShowStatusMenu]   = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const filtered = useMemo(() => MOCK_AUCTIONS.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.title.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchCategory = categoryFilter === 'All' || b.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  }), [search, statusFilter, categoryFilter]);

  return (
    <div style={{ padding: '24px 20px', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--fontFamily, Poppins, sans-serif)' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>All auctions</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Every reverse auction created by your team</p>
        </div>
        <button
          onClick={() => onNavigate('ebid-create')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a1a1a', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
        >
          <Plus size={14} /> New auction
        </button>
      </div>

      {/* ── Table card ── */}
      <div style={{ ...card, overflow: 'visible' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: '#6b7280', whiteSpace: 'nowrap' }}>Displaying {filtered.length} of {MOCK_AUCTIONS.length}</span>

          <div style={{ position: 'relative', minWidth: 180 }}>
            <Search size={14} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6, fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 7, outline: 'none', fontFamily: 'inherit', background: '#fff', color: '#111827' }}
            />
          </div>

          {/* Status filter chip */}
          <div style={{ position: 'relative' }}>
            <button style={filterChipStyle(statusFilter !== 'All')} onClick={() => { setShowStatusMenu(v => !v); setShowCategoryMenu(false); }}>
              Status{statusFilter !== 'All' ? `: ${statusFilter}` : ''}
            </button>
            {showStatusMenu && (
              <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.08)', zIndex: 10, minWidth: 160, overflow: 'hidden' }}>
                {['All', ...(Object.keys(STATUS_CHIP) as AuctionStatus[])].map(s => (
                  <div key={s} onClick={() => { setStatusFilter(s); setShowStatusMenu(false); }}
                    style={{ padding: '8px 12px', fontSize: 12.5, cursor: 'pointer', color: s === statusFilter ? '#111827' : '#374151', fontWeight: s === statusFilter ? 600 : 400, background: s === statusFilter ? '#f8fafc' : '#fff' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = s === statusFilter ? '#f8fafc' : '#fff')}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category filter chip */}
          <div style={{ position: 'relative' }}>
            <button style={filterChipStyle(categoryFilter !== 'All')} onClick={() => { setShowCategoryMenu(v => !v); setShowStatusMenu(false); }}>
              Category{categoryFilter !== 'All' ? `: ${categoryFilter}` : ''}
            </button>
            {showCategoryMenu && (
              <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.08)', zIndex: 10, minWidth: 200, maxHeight: 280, overflowY: 'auto' }}>
                {['All', ...CATEGORIES].map(c => (
                  <div key={c} onClick={() => { setCategoryFilter(c); setShowCategoryMenu(false); }}
                    style={{ padding: '8px 12px', fontSize: 12.5, cursor: 'pointer', color: c === categoryFilter ? '#111827' : '#374151', fontWeight: c === categoryFilter ? 600 : 400, background: c === categoryFilter ? '#f8fafc' : '#fff' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = c === categoryFilter ? '#f8fafc' : '#fff')}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            <button title="Refresh" style={iconBtnStyle} onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}><RefreshCw size={15} /></button>
            <button title="Export" style={iconBtnStyle} onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}><Download size={15} /></button>
            <button title="Columns" style={iconBtnStyle} onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}><Columns3 size={15} /></button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Auction ID', 'Title', 'Category', 'Format', 'Items', 'Start price', 'Suppliers', 'Start date', 'End date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bid => {
                const isLive = bid.status === 'Live';
                const actionLabel = isLive ? 'Join' : bid.status === 'Draft' ? 'Edit' : bid.status === 'Pending approval' ? 'Review' : 'Results';
                const goAction = () => {
                  if (isLive) onNavigate('live-auction-room', bid);
                  else if (bid.status === 'Draft') onNavigate('ebid-create', bid);
                  else if (bid.status === 'Pending approval') onNavigate('ebid-detail', bid);
                  else onNavigate('compare-bids', bid);
                };
                return (
                  <tr
                    key={bid.id}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ ...tdStyle, cursor: 'pointer' }} onClick={() => onNavigate('ebid-detail', bid)}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280' }}>{bid.id}</span>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 220, cursor: 'pointer' }} onClick={() => onNavigate('ebid-detail', bid)}>
                      <span style={{ fontWeight: 500, color: '#1e293b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bid.title}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12, color: '#4b5563', whiteSpace: 'nowrap' }}>{bid.category}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: 12, color: '#4b5563' }}>{bid.format}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{bid.items}</td>
                    <td style={{ ...tdStyle, fontWeight: 500, color: '#1f2937', whiteSpace: 'nowrap' }}>{fmtSAR(bid.startPrice)}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{bid.suppliers}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{bid.startDate}</td>
                    <td style={{ ...tdStyle, fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{bid.endDate}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <span className={STATUS_CHIP[bid.status]}>{bid.status}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <button onClick={goAction}
                        style={{ padding: '5px 12px', background: isLive ? '#1a1a1a' : '#fff', color: isLive ? '#fff' : '#374151', border: isLive ? 'none' : '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {actionLabel}
                      </button>
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
                onClick={() => { setSearch(''); setStatusFilter('All'); setCategoryFilter('All'); }}
                style={{ marginTop: 8, fontSize: 12, color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
