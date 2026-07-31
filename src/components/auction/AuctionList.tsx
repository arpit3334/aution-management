'use client';
import { useState, useMemo } from 'react';
import { Plus, Search, Eye, BarChart2, Edit2, Gavel } from 'lucide-react';
import { MOCK_BIDS } from '@/data/mockData';
import { eBidStatus } from '@/types/auction';
import { TypeBadge, StatusBadge, fmtINR } from '@/components/ui/shared';

export function AuctionList({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = useMemo(() => MOCK_BIDS.filter(b => {
    const q = search.toLowerCase();
    return (b.title.toLowerCase().includes(q) || b.eBidNumber.toLowerCase().includes(q) || b.linkedRFQNumber.toLowerCase().includes(q))
      && (statusFilter === 'All' || b.status === statusFilter)
      && (typeFilter === 'All' || b.bidType === typeFilter);
  }), [search, statusFilter, typeFilter]);

  const stats = { total: MOCK_BIDS.length, open: MOCK_BIDS.filter(b => b.status === 'Submission Open').length, evaluation: MOCK_BIDS.filter(b => b.status === 'Under Evaluation').length, awarded: MOCK_BIDS.filter(b => b.status === 'Awarded').length, totalValue: MOCK_BIDS.reduce((s, b) => s + b.estimatedValue, 0) };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Auction Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">End-to-end electronic auctions — from RFQ to award</p>
        </div>
        <button onClick={() => onNavigate('create')} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Auction
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {[{ label: 'Total Auctions', value: stats.total }, { label: 'Submission Open', value: stats.open }, { label: 'Under Evaluation', value: stats.evaluation }, { label: 'Awarded', value: stats.awarded }, { label: 'Total Est. Value', value: fmtINR(stats.totalValue), sm: true }].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`mt-1 font-semibold text-slate-900 ${s.sm ? 'text-lg' : 'text-2xl'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by title, number, RFQ…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900" />
          </div>
          <div className="ml-auto flex gap-2">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900">
              <option value="All">All Types</option><option value="Sealed">Sealed</option><option value="Open">Open</option><option value="Reverse Auction">Reverse Auction</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900">
              <option value="All">All Statuses</option>
              {(['Draft','Published','Submission Open','Submission Closed','Bids Opened','Under Evaluation','Awarded','Cancelled'] as eBidStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['eBid #','Title','Type','RFQ','Category','Vendors','Est. Value','Deadline','Status',''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide bg-slate-50 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(bid => {
                const submitted = bid.vendorInvitations.filter(v => v.status === 'Submitted').length;
                return (
                  <tr key={bid.id} className="hover:bg-slate-50/60 group">
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{bid.eBidNumber}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => onNavigate('detail', bid)} className="font-medium text-slate-900 hover:text-slate-600 text-left line-clamp-1 max-w-[200px]">{bid.title}</button>
                      <p className="text-xs text-slate-400">{bid.department}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><TypeBadge type={bid.bidType} /></td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500 whitespace-nowrap">{bid.linkedRFQNumber}</td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs whitespace-nowrap">{bid.category}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><span className="text-slate-700 font-medium">{submitted}</span><span className="text-slate-400 text-xs">/{bid.vendorInvitations.length}</span></td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 whitespace-nowrap">{fmtINR(bid.estimatedValue)}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{bid.submissionDeadline}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={bid.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onNavigate('detail', bid)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                        {bid.status === 'Under Evaluation' && <button onClick={() => onNavigate('detail', { ...bid, _tab: 'evaluation' })} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"><BarChart2 className="w-4 h-4" /></button>}
                        {bid.status === 'Draft' && <button onClick={() => onNavigate('create', bid)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center"><Gavel className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">No auctions match your filters.</p></div>}
        </div>
        <div className="px-4 py-3 border-t border-slate-100"><p className="text-xs text-slate-400">Showing {filtered.length} of {MOCK_BIDS.length} auctions</p></div>
      </div>
    </div>
  );
}
