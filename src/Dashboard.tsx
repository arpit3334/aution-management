import {
  totalAuctions, totalValue, statusBreakdown, upcomingAuctions,
  fmtSARM1, fmtSARM2, TOTAL_SAVINGS_REALIZED,
} from './auctionData';

interface Props {
  onNavigate: (view: string, data?: any) => void;
}

// "go" matches the HTML's own onclick targets exactly (navTo('live') / 'create' / 'compare' / 'reports').
const STATUS_META: Record<string, { badgeClass: string; onValue: string; note: string; go: string }> = {
  'Live':             { badgeClass: 'vw-chip vw-chip--error',   onValue: 'in play',            note: 'Bidding closes today',       go: 'live-auction-room' },
  'Pending approval': { badgeClass: 'vw-chip vw-chip--warning', onValue: 'awaiting sign-off',   note: 'Oldest waiting 2 days',      go: 'ebid-list' },
  'Draft':            { badgeClass: 'vw-chip vw-chip--neutral', onValue: 'not yet published',   note: 'Needs items or suppliers',   go: 'ebid-list' },
  'Awarded':          { badgeClass: 'vw-chip vw-chip--info',    onValue: 'awarded to date',     note: 'Converting to PO',           go: 'compare-bids' },
  'Closed':           { badgeClass: 'vw-chip vw-chip--neutral-solid', onValue: 'final value',   note: 'Fully settled',              go: 'reports' },
};

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' };
const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#6b7280', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '11px 14px', verticalAlign: 'middle' };

export default function Dashboard({ onNavigate }: Props) {
  const breakdown = statusBreakdown();
  const upcoming = upcomingAuctions();

  return (
    <div style={{ padding: '24px 20px', minHeight: '100vh', background: '#f8fafc', fontFamily: 'inherit' }}>

      {/* Overview */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>Auction overview</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>Portfolio status across all reverse auctions · FY2025</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        <div style={card}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 4px' }}>Total auctions</p>
          <p style={{ fontSize: 26, fontWeight: 300, color: '#111827', margin: '0 0 4px' }}>{totalAuctions}</p>
          <p style={{ fontSize: 11, color: '#059669', margin: 0 }}>↑ 4 this month</p>
        </div>
        <div style={card}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 4px' }}>Total value under auction</p>
          <p style={{ fontSize: 26, fontWeight: 300, color: '#111827', margin: '0 0 4px' }}>{fmtSARM1(totalValue)}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Across all statuses</p>
        </div>
        <div style={card}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 4px' }}>Total savings realized</p>
          <p style={{ fontSize: 26, fontWeight: 300, color: '#111827', margin: '0 0 4px' }}>{fmtSARM1(TOTAL_SAVINGS_REALIZED)}</p>
          <p style={{ fontSize: 11, color: '#059669', margin: 0 }}>↑ 18.4% vs budget</p>
        </div>
        <div style={card}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 4px' }}>Avg savings %</p>
          <p style={{ fontSize: 26, fontWeight: 300, color: '#111827', margin: '0 0 4px' }}>14.2%</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>vs start price</p>
        </div>
      </div>

      {/* By status */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>By status</h2>
        <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0' }}>Where every auction stands right now</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
        {breakdown.map(s => {
          const meta = STATUS_META[s.status];
          return (
            <div key={s.status} onClick={() => onNavigate(meta.go)}
              style={{ ...card, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#94a3b8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={meta.badgeClass}>{s.status}</span>
                <span style={{ color: '#9ca3af' }}>›</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 300, color: '#111827', margin: '4px 0 0' }}>{s.count}</p>
              <p style={{ fontSize: 12.5, color: '#374151', margin: 0 }}>{fmtSARM2(s.value)} <span style={{ color: '#9ca3af' }}>{meta.onValue}</span></p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{meta.note}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming auctions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', margin: 0 }}>Upcoming auctions</h2>
          <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0' }}>Not yet live — soonest start date first</p>
        </div>
        <button onClick={() => onNavigate('ebid-list')}
          style={{ padding: '6px 14px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          View all auctions
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>{['Auction', 'Format', 'Start date', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {upcoming.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid #f1f5f9' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 500, color: '#1e293b', display: 'block' }}>{a.title}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>{a.id}</span>
                </td>
                <td style={{ ...tdStyle, fontSize: 12.5, color: '#4b5563' }}>{a.format}</td>
                <td style={{ ...tdStyle, fontSize: 12.5, color: '#4b5563', whiteSpace: 'nowrap' }}>{a.startDate}</td>
                <td style={tdStyle}><span className={STATUS_META[a.status].badgeClass}>{a.status}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => onNavigate(a.status === 'Draft' ? 'ebid-create' : 'ebid-detail', a)}
                    style={{ padding: '5px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {a.status === 'Draft' ? 'Edit' : 'Review'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
