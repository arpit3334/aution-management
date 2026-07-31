import { ReportChartBox, ReportDocument, ReportShieldCheck, ReportTrendLine } from './custom-icons';

// Values sourced from Auction_Module_v2_4_4.html's #v-reports section
// (which displays these as "SAR 1.84M", "SAR 4.7M", etc.).
const fmtSAR = (v: number) => `SAR ${(v / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;

interface Props {
  onNavigate: (view: string, data?: any) => void;
}

// Icon shape, icon box background, icon stroke color, and button variant are
// all sourced verbatim from the HTML's 4 report cards — each card uses a
// distinct accent color, and only the last (PDF) button is filled/primary.
const REPORT_CARDS = [
  { title: 'Auction Summary Report',       desc: 'Items, unit prices, totals, lowest bid and supplier name',                              icon: ReportChartBox,     iconBg: '#eff6ff', iconColor: '#2563eb', btn: 'Download Excel', primary: false },
  { title: 'Bid Details Report',           desc: 'Bid value per item per supplier, bid change count',                                      icon: ReportDocument,     iconBg: '#f0fdf4', iconColor: '#16a34a', btn: 'Download Excel', primary: false },
  { title: 'Supplier Comparison Report',   desc: 'Supplier ranking, bid values, quick visual comparison',                                  icon: ReportShieldCheck,  iconBg: '#fffbeb', iconColor: '#d97706', btn: 'Download Excel', primary: false },
  { title: 'Comprehensive Auction Report', desc: 'Full details: summary, items, suppliers, bid details, questionnaire, progression graph', icon: ReportTrendLine,    iconBg: '#f3f4f6', iconColor: '#374151', btn: 'Download PDF',   primary: true },
];

const SAVINGS = [
  { category: 'IT Equipment',          value: 1840000, pct: 12.3, width: 82 },
  { category: 'Facility Management',   value: 1120000, pct: 16.1, width: 70 },
  { category: 'MRO',                   value:  820000, pct: 18.7, width: 55 },
  { category: 'Professional Services', value:  540000, pct:  9.4, width: 40 },
  { category: 'HR Services',           value:  380000, pct: 11.2, width: 25 },
];

const STATS = [
  { label: 'Total Auctions Run', value: '29'      },
  { label: 'Total Bids Placed',  value: '847'     },
  { label: 'Avg Savings %',      value: '14.2%'   },
  { label: 'Total Savings',      value: 'SAR 4.7M'},
];

export default function AuctionReports({ onNavigate }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Auction Reports</h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Download and analyze auction data</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', margin: 0 }}>Auction</p>
            <select style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 10px', fontSize: 13, color: '#1e293b', fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
              <option>AUC-2025-0041 — IT Hardware Q2</option>
              <option>AUC-2025-0037 — Network Infrastructure</option>
              <option>AUC-2025-0036 — Cleaning Services</option>
            </select>
          </div>
        </div>

        {/* Report cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {REPORT_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, background: card.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={card.iconColor} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>{card.title}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 14px', lineHeight: 1.5 }}>{card.desc}</p>
                  <button style={card.primary
                      ? { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
                      : { background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = card.primary ? '#374151' : '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = card.primary ? '#1a1a1a' : '#fff')}>
                    {card.btn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 14px' }}>Auction Analytics — All Events FY2025</p>

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
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{fmtSAR(item.value)}</p>
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
