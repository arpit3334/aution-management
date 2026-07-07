import React from 'react';
import { eBidStatus, VendorGateResult } from '@/types/auction';

export const STATUS_CFG: Record<eBidStatus, { dot: string; badge: string }> = {
  'Draft':             { dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-600' },
  'Published':         { dot: 'bg-slate-500',   badge: 'bg-slate-100 text-slate-700' },
  'Submission Open':   { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  'Submission Closed': { dot: 'bg-slate-500',   badge: 'bg-slate-100 text-slate-600' },
  'Bids Opened':       { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
  'Under Evaluation':  { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
  'Awarded':           { dot: 'bg-slate-900',   badge: 'bg-slate-900 text-white' },
  'Cancelled':         { dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border border-red-200' },
};

export const SUB_STATUS_CFG: Record<string, string> = {
  'Submitted':    'bg-slate-100 text-slate-700',
  'Revised':      'bg-slate-100 text-slate-700',
  'Withdrawn':    'bg-slate-100 text-slate-500',
  'Disqualified': 'bg-red-50 text-red-600 border border-red-200',
  'Shortlisted':  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Awarded':      'bg-slate-900 text-white',
};

export const RESULT_CFG: Record<VendorGateResult, { badge: string; label: string }> = {
  pending:     { badge: 'bg-slate-100 text-slate-500',                              label: 'Pending' },
  pass:        { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Pass' },
  fail:        { badge: 'bg-red-50 text-red-600 border border-red-200',             label: 'Fail' },
  eliminated:  { badge: 'bg-red-50 text-red-600 border border-red-200',             label: 'Eliminated' },
  recommended: { badge: 'bg-slate-900 text-white',                                  label: 'Recommended' },
};

export function StatusBadge({ status }: { status: eBidStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-white">{type}</span>;
}

export const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors";
export const lockedCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 bg-slate-50 cursor-not-allowed";

export function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
