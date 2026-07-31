'use client';
import { useState, useMemo } from 'react';
import {
  Gavel, Plus, Search, ArrowLeft, ArrowRight, Check, CheckCircle,
  Clock, Calendar, DollarSign, Users, Package, Building2, FileText,
  Lock, Send, MessageSquare, Upload, Award, TrendingDown, BarChart2,
  AlertCircle, Star, Download, Info, Hash, Tag, Briefcase, Eye,
  MoreHorizontal, Filter, RefreshCw, ShieldCheck, Paperclip,
  ChevronDown, ChevronUp, Edit2, XCircle, IndianRupee, Shield,
  Activity, Mail, TrendingUp, Timer
} from 'lucide-react';
import { eBid } from '@/types/auction';
import { FormField, inputCls, lockedCls, fmtINR } from '@/components/ui/shared';
import { AVAILABLE_RFQS, AVAILABLE_VENDORS } from '@/data/mockData';

// ─────────────────────────────────────────────────────────────
// VIEW: CREATE AUCTION (5-step wizard)
// ─────────────────────────────────────────────────────────────
const WIZARD_STEPS = [{ id: 1, label: 'Basic Details' }, { id: 2, label: 'Parameters' }, { id: 3, label: 'Line Items' }, { id: 4, label: 'Vendors' }, { id: 5, label: 'Review' }];

export function AuctionCreate({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) {
  const [step, setStep] = useState(1);
  const [selectedRFQ, setSelectedRFQ] = useState<typeof AVAILABLE_RFQS[0] | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bidType, setBidType] = useState<string>('Sealed');
  const [submissionOpen, setSubmissionOpen] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [bidOpeningDate, setBidOpeningDate] = useState('');
  const [validityDays, setValidityDays] = useState(90);
  const [bidBondRequired, setBidBondRequired] = useState(false);
  const [bidBondAmount, setBidBondAmount] = useState('');
  const [lineItems, setLineItems] = useState<Array<{ id: string; code: string; description: string; quantity: number; unit: string; specifications: string; estimatedUnitPrice: number }>>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [vendorSearch, setVendorSearch] = useState('');
  const [published, setPublished] = useState(false);

  const handleRFQChange = (code: string) => {
    const rfq = AVAILABLE_RFQS.find(r => r.code === code);
    setSelectedRFQ(rfq || null);
    if (rfq) { setTitle(rfq.title + ' – Auction'); setLineItems(rfq.items.map(i => ({ ...i, estimatedUnitPrice: i.estimatedUnitPrice || 0 }))); }
  };

  const toggleVendor = (id: string) => setSelectedVendors(p => p.includes(id) ? p.filter(v => v !== id) : [...p, id]);
  const estimatedTotal = lineItems.reduce((s, i) => s + i.estimatedUnitPrice * i.quantity, 0);
  const filteredVendors = AVAILABLE_VENDORS.filter(v => v.name.toLowerCase().includes(vendorSearch.toLowerCase()));

  const BID_TYPE_OPTIONS = [
    { type: 'Sealed', icon: <Lock className="w-5 h-5" />, desc: 'Vendors submit one confidential bid; all revealed simultaneously after deadline.' },
    { type: 'Open', icon: <Eye className="w-5 h-5" />, desc: 'All bids visible to participating vendors in real time.' },
    { type: 'Reverse Auction', icon: <TrendingDown className="w-5 h-5" />, desc: 'Vendors compete by lowering price in successive rounds.' },
    { type: 'Two-Envelope', icon: <Mail className="w-5 h-5" />, desc: 'Technical opens first, commercial only after qualification.' },
    { type: 'Multi-Attribute', icon: <BarChart2 className="w-5 h-5" />, desc: 'Weighted scoring across price, quality, risk, ESG.' },
    { type: 'English Auction', icon: <TrendingUp className="w-5 h-5" />, desc: 'Price rises, bidders outbid each other, highest wins.' },
    { type: 'Dutch Auction', icon: <Timer className="w-5 h-5" />, desc: 'Price drops automatically, first to accept wins.' },
  ];

  const handlePublish = () => { setTimeout(() => setPublished(true), 1200); };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div><h1 className="text-xl font-semibold text-slate-900">Create Auction</h1><p className="text-sm text-slate-500 mt-0.5">Link an RFQ and configure auction parameters</p></div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {WIZARD_STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > s.id ? 'bg-slate-900 text-white' : step === s.id ? 'bg-slate-900 text-white ring-4 ring-slate-900/10' : 'bg-slate-100 text-slate-400'}`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {idx < WIZARD_STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${step > s.id ? 'bg-slate-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-slate-900">Basic Details</h2>
              <FormField label="Linked RFQ" required hint="Category, department, and currency are auto-filled and locked from the selected RFQ.">
                <select className={inputCls} value={selectedRFQ?.code || ''} onChange={e => handleRFQChange(e.target.value)}>
                  <option value="">— Select an RFQ —</option>
                  {AVAILABLE_RFQS.map(r => <option key={r.code} value={r.code}>{r.code} — {r.title}</option>)}
                </select>
              </FormField>
              {selectedRFQ && (
                <div className="grid grid-cols-3 gap-4">
                  {[['Category', selectedRFQ.category], ['Department', selectedRFQ.department], ['Currency', selectedRFQ.currency]].map(([l, v]) => (
                    <FormField key={l} label={l}><div className="flex items-center gap-2"><input className={lockedCls} value={v} readOnly /><Lock className="w-4 h-4 text-slate-300 flex-shrink-0" /></div></FormField>
                  ))}
                </div>
              )}
              <FormField label="Auction Title" required><input type="text" className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. IT Hardware Supply – Q1 2025" /></FormField>
              <FormField label="Auction Type" required>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BID_TYPE_OPTIONS.map(opt => (
                    <button key={opt.type} onClick={() => setBidType(opt.type)} className={`p-4 rounded-xl border-2 text-left transition-all ${bidType === opt.type ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${bidType === opt.type ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>{opt.icon}</div>
                      <p className="font-medium text-slate-900 text-sm">{opt.type}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Description"><textarea className={inputCls + ' resize-none'} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Scope, requirements, and evaluation criteria…" /></FormField>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-slate-900">Auction Parameters</h2>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Submission Opens" required><input type="date" className={inputCls} value={submissionOpen} onChange={e => setSubmissionOpen(e.target.value)} /></FormField>
                <FormField label="Submission Deadline" required><input type="date" className={inputCls} value={submissionDeadline} onChange={e => setSubmissionDeadline(e.target.value)} /></FormField>
                <FormField label="Bid Opening Date" required><input type="date" className={inputCls} value={bidOpeningDate} onChange={e => setBidOpeningDate(e.target.value)} /></FormField>
              </div>
              <FormField label="Bid Validity (days)"><input type="number" min={1} className={inputCls} style={{ width: 160 }} value={validityDays} onChange={e => setValidityDays(parseInt(e.target.value) || 0)} /></FormField>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-slate-900">Bid Bond / EMD Required</p><p className="text-xs text-slate-500">Earnest money deposit as bank guarantee</p></div>
                  <button onClick={() => setBidBondRequired(!bidBondRequired)} className={`relative w-11 h-6 rounded-full transition-colors ${bidBondRequired ? 'bg-slate-900' : 'bg-slate-300'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${bidBondRequired ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                {bidBondRequired && <FormField label="Bid Bond Amount (₹)" required><input type="number" min={0} className={inputCls} value={bidBondAmount} onChange={e => setBidBondAmount(e.target.value)} placeholder="e.g. 25000" /></FormField>}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div><h2 className="font-semibold text-slate-900">Line Items</h2><p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" /> Code, description, quantity and unit are locked. Only estimated unit price is editable.</p></div>
              {lineItems.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300"><Package className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">Select an RFQ in Step 1 to load line items.</p></div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50"><tr>{['Code','Description','Qty','Unit','Est. Unit Price','Est. Total'].map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-slate-500">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {lineItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2.5 font-mono text-xs text-slate-400">{item.code}</td>
                          <td className="px-3 py-2.5 text-slate-700 bg-slate-50/30">{item.description}</td>
                          <td className="px-3 py-2.5 text-slate-500 bg-slate-50/30">{item.quantity}</td>
                          <td className="px-3 py-2.5 text-slate-500 bg-slate-50/30">{item.unit}</td>
                          <td className="px-3 py-2"><input type="number" min={0} step={0.01} value={item.estimatedUnitPrice || ''} onChange={e => setLineItems(p => p.map((it, i) => i === idx ? { ...it, estimatedUnitPrice: parseFloat(e.target.value) || 0 } : it))} placeholder="0" className="w-28 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900" /></td>
                          <td className="px-3 py-2.5 font-medium text-slate-800">{item.estimatedUnitPrice > 0 ? fmtINR(item.estimatedUnitPrice * item.quantity) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot><tr className="bg-slate-50 border-t-2 border-slate-200"><td colSpan={5} className="px-3 py-2.5 text-right font-medium text-slate-700">Total</td><td className="px-3 py-2.5 font-bold text-slate-900">{estimatedTotal > 0 ? fmtINR(estimatedTotal) : '—'}</td></tr></tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="font-semibold text-slate-900">Invite Vendors</h2><span className="text-sm text-slate-500">{selectedVendors.length} selected</span></div>
              <input type="text" placeholder="Search vendors…" value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900" />
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto">
                {filteredVendors.map(vendor => {
                  const checked = selectedVendors.includes(vendor.id);
                  return (
                    <button key={vendor.id} onClick={() => toggleVendor(vendor.id)} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${checked ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${checked ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>{checked && <Check className="w-3 h-3 text-white" />}</div>
                      <div className="min-w-0"><p className="font-medium text-slate-900 text-sm truncate">{vendor.name}</p><p className="text-xs text-slate-500 mt-0.5">{vendor.contact}</p><p className="text-xs text-slate-400">{vendor.category}</p></div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="font-semibold text-slate-900">Review & Publish</h2>
              {published ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-7 h-7 text-white" /></div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Auction Published</h3>
                  <p className="text-sm text-slate-500">Invitations sent to {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}.</p>
                  <button onClick={() => onNavigate('list')} className="mt-6 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Back to List</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
                      <p className="font-medium text-slate-700 mb-2">Auction Details</p>
                      {[['Title', title || '—'], ['Type', bidType], ['Linked RFQ', selectedRFQ?.code || '—'], ['Category', selectedRFQ?.category || '—']].map(([l, v]) => (
                        <div key={l} className="flex justify-between"><span className="text-slate-500">{l}</span><span className="text-slate-900 font-medium text-right max-w-[60%] truncate">{v}</span></div>
                      ))}
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-sm">
                      <p className="font-medium text-slate-700 mb-2">Timeline & Vendors</p>
                      {[['Opens', submissionOpen || '—'], ['Deadline', submissionDeadline || '—'], ['Bid Opening', bidOpeningDate || '—'], ['Validity', `${validityDays} days`], ['Vendors', `${selectedVendors.length} invited`]].map(([l, v]) => (
                        <div key={l} className="flex justify-between"><span className="text-slate-500">{l}</span><span className="text-slate-900 font-medium">{v}</span></div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Nav */}
          {!published && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button onClick={() => step > 1 ? setStep(s => s - 1) : onNavigate('list')} className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {step > 1 ? 'Previous' : 'Cancel'}
              </button>
              {step < 5 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !selectedRFQ} className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Save Draft</button>
                  <button onClick={handlePublish} className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"><Send className="w-4 h-4" /> Publish Auction</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VIEW: AUCTION DETAIL (6 tabs)
// ─────────────────────────────────────────────────────────────
type TabType = 'overview' | 'vendors' | 'submissions' | 'evaluation' | 'comparison' | 'award';

