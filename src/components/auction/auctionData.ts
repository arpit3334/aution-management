/**
 * auctionData.ts — shared mock dataset, sourced verbatim from
 * Auction_Module_v2_4_4.html's #v-create "All auctions" table (all 29
 * rows). Used by the Dashboard, Auction list (eBidList.tsx), and anywhere
 * else that needs a consistent view of the same 29 auctions, so the
 * numbers on every page reconcile with each other (and with the HTML).
 */

export type AuctionStatus = 'Live' | 'Pending approval' | 'Draft' | 'Awarded' | 'Closed';

export interface AuctionRow {
  id: string;
  title: string;
  category: string;
  format: string;
  items: number;
  startPrice: number; // SAR
  suppliers: number;
  startDate: string;
  endDate: string;
  status: AuctionStatus;
}

export const MOCK_AUCTIONS: AuctionRow[] = [
  { id: 'AUC-2025-0041',   title: 'IT Hardware — Laptops & Monitors Q2',      category: 'IT Equipment',        format: 'Dynamic reverse',       items: 3,  startPrice: 1250000,  suppliers: 5,  startDate: '27 Mar 2025 14:00', endDate: '27 Mar 2025 16:00', status: 'Live' },
  { id: 'AUC-2025-0040',   title: 'Office Stationery & Supplies Annual',      category: 'MRO',                  format: 'Dynamic reverse',       items: 12, startPrice: 320000,   suppliers: 4,  startDate: '27 Mar 2025 10:00', endDate: '27 Mar 2025 11:30', status: 'Live' },
  { id: 'AUC-2025-0039',   title: 'Facility Management Services FY25',       category: 'Facility',             format: 'Hybrid RFQ + auction',  items: 6,  startPrice: 780000,   suppliers: 6,  startDate: '28 Mar 2025 09:00', endDate: '28 Mar 2025 11:00', status: 'Pending approval' },
  { id: 'AUC-2025-0038',   title: 'Manpower Supply — Warehouse Staff',        category: 'HR Services',          format: 'Dynamic reverse',       items: 2,  startPrice: 2100000,  suppliers: 7,  startDate: '30 Mar 2025 13:00', endDate: '30 Mar 2025 15:00', status: 'Draft' },
  { id: 'AUC-2025-0037',   title: 'Network Infrastructure — Switches & Routers', category: 'IT Infrastructure', format: 'Dynamic reverse',    items: 4,  startPrice: 940000,   suppliers: 5,  startDate: '20 Mar 2025 10:00', endDate: '20 Mar 2025 12:30', status: 'Awarded' },
  { id: 'AUC-2025-0036',   title: 'Cleaning & Janitorial Services Q1',        category: 'Facility',             format: 'Dynamic reverse',       items: 5,  startPrice: 480000,   suppliers: 8,  startDate: '15 Mar 2025 09:00', endDate: '15 Mar 2025 11:00', status: 'Closed' },
  { id: 'AUC-2025-0044',   title: 'Annual Software Licensing Renewal',        category: 'Professional Services', format: 'Sealed bid',           items: 8,  startPrice: 1450000,  suppliers: 6,  startDate: '26 Mar 2025 09:00', endDate: '26 Mar 2025 09:00', status: 'Live' },
  { id: 'AUC-2025-0046',   title: 'Enterprise Cloud Migration Services',      category: 'IT Infrastructure',    format: 'Hybrid RFQ + auction',  items: 1,  startPrice: 3600000,  suppliers: 4,  startDate: '25 Mar 2025 09:00', endDate: '25 Mar 2025 17:00', status: 'Live' },
  { id: 'AUC-2025-0048',   title: 'Executive Security Services Contract',     category: 'Facility',             format: 'Bilateral negotiation', items: 1,  startPrice: 1840000,  suppliers: 3,  startDate: '24 Mar 2025 09:00', endDate: '07 Apr 2025 17:00', status: 'Live' },
  { id: 'AUC-2025-0050',   title: 'Enterprise ERP System Replacement',        category: 'IT Infrastructure',    format: 'Two-envelope',          items: 1,  startPrice: 12500000, suppliers: 7,  startDate: '26 Mar 2025 09:00', endDate: '02 Apr 2025 17:00', status: 'Live' },
  { id: 'AUC-2025-0052',   title: 'Digital Transformation Consulting — Phase 3', category: 'Professional Services', format: 'Multi-attribute',   items: 1,  startPrice: 4800000,  suppliers: 5,  startDate: '27 Mar 2025 09:00', endDate: '03 Apr 2025 17:00', status: 'Live' },
  { id: 'ENG-2025-0003',   title: 'Excess IT Assets — Data Centre Hardware Lot', category: 'IT Equipment',      format: 'English auction',       items: 1,  startPrice: 500000,   suppliers: 12, startDate: '27 Mar 2025 13:00', endDate: '27 Mar 2025 14:30', status: 'Live' },
  { id: 'DUTCH-2025-0001', title: 'Treasury Bills — SAR 500M Issuance',       category: 'Treasury',             format: 'Dutch auction',         items: 1,  startPrice: 5000000,  suppliers: 8,  startDate: '27 Mar 2025 09:00', endDate: '27 Mar 2025 17:00', status: 'Live' },
  { id: 'AUC-2025-0053',   title: 'Ministry Data Centre Fit-Out',             category: 'Facility',             format: 'Sealed bid',            items: 9,  startPrice: 2400000,  suppliers: 0,  startDate: '10 Apr 2025 09:00', endDate: '10 Apr 2025 09:00', status: 'Draft' },
  { id: 'AUC-2025-0028',   title: 'Municipal Street Lighting Upgrade',        category: 'Facility',             format: 'Sealed bid',            items: 2,  startPrice: 1750000,  suppliers: 7,  startDate: '18 Feb 2025 10:00', endDate: '18 Feb 2025 10:00', status: 'Closed' },
  { id: 'AUC-2025-0054',   title: 'Hospital Imaging Equipment Tender',        category: 'Medical Equipment',    format: 'Two-envelope',          items: 5,  startPrice: 5200000,  suppliers: 0,  startDate: '14 Apr 2025 09:00', endDate: '14 Apr 2025 09:00', status: 'Draft' },
  { id: 'AUC-2025-0021',   title: 'Water Treatment Plant Chemicals — Annual', category: 'MRO',                  format: 'Two-envelope',          items: 8,  startPrice: 2260000,  suppliers: 5,  startDate: '05 Feb 2025 09:00', endDate: '05 Feb 2025 09:00', status: 'Awarded' },
  { id: 'AUC-2025-0058',   title: 'Enterprise ERP Managed Services — 3yr',    category: 'Professional Services', format: 'Multi-attribute',      items: 1,  startPrice: 9600000,  suppliers: 5,  startDate: '30 Mar 2025 09:00', endDate: '06 Apr 2025 17:00', status: 'Pending approval' },
  { id: 'AUC-2025-0019',   title: 'Occupational Safety Equipment — Sitewide', category: 'MRO',                  format: 'Multi-attribute',       items: 14, startPrice: 640000,   suppliers: 6,  startDate: '28 Jan 2025 09:00', endDate: '03 Feb 2025 17:00', status: 'Closed' },
  { id: 'AUC-2025-0025',   title: 'Catering & Pantry Services — HQ Campus',   category: 'Facility',             format: 'Hybrid RFQ + auction',  items: 3,  startPrice: 560000,   suppliers: 4,  startDate: '24 Mar 2025 10:00', endDate: '24 Mar 2025 12:00', status: 'Live' },
  { id: 'AUC-2025-0055',   title: 'Network Infrastructure — BAFO Round',      category: 'IT Infrastructure',    format: 'Best and final offer',  items: 4,  startPrice: 868500,   suppliers: 3,  startDate: '21 Mar 2025 09:00', endDate: '21 Mar 2025 17:00', status: 'Closed' },
  { id: 'AUC-2025-0060',   title: 'Facility Security Services — BAFO',        category: 'Facility',             format: 'Best and final offer',  items: 1,  startPrice: 1840000,  suppliers: 3,  startDate: '28 Mar 2025 09:00', endDate: '30 Mar 2025 17:00', status: 'Live' },
  { id: 'AUC-2025-0032',   title: 'Data Centre Cooling Retrofit — BAFO',      category: 'Facility',             format: 'Best and final offer',  items: 2,  startPrice: 3200000,  suppliers: 2,  startDate: '06 Mar 2025 09:00', endDate: '06 Mar 2025 17:00', status: 'Awarded' },
  { id: 'AUC-2025-0049',   title: 'Legal Advisory Retainer — Annual',         category: 'Professional Services', format: 'Bilateral negotiation', items: 1,  startPrice: 1200000,  suppliers: 3,  startDate: '31 Mar 2025 09:00', endDate: '14 Apr 2025 17:00', status: 'Pending approval' },
  { id: 'AUC-2025-0016',   title: 'Recruitment Process Outsourcing Partner',  category: 'HR Services',          format: 'Bilateral negotiation', items: 1,  startPrice: 920000,   suppliers: 4,  startDate: '20 Jan 2025 09:00', endDate: '04 Feb 2025 17:00', status: 'Closed' },
  { id: 'ENG-2025-0004',   title: 'Fleet Vehicle Disposal — 2021 Models',     category: 'Fleet',                format: 'English auction',       items: 12, startPrice: 0,        suppliers: 0,  startDate: '12 Apr 2025 10:00', endDate: '12 Apr 2025 13:00', status: 'Draft' },
  { id: 'ENG-2025-0002',   title: 'Surplus Office Furniture — HQ Relocation', category: 'Facility',             format: 'English auction',       items: 1,  startPrice: 80000,    suppliers: 9,  startDate: '27 Feb 2025 10:00', endDate: '27 Feb 2025 11:00', status: 'Closed' },
  { id: 'DUTCH-2025-0002', title: 'Bulk Diesel Fuel Supply — Q2 Contract',    category: 'MRO',                  format: 'Dutch auction',         items: 1,  startPrice: 4200000,  suppliers: 0,  startDate: '08 Apr 2025 09:00', endDate: '08 Apr 2025 09:00', status: 'Pending approval' },
  { id: 'DUTCH-2025-0003', title: 'Steel Rebar — Bulk Construction Order',    category: 'MRO',                  format: 'Dutch auction',         items: 1,  startPrice: 1900000,  suppliers: 6,  startDate: '15 Jan 2025 09:00', endDate: '15 Jan 2025 11:00', status: 'Awarded' },
];

export const fmtSAR = (v: number) => `SAR ${v.toLocaleString('en-US')}`;
// "SAR 9.70M" style — always 2 decimals, used by the By-status dashboard
// cards and the Reports savings-by-category bars (matches the HTML exactly,
// including kept trailing zeros like "9.70M"/"8.30M").
export const fmtSARM2 = (v: number) => `SAR ${(v / 1_000_000).toFixed(2)}M`;
// "SAR 72.2M" style — always 1 decimal, used by the two top-line Dashboard
// KPI cards (Total value under auction / Total savings realized).
export const fmtSARM1 = (v: number) => `SAR ${(v / 1_000_000).toFixed(1)}M`;

export const totalAuctions = MOCK_AUCTIONS.length;
export const totalValue = MOCK_AUCTIONS.reduce((s, a) => s + a.startPrice, 0);

// Portfolio-level stats that aren't derivable from the 29-row list alone
// (they come from closed/awarded bid outcomes) — sourced from the HTML's
// #v-dashboard and #v-reports sections, kept as one shared source of truth
// so the Dashboard and Reports pages always agree.
export const TOTAL_BIDS_PLACED = 847;
export const AVG_SAVINGS_PCT = '14.2%';
export const TOTAL_SAVINGS_REALIZED = 4_700_000; // "SAR 4.7M"

export interface StatusSummary { status: AuctionStatus; count: number; value: number; }
export function statusBreakdown(): StatusSummary[] {
  const order: AuctionStatus[] = ['Live', 'Pending approval', 'Draft', 'Awarded', 'Closed'];
  return order.map(status => {
    const rows = MOCK_AUCTIONS.filter(a => a.status === status);
    return { status, count: rows.length, value: rows.reduce((s, a) => s + a.startPrice, 0) };
  });
}

// "Upcoming auctions" — Draft / Pending approval rows, soonest start date
// first. The HTML's static table doesn't sort strictly by full
// date+time (Draft rows on the same day appear before same-day Pending
// rows with an earlier time), so this list of IDs is taken verbatim from
// the HTML's #v-dashboard table rather than re-derived by a generic sort.
const UPCOMING_IDS = ['AUC-2025-0039', 'AUC-2025-0038', 'AUC-2025-0058', 'AUC-2025-0049', 'DUTCH-2025-0002', 'AUC-2025-0053'];
export function upcomingAuctions(): AuctionRow[] {
  return UPCOMING_IDS.map(id => MOCK_AUCTIONS.find(a => a.id === id)!).filter(Boolean);
}
