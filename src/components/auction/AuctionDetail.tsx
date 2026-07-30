'use client';
import { useState } from 'react';
import {
  Gavel, Plus, Search, ArrowLeft, ArrowRight, Check, CheckCircle,
  Clock, Calendar, DollarSign, Users, Package, Building2, FileText,
  Lock, Send, MessageSquare, Upload, Award, TrendingDown, BarChart2,
  AlertCircle, Star, Download, Info, Hash, Tag, Briefcase, Eye,
  MoreHorizontal, Filter, RefreshCw, ShieldCheck, Paperclip,
  ChevronDown, ChevronUp, Edit2, XCircle, IndianRupee, Shield,
  Activity
} from 'lucide-react';
import { eBid, EvalGateStage, EvalGate, VendorGateEval, VendorGateResult } from '@/types/auction';
import { StatusBadge, TypeBadge, fmtINR, RESULT_CFG, inputCls, SUB_STATUS_CFG } from '@/components/ui/shared';
import { GATE_CRITERIA, AVAILABLE_VENDORS, MOCK_BIDS } from '@/data/mockData';

type TabType = 'overview' | 'vendors' | 'submissions' | 'evaluation' | 'comparison' | 'award';

export function AuctionDetail({ bid: initBid, onNavigate }: { bid: eBid; onNavigate: (v: string, d?: any) => void }) {
  const bid = MOCK_BIDS.find(b => b.id === initBid.id) || initBid;
  const [activeTab, setActiveTab] = useState<TabType>((initBid as any)._tab === 'evaluation' ? 'evaluation' : 'overview');
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [selectedForAward, setSelectedForAward] = useState<string | null>(bid.awardedVendorId || null);
  const [awardNotes, setAwardNotes] = useState(bid.awardNotes || '');
  const [awardConfirmed, setAwardConfirmed] = useState(bid.status === 'Awarded');
  const [bidsOpened, setBidsOpened] = useState(bid.status === 'Bids Opened' || bid.status === 'Under Evaluation' || bid.status === 'Awarded');

  const submittedSubs = bid.submissions;
  const lowestBid = submittedSubs.length ? Math.min(...submittedSubs.map(s => s.totalAmount)) : 0;
  const STATUS_FLOW = ['Draft','Published','Submission Open','Submission Closed','Bids Opened','Under Evaluation','Awarded'];
  const currentStepIdx = STATUS_FLOW.indexOf(bid.status);

  const TABS: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' }, { id: 'vendors', label: `Vendors (${bid.vendorInvitations.length})` },
    { id: 'submissions', label: `Submissions (${bid.submissions.length})` }, { id: 'evaluation', label: 'Evaluation Gates' },
    { id: 'comparison', label: 'Bid Comparison' }, { id: 'award', label: 'Award' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div><h1 className="text-xl font-semibold text-slate-900">{bid.title}</h1><p className="text-sm text-slate-500 mt-0.5">{bid.eBidNumber} · {bid.linkedRFQNumber}</p></div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"><Download className="w-4 h-4" /> Export</button>
            {bid.status === 'Under Evaluation' && <button onClick={() => setActiveTab('evaluation')} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"><BarChart2 className="w-4 h-4" /> Evaluate</button>}
            {bid.status === 'Draft' && <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"><Send className="w-4 h-4" /> Publish</button>}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <StatusBadge status={bid.status} />
          <TypeBadge type={bid.bidType} />
          <span className="text-sm text-slate-500">{bid.category} · {bid.department}</span>
        </div>

        {bid.status !== 'Cancelled' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex items-center">
            {STATUS_FLOW.map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${idx < currentStepIdx ? 'bg-slate-900 text-white' : idx === currentStepIdx ? 'bg-slate-900 text-white ring-4 ring-slate-900/10' : 'bg-slate-100 text-slate-400'}`}>
                    {idx < currentStepIdx ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-xs hidden lg:block ${idx === currentStepIdx ? 'font-medium text-slate-900' : idx < currentStepIdx ? 'text-slate-600' : 'text-slate-400'}`}>{s}</span>
                </div>
                {idx < STATUS_FLOW.length - 1 && <div className={`flex-1 h-px mx-2 ${idx < currentStepIdx ? 'bg-slate-900' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="border-b border-slate-200 mb-5">
          <div className="flex overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[{ label: 'Invited Vendors', v: bid.vendorInvitations.length }, { label: 'Submissions', v: bid.submissions.length }, { label: 'Lowest Bid', v: lowestBid > 0 ? fmtINR(lowestBid) : '—' }].map(m => (
                  <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4"><p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{m.label}</p><p className="text-2xl font-semibold text-slate-900 mt-1">{m.v}</p></div>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-3">Description</h3><p className="text-sm text-slate-600 leading-relaxed">{bid.description}</p></div>
              {bid.termsAndConditions.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-3">Terms & Conditions</h3><ol className="space-y-2">{bid.termsAndConditions.map((t, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><span className="text-slate-400 font-mono">{i + 1}.</span><span>{t}</span></li>)}</ol></div>
              )}
              <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-4">Activity</h3><div className="space-y-4">{bid.activities.map((a, i) => <div key={i} className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 mt-1.5" /><div><p className="text-sm text-slate-700">{a.action}</p><p className="text-xs text-slate-400">{a.user} · {a.timestamp}</p></div></div>)}</div></div>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-4">Auction Info</h3><div className="space-y-3 text-sm">{[['eBid No.', bid.eBidNumber], ['Linked RFQ', bid.linkedRFQNumber], ['Category', bid.category], ['Dept.', bid.department], ['Est. Value', fmtINR(bid.estimatedValue)], ['Bid Bond', bid.bidBondRequired ? fmtINR(bid.bidBondAmount || 0) : 'Not required'], ['Validity', `${bid.bidValidityDays} days`]].map(([l, v]) => <div key={l} className="flex justify-between"><span className="text-slate-500">{l}</span><span className="text-slate-800 font-medium">{v}</span></div>)}</div></div>
              <div className="bg-white border border-slate-200 rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-4">Key Dates</h3><div className="space-y-3 text-sm">{[['Created', bid.createdDate], ['Opens', bid.submissionOpenDate], ['Deadline', bid.submissionDeadline], ['Bid Opening', bid.bidOpeningDate], ...(bid.awardDate ? [['Awarded', bid.awardDate]] : [])].map(([l, v]) => <div key={l} className="flex justify-between"><span className="text-slate-500">{l}</span><span className="text-slate-700 font-medium">{v}</span></div>)}</div></div>
              {bid.status === 'Awarded' && bid.awardedVendorName && (
                <div className="bg-slate-900 text-white rounded-xl p-5"><div className="flex items-center gap-2 mb-2"><Award className="w-4 h-4" /><span className="text-sm font-semibold">Awarded To</span></div><p className="text-sm font-medium">{bid.awardedVendorName}</p><p className="font-semibold mt-1">{fmtINR(bid.awardedAmount || 0)}</p></div>
              )}
            </div>
          </div>
        )}

        {/* Vendors */}
        {activeTab === 'vendors' && (
          <div className="space-y-3">
            {bid.vendorInvitations.map(inv => (
              <div key={inv.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Building2 className="w-5 h-5 text-slate-400" /></div>
                  <div><p className="font-medium text-slate-900">{inv.vendorName}</p><p className="text-sm text-slate-500">{inv.contactPerson} · {inv.email}</p><p className="text-xs text-slate-400">Invited {inv.invitedDate}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inv.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : inv.status === 'Declined' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600'}`}>{inv.status}</span>
                  {inv.status === 'Submitted' && inv.submissionId && <button onClick={() => onNavigate('submission', { bid, submissionId: inv.submissionId })} className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"><Eye className="w-4 h-4" /> View</button>}
                  {inv.declineReason && <span className="text-xs text-slate-400 max-w-[180px] truncate">{inv.declineReason}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-3">
            {bid.submissions.length === 0 && <div className="py-14 text-center bg-white border border-slate-200 rounded-xl"><Package className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">No submissions yet.</p></div>}
            {bid.submissions.map(sub => {
              const isExp = expandedSub === sub.id;
              return (
                <div key={sub.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/60" onClick={() => setExpandedSub(isExp ? null : sub.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"><Building2 className="w-4 h-4 text-slate-400" /></div>
                      <div><p className="font-medium text-slate-900">{sub.vendorName}</p><p className="text-xs text-slate-500">{sub.submissionRef} · {sub.submittedDate}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SUB_STATUS_CFG[sub.status] || 'bg-slate-100 text-slate-600'}`}>{sub.status}</span>
                      <p className="font-semibold text-slate-900">{fmtINR(sub.totalAmount)}</p>
                      {isExp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                  {isExp && (
                    <div className="border-t border-slate-100 p-4 space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-sm">{[['Payment', sub.paymentTerms], ['Delivery', `${sub.deliveryDays}d`], ['Validity', `${sub.validityDays}d`], ['Bid Bond', sub.bidBondProvided ? fmtINR(sub.bidBondAmount || 0) : 'No']].map(([l, v]) => <div key={l}><p className="text-xs text-slate-400">{l}</p><p className="font-medium text-slate-700 mt-0.5">{v}</p></div>)}</div>
                      <table className="w-full text-sm border border-slate-100 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50"><tr>{['Code','Description','Qty','Unit Price','Total','Delivery'].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-medium text-slate-500">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-slate-100">{sub.lineItems.map(li => <tr key={li.lineItemId}><td className="px-3 py-2 font-mono text-xs text-slate-400">{li.code}</td><td className="px-3 py-2 text-slate-700">{li.description}</td><td className="px-3 py-2 text-slate-500">{li.quantity} {li.unit}</td><td className="px-3 py-2 font-medium text-slate-800">{fmtINR(li.unitPrice)}</td><td className="px-3 py-2 font-semibold">{fmtINR(li.totalPrice)}</td><td className="px-3 py-2 text-slate-500">{li.deliveryDays}d</td></tr>)}</tbody>
                      </table>
                      {sub.attachments.length > 0 && <div className="flex flex-wrap gap-2">{sub.attachments.map(a => <span key={a.name} className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"><Paperclip className="w-3 h-3" />{a.name}</span>)}</div>}
                      {sub.evaluatorNotes && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">{sub.evaluatorNotes}</div>}
                      <button onClick={() => onNavigate('submission', { bid, submissionId: sub.id })} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"><Eye className="w-3.5 h-3.5" /> Full View</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Evaluation Gates */}
        {activeTab === 'evaluation' && <EvaluationGatesPanel bid={bid} />}

        {/* Comparison */}
        {activeTab === 'comparison' && (
          <div>
            {bid.submissions.length < 2 ? (
              <div className="py-14 text-center bg-white border border-slate-200 rounded-xl"><BarChart2 className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">At least 2 submissions required for comparison.</p></div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100"><h3 className="font-semibold text-slate-900">Bid Comparison</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-slate-500 sticky left-0 bg-slate-50">Line Item</th><th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Est. Price</th>{bid.submissions.map(s => <th key={s.id} className="px-4 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">{s.vendorName.split(' ')[0]}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {bid.lineItems.map(item => (
                        <tr key={item.id}><td className="px-4 py-3 sticky left-0 bg-white"><p className="font-medium text-slate-800">{item.description}</p><p className="font-mono text-xs text-slate-400">{item.code}</p></td><td className="px-4 py-3 text-slate-600">{item.estimatedUnitPrice ? fmtINR(item.estimatedUnitPrice) : '—'}</td>
                          {bid.submissions.map(sub => { const li = sub.lineItems.find(l => l.lineItemId === item.id); const est = item.estimatedUnitPrice; const diff = est && li ? ((li.unitPrice - est) / est) * 100 : null; return <td key={sub.id} className="px-4 py-3"><p className="font-medium text-slate-800">{li ? fmtINR(li.unitPrice) : '—'}</p>{diff !== null && <p className={`text-xs ${diff < 0 ? 'text-emerald-600' : 'text-red-500'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}%</p>}</td>; })}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot><tr className="bg-slate-50 border-t-2 border-slate-200 font-semibold"><td className="px-4 py-3 sticky left-0 bg-slate-50">Total Bid</td><td className="px-4 py-3 text-slate-600">{fmtINR(bid.estimatedValue)}</td>{bid.submissions.map(sub => { const diff = ((sub.totalAmount - bid.estimatedValue) / bid.estimatedValue) * 100; return <td key={sub.id} className="px-4 py-3"><p className="font-bold text-slate-900">{fmtINR(sub.totalAmount)}</p><p className={`text-xs ${diff < 0 ? 'text-emerald-600' : 'text-red-500'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}%</p></td>; })}</tr></tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Award */}
        {activeTab === 'award' && (
          <div className="space-y-5">
            {awardConfirmed ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center"><div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4"><Award className="w-7 h-7 text-white" /></div><h3 className="text-lg font-semibold text-slate-900 mb-1">Auction Awarded</h3><p className="text-sm text-slate-500">{bid.awardedVendorName || 'Vendor'} awarded {fmtINR(bid.awardedAmount || 0)}</p></div>
            ) : (
              <>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Select Winning Vendor</h3>
                  <div className="space-y-3">
                    {[...bid.submissions].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0)).map((sub, idx) => (
                      <div key={sub.id} onClick={() => setSelectedForAward(sub.vendorId)} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedForAward === sub.vendorId ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</div><div><p className="font-medium text-slate-900">{sub.vendorName}</p><p className="text-xs text-slate-500">Overall: {sub.overallScore ?? '—'}</p></div></div>
                        <p className="font-bold text-slate-900">{fmtINR(sub.totalAmount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Award Notes</label>
                  <textarea className={inputCls + ' resize-none'} rows={3} value={awardNotes} onChange={e => setAwardNotes(e.target.value)} placeholder="Justification for award decision…" />
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Save Draft</button>
                  <button disabled={!selectedForAward} onClick={() => setAwardConfirmed(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40"><Award className="w-4 h-4" /> Confirm Award</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: EVALUATION GATES PANEL
// ─────────────────────────────────────────────────────────────
export function EvaluationGatesPanel({ bid }: { bid: eBid }) {
  const initGates: EvalGate[] = bid.gates || [
    { stage: 'preliminary', label: 'Preliminary', status: 'not_started', vendorEvals: bid.submissions.map(s => ({ vendorId: s.vendorId, vendorName: s.vendorName, criteriaEvals: [], result: 'pending' as VendorGateResult } as VendorGateEval)) },
    { stage: 'technical', label: 'Technical', status: 'locked', passingScore: 70, vendorEvals: bid.submissions.map(s => ({ vendorId: s.vendorId, vendorName: s.vendorName, criteriaEvals: [], result: 'pending' as VendorGateResult } as VendorGateEval)) },
    { stage: 'commercial', label: 'Commercial', status: 'locked', passingScore: 60, vendorEvals: bid.submissions.map(s => ({ vendorId: s.vendorId, vendorName: s.vendorName, criteriaEvals: [], result: 'pending' as VendorGateResult } as VendorGateEval)) },
    { stage: 'financial', label: 'Financial', status: 'locked', vendorEvals: bid.submissions.map(s => ({ vendorId: s.vendorId, vendorName: s.vendorName, criteriaEvals: [], result: 'pending' as VendorGateResult } as VendorGateEval)) },
  ];

  const [gates, setGates] = useState<EvalGate[]>(initGates);
  const [activeGateIdx, setActiveGateIdx] = useState<number>(() => {
    const idx = initGates.findIndex(g => g.status === 'in_progress');
    if (idx >= 0) return idx;
    const last = [...initGates].reverse().findIndex(g => g.status === 'completed');
    return last >= 0 ? initGates.length - 1 - last : 0;
  });
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [booleans, setBooleans] = useState<Record<string, Record<string, boolean | null>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [awardVendor, setAwardVendor] = useState<string | null>(null);
  const [awarded, setAwarded] = useState(false);

  const activeGate = gates[activeGateIdx] ?? gates[0];
  const criteria = GATE_CRITERIA[activeGate?.stage as EvalGateStage] || [];
  const isFinalGate = activeGateIdx === gates.length - 1;
  const gKey = (vId: string) => `${activeGateIdx}-${vId}`;

  const getScore = (vId: string, cId: string) => scores[gKey(vId)]?.[cId] ?? 0;
  const getBool = (vId: string, cId: string) => booleans[gKey(vId)]?.[cId] ?? null;
  const setScoreVal = (vId: string, cId: string, v: number) => setScores(p => ({ ...p, [gKey(vId)]: { ...(p[gKey(vId)] || {}), [cId]: v } }));
  const setBoolVal = (vId: string, cId: string, v: boolean) => setBooleans(p => ({ ...p, [gKey(vId)]: { ...(p[gKey(vId)] || {}), [cId]: v } }));

  const calcWS = (vId: string, vEval: EvalGate['vendorEvals'][0]) => {
    if (vEval.criteriaEvals.length > 0 && vEval.weightedScore !== undefined) return vEval.weightedScore;
    const sc = criteria.filter(c => c.type === 'score');
    if (!sc.length) return null;
    const tw = sc.reduce((s, c) => s + c.weight, 0);
    if (!tw) return null;
    return sc.reduce((t, c) => { const pv = vEval.criteriaEvals.find(e => e.criteriaId === c.id); return t + ((pv?.score ?? getScore(vId, c.id)) * (c.weight / tw)); }, 0);
  };

  const approveGate = (idx: number) => {
    setGates(p => p.map((g, i) => i === idx ? { ...g, status: 'completed' } : i === idx + 1 && g.status === 'locked' ? { ...g, status: 'not_started' } : g));
    if (idx + 1 < gates.length) setActiveGateIdx(idx + 1);
  };

  const vendors = activeGate?.vendorEvals.length > 0 ? activeGate.vendorEvals : bid.submissions.map(s => ({ vendorId: s.vendorId, vendorName: s.vendorName, criteriaEvals: [], result: 'pending' as VendorGateResult } as VendorGateEval));

  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="col-span-1 space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Evaluation Gates</p>
        {gates.map((gate, idx) => {
          const isActive = idx === activeGateIdx, isLocked = gate.status === 'locked';
          return (
            <button key={gate.stage} onClick={() => !isLocked && setActiveGateIdx(idx)} disabled={isLocked} className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${isActive ? 'border-slate-900 bg-slate-50' : isLocked ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900">{gate.label}</span>
                {gate.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {gate.status === 'locked' && <Lock className="w-3.5 h-3.5 text-slate-300" />}
              </div>
              <span className={`text-xs font-medium ${gate.status === 'completed' ? 'text-emerald-600' : gate.status === 'in_progress' ? 'text-amber-600' : gate.status === 'locked' ? 'text-slate-300' : 'text-slate-500'}`}>
                {gate.status === 'locked' ? 'Locked' : gate.status === 'not_started' ? 'Not Started' : gate.status === 'in_progress' ? 'In Progress' : 'Completed'}
              </span>
              {gate.passingScore && <p className="text-xs text-slate-400 mt-0.5">Min. {gate.passingScore}/100</p>}
            </button>
          );
        })}
        <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Bids</p>
          {bid.submissions.map(sub => <div key={sub.id} className="flex justify-between text-xs py-1"><span className="text-slate-700 truncate">{sub.vendorName.split(' ')[0]}</span><span className="text-slate-500">{fmtINR(sub.totalAmount)}</span></div>)}
        </div>
      </div>

      <div className="col-span-3 space-y-4">
        {!isFinalGate ? (
          <>
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold text-slate-900">{activeGate.label} Gate</h3>{activeGate.passingScore && <p className="text-xs text-slate-500 mt-0.5">Min. passing score: {activeGate.passingScore}/100</p>}</div>
              {activeGate.status !== 'completed' && activeGate.status !== 'locked' && <button onClick={() => approveGate(activeGateIdx)} className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"><ShieldCheck className="w-4 h-4" /> Approve Gate</button>}
              {activeGate.status === 'completed' && <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><CheckCircle className="w-4 h-4" /> Approved</span>}
            </div>
            {vendors.map(vEval => {
              const isExp = expandedVendor === vEval.vendorId, ws = calcWS(vEval.vendorId, vEval);
              const result: VendorGateResult = vEval.result !== 'pending' ? vEval.result : ws !== null && activeGate.passingScore && ws >= activeGate.passingScore ? 'pass' : 'pending';
              const isDisabled = activeGate.status === 'completed';
              return (
                <div key={vEval.vendorId} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50" onClick={() => setExpandedVendor(isExp ? null : vEval.vendorId)}>
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">{vEval.vendorName[0]}</div><p className="font-medium text-slate-900">{vEval.vendorName}</p></div>
                    <div className="flex items-center gap-3">
                      {ws !== null && <div className="text-right"><p className="text-lg font-bold text-slate-900">{ws.toFixed(1)}</p><p className="text-xs text-slate-400">score</p></div>}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${RESULT_CFG[result].badge}`}>{RESULT_CFG[result].label}</span>
                      {isExp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                  {isExp && (
                    <div className="border-t border-slate-100 p-4 space-y-5">
                      {(() => {
                        return criteria.map(crit => {
                          const pv = vEval.criteriaEvals.find(e => e.criteriaId === crit.id);
                          const curScore = pv?.score ?? getScore(vEval.vendorId, crit.id);
                          const curBool = pv?.passed ?? getBool(vEval.vendorId, crit.id);
                          return (
                            <div key={crit.id}>
                              <div className="flex items-start justify-between mb-2">
                                <div><p className="text-sm font-medium text-slate-800">{crit.name}{crit.required && <span className="ml-1.5 text-xs text-red-500">Required</span>}</p><p className="text-xs text-slate-400">{crit.description}</p></div>
                                {crit.weight > 0 && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{crit.weight}%</span>}
                              </div>
                              {crit.type === 'boolean' ? (
                                <div className="flex gap-2">
                                  {[true, false].map(val => (
                                    <button key={String(val)} disabled={isDisabled} onClick={() => setBoolVal(vEval.vendorId, crit.id, val)} className={`px-4 py-1.5 text-sm rounded-lg border transition-all ${curBool === val ? val ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium' : 'bg-red-50 border-red-300 text-red-600 font-medium' : 'bg-white border-slate-200 text-slate-500'}`}>{val ? '✓ Pass' : '✗ Fail'}</button>
                                  ))}
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-3 mb-1"><input type="range" min={0} max={100} step={1} disabled={isDisabled} value={curScore} onChange={e => setScoreVal(vEval.vendorId, crit.id, parseInt(e.target.value))} className="flex-1 accent-slate-900" /><span className="w-8 text-sm font-medium text-slate-700 text-right">{curScore}</span></div>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900 rounded-full" style={{ width: `${curScore}%` }} /></div>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                      {!isDisabled && <div><label className="block text-xs font-medium text-slate-600 mb-1">Notes</label><textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none" rows={2} value={notes[`${activeGateIdx}-${vEval.vendorId}`] || vEval.evaluatorNotes || ''} onChange={e => setNotes(p => ({ ...p, [`${activeGateIdx}-${vEval.vendorId}`]: e.target.value }))} /></div>}
                      {vEval.evaluatedBy && <p className="text-xs text-slate-400">Evaluated by {vEval.evaluatedBy} on {vEval.evaluatedDate}</p>}
                    </div>
                  )}
                </div>
              );
            })}
            {activeGate.gateNotes && <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600"><span className="font-medium">Gate notes: </span>{activeGate.gateNotes}</div>}
          </>
        ) : (
          <div className="space-y-5">
            {awarded ? (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center"><div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4"><Award className="w-7 h-7 text-white" /></div><h3 className="text-lg font-semibold text-slate-900 mb-1">Award Submitted</h3><p className="text-sm text-slate-500">Recommendation for <strong>{bid.submissions.find(s => s.vendorId === awardVendor)?.vendorName}</strong> submitted for approval.</p></div>
            ) : (
              <>
                <div><h3 className="font-semibold text-slate-900">Award Recommendation</h3><p className="text-xs text-slate-500 mt-0.5">Select the winning vendor.</p></div>
                <div className="space-y-3">
                  {[...bid.submissions].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0)).map((sub, idx) => (
                    <div key={sub.id} onClick={() => setAwardVendor(sub.vendorId)} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${awardVendor === sub.vendorId ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{idx + 1}</div><div><p className="font-medium text-slate-900">{sub.vendorName}</p><p className="text-xs text-slate-500">Overall: {sub.overallScore ?? '—'}</p></div></div>
                      <p className="font-bold text-slate-900">{fmtINR(sub.totalAmount)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end"><button onClick={() => setAwarded(true)} disabled={!awardVendor} className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40"><Award className="w-4 h-4" /> Submit Award Recommendation</button></div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW: VENDOR BID SUBMISSION
// ─────────────────────────────────────────────────────────────
type BidStep = 'pricing' | 'terms' | 'docs' | 'review';
const BID_STEPS: BidStep[] = ['pricing', 'terms', 'docs', 'review'];
const BID_STEP_LABELS: Record<BidStep, string> = { pricing: 'Price Entry', terms: 'Terms', docs: 'Documents', review: 'Review & Submit' };

