import { FileText, BarChart2, Users, TrendingDown, Download, ArrowLeft } from 'lucide-react';

const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

interface Props {
  onNavigate: (view: string, data?: any) => void;
}

const REPORT_CARDS = [
  { title: 'Auction Summary Report',       desc: 'Items, unit prices, totals, lowest bid per line',                    icon: FileText,    btn: 'Download Excel' },
  { title: 'Bid Details Report',           desc: 'Bid value per item per supplier across all rounds',                  icon: BarChart2,   btn: 'Download Excel' },
  { title: 'Supplier Comparison Report',   desc: 'Supplier ranking and visual side-by-side comparison',                icon: Users,       btn: 'Download Excel' },
  { title: 'Comprehensive Auction Report', desc: 'Full event details, bids, timeline, and award summary',              icon: TrendingDown,btn: 'Download PDF'   },
];

const SAVINGS = [
  { category: 'IT Equipment',          value: 18400000, pct: 12.3, width: 82 },
  { category: 'Facility Management',   value: 11200000, pct: 16.1, width: 70 },
  { category: 'MRO',                   value:  8200000, pct: 18.7, width: 55 },
  { category: 'Professional Services', value:  5400000, pct:  9.4, width: 40 },
  { category: 'HR Services',           value:  3800000, pct: 11.2, width: 25 },
];

const STATS = [
  { label: 'Total Auctions Run', value: '24'     },
  { label: 'Total Bids Placed',  value: '847'    },
  { label: 'Avg Savings %',      value: '14.2%'  },
  { label: 'Total Savings',      value: '₹4.7 Cr'},
];

export default function AuctionReports({ onNavigate }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => onNavigate('ebid-list')}
              style={{ padding: 7, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
              <ArrowLeft size={15} />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Auction Reports</h1>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Download and analyze auction data</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', margin: 0 }}>Auction</p>
            <select style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: '#1e293b', fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
              <option>AUC-2026-0041 · IT Hardware — Laptops</option>
              <option>AUC-2026-0044 · Annual Software Licensing</option>
              <option>AUC-2026-0046 · Cloud Migration Services</option>
              <option>AUC-2026-0037 · Network Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Report cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {REPORT_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#6b7280" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>{card.title}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 14px', lineHeight: 1.5 }}>{card.desc}</p>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}>
                    <Download size={13} /> {card.btn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 14px' }}>Auction Analytics — All Events FY2026</p>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {STATS.map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px' }}>
              <p style={{ fontSize: 22, fontWeight: 300, color: '#111827', margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 18px' }}>Savings by Category</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SAVINGS.map(item => (
              <div key={item.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#374151', margin: 0 }}>{item.category}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{fmtINR(item.value)}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#059669', margin: 0 }}>{item.pct}%</p>
                  </div>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.width}%`, background: '#1a1a1a', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
