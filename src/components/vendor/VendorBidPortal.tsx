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
import { eBid, eBidSubmissionLineItem } from '@/types/auction';
import { FormField, StatusBadge, TypeBadge, fmtINR, inputCls, SUB_STATUS_CFG } from '@/components/ui/shared';

type BidStep = 'pricing' | 'terms' | 'docs' | 'review';
const BID_STEPS: BidStep[] = ['pricing', 'terms', 'docs', 'review'];
const BID_STEP_LABELS: Record<BidStep, string> = { pricing: 'Price Entry', terms: 'Terms', docs: 'Documents', review: 'Review & Submit' };

export function VendorBidSubmit({ bid, onNavigate }: { bid: eBid; onNavigate: (v: string, d?: any) => void }) {
  const VENDOR_NAME = 'Tech Solutions Ltd';
  const [step, setStep] = useState<BidStep>('pricing');
  const [prices, setPrices] = useState<Record<string, { unitPrice: string; deliveryDays: string; remarks: string }>>(() => Object.fromEntries(bid.lineItems.map(i => [i.id, { unitPrice: '', deliveryDays: '15', remarks: '' }])));
  const [paymentTerms, setPaymentTerms] = useState('30% advance, 70% on delivery');
  const [validityDays, setValidityDays] = useState('90');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const attachments = ['Technical_Compliance.pdf', 'Company_Profile.pdf', 'ISO_Certificate.pdf'];

  const getP = (id: string, f: keyof typeof prices[string]) => prices[id]?.[f] || '';
  const setP = (id: string, f: keyof typeof prices[string], v: string) => setPrices(p => ({ ...p, [id]: { ...p[id], [f]: v } }));
  const totalBid = bid.lineItems.reduce((s, i) => s + (parseFloat(getP(i.id, 'unitPrice')) || 0) * i.quantity, 0);
  const allPriced = bid.lineItems.every(i => parseFloat(getP(i.id, 'unitPrice')) > 0);
  const stepIdx = BID_STEPS.indexOf(step);

  if (submitted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-white" /></div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Bid Submitted</h2>
        <p className="text-sm text-slate-500">Your bid of <strong>{fmtINR(totalBid)}</strong> for <em>{bid.title}</em> has been received.</p>
        <button onClick={() => onNavigate('list')} className="mt-6 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">Back to List</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center"><Gavel className="w-4 h-4" /></div><div><p className="font-semibold text-sm">Submit Bid — {bid.eBidNumber}</p><p className="text-slate-400 text-xs">{VENDOR_NAME}</p></div></div>
          <div className="flex items-center gap-4"><div className="text-right"><p className="text-xs text-slate-400">Deadline</p><p className="text-sm font-medium">{bid.submissionDeadline}</p></div><button onClick={() => onNavigate('list')} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800"><ArrowLeft className="w-4 h-4" /> Exit</button></div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-start justify-between"><div><h2 className="font-semibold text-slate-900">{bid.title}</h2><p className="text-xs text-slate-400 mt-1">{bid.category} · {bid.bidType}</p></div><div className="text-right"><p className="text-xs text-slate-400">Est. Budget</p><p className="text-lg font-semibold text-slate-900">{fmtINR(bid.estimatedValue)}</p></div></div>
        </div>

        <div className="flex items-center">
          {BID_STEPS.map((s, idx) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${stepIdx > idx ? 'bg-slate-900 text-white' : stepIdx === idx ? 'bg-slate-900 text-white ring-4 ring-slate-900/10' : 'bg-slate-100 text-slate-400'}`}>{stepIdx > idx ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}</div>
                <span className={`text-sm hidden sm:block ${stepIdx === idx ? 'font-medium text-slate-900' : 'text-slate-400'}`}>{BID_STEP_LABELS[s]}</span>
              </div>
              {idx < BID_STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${stepIdx > idx ? 'bg-slate-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {step === 'pricing' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><h3 className="font-semibold text-slate-900">Price Entry</h3><p className="text-xs text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Item details locked from RFQ</p></div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>{['Code','Description','Qty','Unit','Est. Price','Your Unit Price','Delivery (days)','Line Total'].map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-slate-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {bid.lineItems.map(item => {
                  const up = parseFloat(getP(item.id, 'unitPrice')) || 0;
                  const est = item.estimatedUnitPrice;
                  const diff = est && up > 0 ? ((up - est) / est) * 100 : null;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-400">{item.code}</td>
                      <td className="px-3 py-2.5 text-slate-700 bg-slate-50/30">{item.description}</td>
                      <td className="px-3 py-2.5 text-slate-500 bg-slate-50/30">{item.quantity}</td>
                      <td className="px-3 py-2.5 text-slate-500 bg-slate-50/30">{item.unit}</td>
                      <td className="px-3 py-2.5 text-slate-400 bg-slate-50/30">{est ? fmtINR(est) : '—'}</td>
                      <td className="px-3 py-2">
                        <input type="number" min={0} step={0.01} value={getP(item.id, 'unitPrice')} onChange={e => setP(item.id, 'unitPrice', e.target.value)} placeholder="0.00" className="w-28 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900" />
                        {diff !== null && <p className={`text-xs mt-0.5 ${diff < 0 ? 'text-emerald-600' : diff > 10 ? 'text-amber-600' : 'text-slate-400'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}%</p>}
                      </td>
                      <td className="px-3 py-2"><input type="number" min={1} value={getP(item.id, 'deliveryDays')} onChange={e => setP(item.id, 'deliveryDays', e.target.value)} className="w-14 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900" /></td>
                      <td className="px-3 py-2.5 font-medium text-slate-800">{up > 0 ? fmtINR(up * item.quantity) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr className="bg-slate-50 border-t-2 border-slate-200"><td colSpan={7} className="px-3 py-2.5 text-right font-medium text-slate-700">Total Bid</td><td className="px-3 py-2.5 font-bold text-slate-900 text-base">{totalBid > 0 ? fmtINR(totalBid) : '—'}</td></tr></tfoot>
            </table>
          </div>
        )}

        {step === 'terms' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <h3 className="font-semibold text-slate-900">Commercial Terms</h3>
            <div className="grid grid-cols-2 gap-5">
              <FormField label="Payment Terms" required><input type="text" className={inputCls} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} /></FormField>
              <FormField label="Bid Validity (days)"><input type="number" min={1} className={inputCls} value={validityDays} onChange={e => setValidityDays(e.target.value)} /></FormField>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl"><p className="text-sm font-medium text-slate-700 mb-2">Buyer Terms & Conditions</p><ol className="space-y-1">{bid.termsAndConditions.map((t, i) => <li key={i} className="text-xs text-slate-500 flex gap-2"><span className="font-mono text-slate-300">{i + 1}.</span>{t}</li>)}</ol></div>
          </div>
        )}

        {step === 'docs' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Supporting Documents</h3>
            <div className="space-y-2">{attachments.map(f => <div key={f} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"><div className="flex items-center gap-2"><Paperclip className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-700">{f}</span></div><span className="text-xs text-emerald-600 font-medium">Attached</span></div>)}</div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm border border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-slate-900 hover:text-slate-900 hover:bg-slate-100 transition-colors w-full justify-center"><Upload className="w-4 h-4" /> Add Document</button>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-sm"><p className="font-medium text-slate-700 mb-2">Summary</p>{[['Auction', bid.eBidNumber], ['Type', bid.bidType], ['Total Bid', fmtINR(totalBid)], ['Payment', paymentTerms], ['Validity', `${validityDays} days`]].map(([l, v]) => <div key={l} className="flex justify-between"><span className="text-slate-500">{l}</span><span className="text-slate-900 font-medium">{v}</span></div>)}</div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm"><p className="font-medium text-slate-700 mb-2">Documents ({attachments.length})</p>{attachments.map(f => <div key={f} className="flex items-center gap-1.5 text-slate-600 py-1"><Paperclip className="w-3.5 h-3.5 text-slate-400" />{f}</div>)}</div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500"><Lock className="w-3.5 h-3.5" />{bid.bidType === 'Sealed' ? 'Your bid is sealed and will only be revealed after the bid opening date.' : 'Your bid will be visible to the buyer upon submission.'}</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={() => stepIdx > 0 ? setStep(BID_STEPS[stepIdx - 1]) : onNavigate('list')} className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"><ArrowLeft className="w-4 h-4" />{stepIdx > 0 ? 'Previous' : 'Cancel'}</button>
          {stepIdx < BID_STEPS.length - 1 ? (
            <button onClick={() => setStep(BID_STEPS[stepIdx + 1])} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">Next</button>
          ) : (
            <button onClick={() => { setSubmitting(true); setTimeout(() => { setSubmitted(true); setSubmitting(false); }, 1500); }} disabled={!allPriced || submitting} className="flex items-center gap-2 px-5 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40">
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW: SUBMISSION DETAIL
// ─────────────────────────────────────────────────────────────
export function SubmissionDetail({ data, onNavigate }: { data: { bid: eBid; submissionId: string }; onNavigate: (v: string, d?: any) => void }) {
  const { bid, submissionId } = data;
  const sub = bid.submissions.find(s => s.id === submissionId);
  if (!sub) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Submission not found.</p></div>;
  const totalEst = bid.lineItems.reduce((s, i) => s + (i.estimatedUnitPrice || 0) * i.quantity, 0);
  const diffPct = totalEst > 0 ? ((sub.totalAmount - totalEst) / totalEst) * 100 : null;
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <button onClick={() => onNavigate('detail', bid)} className="mt-0.5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-xl font-semibold text-slate-900">Submission — {sub.submissionRef}</h1><p className="text-sm text-slate-500">{bid.eBidNumber} · {bid.title}</p></div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"><Download className="w-4 h-4" /> Export</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5"><p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Vendor</p><p className="font-semibold text-slate-900">{sub.vendorName}</p><p className="text-sm text-slate-500">{sub.submissionRef}</p><p className="text-xs text-slate-400">Submitted {sub.submittedDate}</p></div>
          <div className="bg-white border border-slate-200 rounded-xl p-5"><p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Submission Info</p><div className="space-y-1.5 text-sm"><div className="flex justify-between"><span className="text-slate-500">Status</span><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SUB_STATUS_CFG[sub.status] || 'bg-slate-100 text-slate-600'}`}>{sub.status}</span></div><div className="flex justify-between"><span className="text-slate-500">Total Bid</span><span className="font-bold text-slate-900">{fmtINR(sub.totalAmount)}</span></div>{diffPct !== null && <div className="flex justify-between"><span className="text-slate-500">vs. Estimate</span><span className={`text-xs font-medium ${diffPct < 0 ? 'text-emerald-600' : 'text-red-500'}`}>{diffPct > 0 ? '+' : ''}{diffPct.toFixed(1)}%</span></div>}</div></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-semibold text-slate-900">Bid Line Items</h3></div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{['Code','Description','Qty','Unit','Unit Price','Total','Delivery','vs Est.'].map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {sub.lineItems.map(li => {
                const orig = bid.lineItems.find(i => i.id === li.lineItemId);
                const diff = orig?.estimatedUnitPrice && orig.estimatedUnitPrice > 0 ? ((li.unitPrice - orig.estimatedUnitPrice) / orig.estimatedUnitPrice) * 100 : null;
                return <tr key={li.lineItemId} className="hover:bg-slate-50/50"><td className="px-3 py-2.5 font-mono text-xs text-slate-400">{li.code}</td><td className="px-3 py-2.5 text-slate-700">{li.description}</td><td className="px-3 py-2.5 text-slate-500">{li.quantity}</td><td className="px-3 py-2.5 text-slate-500">{li.unit}</td><td className="px-3 py-2.5 font-medium text-slate-800">{fmtINR(li.unitPrice)}</td><td className="px-3 py-2.5 font-semibold text-slate-900">{fmtINR(li.totalPrice)}</td><td className="px-3 py-2.5 text-slate-500">{li.deliveryDays}d</td><td className="px-3 py-2.5">{diff !== null ? <span className={`text-xs font-medium ${diff < 0 ? 'text-emerald-600' : 'text-red-500'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}%</span> : '—'}</td></tr>;
              })}
            </tbody>
            <tfoot><tr className="bg-slate-50 border-t-2 border-slate-200"><td colSpan={5} className="px-3 py-2.5 text-right font-medium text-slate-700">Total</td><td className="px-3 py-2.5 font-bold text-slate-900">{fmtINR(sub.totalAmount)}</td><td colSpan={2} /></tr></tfoot>
          </table>
        </div>
        {sub.attachments.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Attachments</h3>
            <div className="space-y-2">{sub.attachments.map(a => <div key={a.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"><div className="flex items-center gap-2"><Paperclip className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-700">{a.name}</span><span className="text-xs text-slate-400">({a.size})</span></div><button className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download</button></div>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP — navigation router
// ─────────────────────────────────────────────────────────────
type AppView = 'list' | 'create' | 'detail' | 'vendor-submit' | 'submission';

