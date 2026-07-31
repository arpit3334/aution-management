/**
 * AuctionModule.tsx — Standalone, self-contained component (v2.4)
 * Ported from the "NetSingularity · e-Auction · Visionwaves 2025" HTML prototype.
 * Includes: AuctionList, AuctionCreate, AuctionDetail,
 *           BidEvaluationGates, VendorBidPortal, VendorBidSubmissionView
 *
 * Dependencies: react, lucide-react
 * No other local imports required. Original hand-built CSS design system
 * (custom properties + classes such as .btn-primary, .card, .fmt-card, ...)
 * is preserved and injected once via <style> near the root.
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Gavel, Plus, Search, RefreshCw, Download, Columns3, ArrowLeft,
  ChevronDown, Check, CheckCircle2, Lock,
  Building2, FileText, Send, Upload, Award, TrendingDown, TrendingUp, BarChart3,
  AlertTriangle, X, ShieldCheck, ListChecks,
  MessageSquare, Trash2, Gauge, Hourglass, Layers,
  PauseCircle,
  LayoutGrid, PlusCircle,
} from 'lucide-react';
import { LiveDot, CompareColumns, TemplateLayout, UserSingle } from './custom-icons';
import AuctionReportsPage from './AuctionReports';
import EBidListPage from './eBidList';
import LiveAuctionRoomPage from './LiveAuctionRoom';
import QuestionnaireTemplatesPage from './QuestionnaireTemplates';
import DashboardPage from './Dashboard';
import CompareBidsPage from './CompareBids';

/* ═════════════════════════════════════════════════════════════
   DESIGN SYSTEM — original NST/Visionwaves CSS, trimmed to the
   rules actually used by the ported views (list / create / detail /
   evaluation gates / vendor portal), plus a small sidebar-shell block
   added back in for the app-wide left nav (see Sidebar/APP_SHELL_CSS
   below). Topbar, playbook, synopsis and notification panel styles
   remain out of scope for this component.
   ═════════════════════════════════════════════════════════════ */
const AUCTION_MODULE_CSS = `
.auction-module{
  --vw-color-white:#ffffff;
  --vw-color-gray-50:#f9fafb;--vw-color-gray-100:#f3f4f6;--vw-color-gray-200:#e5e7eb;
  --vw-color-gray-300:#d1d5db;--vw-color-gray-400:#9ca3af;--vw-color-gray-500:#6b7280;
  --vw-color-gray-600:#4b5563;--vw-color-gray-700:#374151;--vw-color-gray-800:#1f2937;--vw-color-gray-900:#111827;

  --vw-color-slate-50:#f8fafc;--vw-color-slate-100:#f1f5f9;--vw-color-slate-200:#e2e8f0;
  --vw-color-slate-300:#cbd5e1;--vw-color-slate-400:#94a3b8;--vw-color-slate-500:#64748b;
  --vw-color-slate-600:#475569;--vw-color-slate-700:#334155;--vw-color-slate-800:#1e293b;--vw-color-slate-900:#0f172a;

  --vw-color-teal-500:#14b8a6;--vw-color-teal-700:#0f766e;

  --vw-color-blue-50:#eff6ff;--vw-color-blue-100:#dbeafe;--vw-color-blue-300:#93c5fd;--vw-color-blue-500:#3b82f6;--vw-color-blue-600:#2563eb;--vw-color-blue-700:#1d4ed8;

  --vw-color-green-50:#f0fdf4;--vw-color-green-100:#dcfce7;--vw-color-green-200:#bbf7d0;--vw-color-green-500:#22c55e;--vw-color-green-600:#16a34a;--vw-color-green-700:#15803d;

  --vw-color-amber-50:#fffbeb;--vw-color-amber-100:#fef3c7;--vw-color-amber-200:#fde68a;--vw-color-amber-500:#f59e0b;--vw-color-amber-600:#d97706;--vw-color-amber-700:#b45309;--vw-color-amber-800:#92400e;

  --vw-color-red-50:#fef2f2;--vw-color-red-100:#fee2e2;--vw-color-red-200:#fecaca;--vw-color-red-300:#fca5a5;--vw-color-red-400:#f87171;--vw-color-red-500:#ef4444;--vw-color-red-600:#dc2626;--vw-color-red-700:#b91c1c;--vw-color-red-800:#991b1b;--vw-color-red-900:#7f1d1d;

  --vw-color-purple-50:#faf5ff;--vw-color-purple-200:#e9d5ff;--vw-color-purple-500:#8b5cf6;--vw-color-purple-600:#7c3aed;--vw-color-purple-700:#6d28d9;

  --brand:var(--vw-color-gray-900);
  --brand-hover:var(--vw-color-gray-800);
  --brand-soft:var(--vw-color-gray-100);
  --brand-ring:var(--vw-color-gray-200);

  --ink:var(--vw-color-gray-900);
  --paper:var(--vw-color-gray-50);
  --faint:var(--vw-color-gray-100);
  --border:var(--vw-color-gray-200);
  --card:var(--vw-color-white);

  --text-primary:var(--vw-color-gray-900);
  --text-muted:var(--vw-color-gray-500);
  --text-light:var(--vw-color-gray-400);

  --r-xs:4px;--r-sm:8px;--r-md:12px;--r-lg:16px;--r-pill:999px;
  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:20px;--sp-6:24px;--sp-8:32px;

  --shadow-resting:none;
  --shadow-sm:0 2px 4px 0 rgba(0,0,0,.06);
  --shadow-float:0 2px 2px -1px rgba(10,13,18,.04),0 4px 6px -2px rgba(10,13,18,.03),0 12px 16px -4px rgba(10,13,18,.08);

  --red:var(--vw-color-red-600);--green:var(--vw-color-green-600);--amber:var(--vw-color-amber-500);
  --blue:var(--vw-color-blue-500);--purple:var(--vw-color-purple-500);--teal:var(--brand);

  font-family:'Inter',system-ui,-apple-system,sans-serif;
  background:var(--paper);color:var(--text-primary);font-size:14px;line-height:1.4;
  -webkit-font-smoothing:antialiased;min-height:100vh;
}
.auction-module *{box-sizing:border-box}
.auction-module .av-page{padding:20px;max-width:1400px;margin:0 auto}
.auction-module .av-page-narrow{padding:20px;max-width:900px;margin:0 auto}

.auction-module .sec-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;gap:12px;flex-wrap:wrap}
.auction-module .sec-title{font-size:18px;font-weight:600;color:var(--ink);line-height:1.4;display:flex;align-items:center;gap:8px}
.auction-module .sec-sub{font-size:12.5px;color:var(--text-muted);margin-top:2px;font-weight:400}

.auction-module .btn{display:inline-flex;align-items:center;gap:6px;border-radius:var(--r-sm);font-weight:500;cursor:pointer;border:none;transition:background-color .12s ease-out,border-color .12s ease-out,color .12s ease-out;font-family:inherit}
.auction-module .btn:disabled{opacity:.45;cursor:not-allowed}
.auction-module .btn-primary{background:var(--brand);color:#fff;padding:8px 16px;font-size:14px;border-radius:var(--r-md)}
.auction-module .btn-primary:hover:not(:disabled){background:var(--brand-hover)}
.auction-module .btn-outline{background:#fff;color:var(--text-primary);border:1px solid var(--border);padding:7px 15px;font-size:14px;border-radius:var(--r-md)}
.auction-module .btn-outline:hover:not(:disabled){border-color:var(--vw-color-gray-400);background:var(--vw-color-gray-50)}
.auction-module .btn-ghost{background:transparent;color:var(--text-muted);border:none;padding:6px 10px;font-size:13px}
.auction-module .btn-ghost:hover{color:var(--text-primary);background:var(--vw-color-gray-100)}
.auction-module .btn-danger{background:var(--vw-color-red-50);color:var(--vw-color-red-700);border:1px solid var(--vw-color-red-200);padding:7px 15px;font-size:14px;border-radius:var(--r-md)}
.auction-module .btn-danger:hover{background:var(--vw-color-red-100)}
.auction-module .btn-green{background:var(--vw-color-green-50);color:var(--vw-color-green-700);border:1px solid var(--vw-color-green-100);padding:7px 15px;font-size:14px;border-radius:var(--r-md)}
.auction-module .btn-green:hover:not(:disabled){background:var(--vw-color-green-100)}
.auction-module .btn-sm{padding:5px 10px;font-size:12.5px;border-radius:var(--r-sm)}
.auction-module .btn-lg{padding:10px 22px;font-size:14px;border-radius:var(--r-md)}

.auction-module .icon-btn{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:var(--r-sm);background:transparent;border:1px solid transparent;color:var(--vw-color-gray-500);cursor:pointer;transition:all .12s ease-out;flex-shrink:0}
.auction-module .icon-btn:hover{background:var(--vw-color-gray-100);color:var(--vw-color-gray-700)}

.auction-module .card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-resting)}
.auction-module .card-hdr{padding:14px 16px;border-bottom:1px solid var(--faint);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.auction-module .card-hdr-title{font-size:14px;font-weight:600;color:var(--ink)}
.auction-module .card-body{padding:16px}

.auction-module .badge{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:var(--r-pill);font-size:12px;font-weight:500;line-height:18px}
.auction-module .badge-live{background:var(--vw-color-red-100);color:var(--vw-color-red-700)}
.auction-module .badge-live::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--vw-color-red-600);display:inline-block;animation:av-pulse 1.2s infinite}
.auction-module .badge-approved{background:var(--vw-color-green-100);color:var(--vw-color-green-700)}
.auction-module .badge-rejected{background:var(--vw-color-red-100);color:var(--vw-color-red-700)}
.auction-module .badge-pending{background:var(--vw-color-amber-100);color:var(--vw-color-amber-800)}
.auction-module .badge-draft{background:var(--vw-color-gray-100);color:var(--vw-color-gray-600)}
.auction-module .badge-closed{background:var(--vw-color-gray-100);color:var(--vw-color-gray-600)}
.auction-module .badge-awarded{background:var(--vw-color-blue-100);color:var(--vw-color-blue-700)}

.auction-module .vw-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:var(--r-pill);font-size:11px;font-weight:500;line-height:18px;white-space:nowrap}
.auction-module .vw-chip--neutral{background:var(--vw-color-gray-100);color:var(--vw-color-gray-600)}
.auction-module .vw-chip--neutral-solid{background:var(--vw-color-gray-800);color:#fff}
.auction-module .vw-chip--info{background:var(--vw-color-blue-100);color:var(--vw-color-blue-700)}
.auction-module .vw-chip--success{background:var(--vw-color-green-100);color:var(--vw-color-green-700)}
.auction-module .vw-chip--warning{background:var(--vw-color-amber-100);color:var(--vw-color-amber-800)}
.auction-module .vw-chip--error{background:var(--vw-color-red-100);color:var(--vw-color-red-700)}
@keyframes av-pulse{0%,100%{opacity:1}50%{opacity:.45}}

.auction-module .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.auction-module .stat-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px}
.auction-module .stat-label{font-size:12px;color:var(--text-muted);font-weight:500;margin-bottom:8px}
.auction-module .stat-val{font-size:22px;font-weight:300;color:var(--ink);line-height:1.3;letter-spacing:-.01em}
.auction-module .stat-delta{font-size:11.5px;color:var(--vw-color-green-600);margin-top:6px;font-weight:500}
.auction-module .stat-delta.neg{color:var(--vw-color-red-600)}

.auction-module .list-toolbar{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--faint);flex-wrap:wrap}
.auction-module .tb-count{font-size:13px;color:var(--text-muted);white-space:nowrap}
.auction-module .tb-search{display:flex;align-items:center;gap:6px;min-height:32px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--r-sm);background:#fff;min-width:180px}
.auction-module .tb-search input{border:none;outline:none;background:transparent;font-size:13px;color:var(--text-primary);width:100%;min-height:0;padding:0}
.auction-module .tb-search svg{flex-shrink:0;color:var(--text-light)}
.auction-module .filter-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--r-pill);border:1px solid var(--border);background:#fff;font-size:12.5px;font-weight:500;color:var(--text-primary);cursor:pointer;white-space:nowrap}
.auction-module .filter-chip:hover{border-color:var(--vw-color-gray-400)}
.auction-module .filter-chip.selected{background:var(--brand-ring);border-color:var(--vw-color-gray-400);color:var(--vw-color-gray-800)}
.auction-module .tb-spacer{flex:1}
.auction-module .tb-icons{display:flex;align-items:center;gap:2px}

.auction-module .tbl-wrap{overflow-x:auto}
.auction-module table{width:100%;border-collapse:collapse;font-size:13px}
.auction-module th{background:var(--vw-color-gray-50);padding:10px 14px;text-align:left;font-size:12px;font-weight:500;color:var(--text-muted);border-bottom:1px solid var(--border);white-space:nowrap}
.auction-module td{padding:11px 14px;border-bottom:1px solid var(--faint);vertical-align:middle;color:var(--text-primary)}
.auction-module tr:last-child td{border-bottom:none}
.auction-module tr:hover td{background:var(--vw-color-gray-50)}
.auction-module .td-mono{font-feature-settings:'tnum';font-size:12.5px;font-variant-numeric:tabular-nums}
.auction-module .td-bold{font-weight:500;color:var(--ink)}

.auction-module .form-grid{display:grid;gap:16px}
.auction-module .form-grid-2{grid-template-columns:1fr 1fr}
.auction-module .form-grid-3{grid-template-columns:1fr 1fr 1fr}
.auction-module .form-group{display:flex;flex-direction:column;gap:6px}
.auction-module .form-label{font-size:12px;font-weight:500;line-height:18px;color:var(--text-primary)}
.auction-module .form-label span{color:var(--vw-color-red-600);margin-left:2px}
.auction-module .form-hint{font-size:12px;line-height:18px;color:var(--text-light)}
.auction-module input,.auction-module select,.auction-module textarea{
  width:100%;min-height:36px;padding:6px 10px;
  border:1px solid var(--vw-color-gray-200);border-radius:var(--r-sm);
  font-size:14px;font-family:inherit;color:var(--vw-color-gray-700);
  background:#fff;outline:none;
  transition:border-color .12s ease-out,box-shadow .12s ease-out;
}
.auction-module input::placeholder,.auction-module textarea::placeholder{color:var(--vw-color-gray-400)}
.auction-module input:hover,.auction-module select:hover,.auction-module textarea:hover{border-color:var(--vw-color-gray-400)}
.auction-module input:focus,.auction-module select:focus,.auction-module textarea:focus{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-ring)}
.auction-module textarea{resize:vertical;min-height:72px;padding:8px 10px}
.auction-module input[type="checkbox"],.auction-module input[type="radio"]{width:16px;height:16px;min-height:0;accent-color:var(--brand);cursor:pointer}

.auction-module .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--vw-color-gray-50);border:1px solid var(--border);border-radius:var(--r-md)}
.auction-module .toggle-info .tl{font-size:13.5px;font-weight:500;color:var(--ink)}
.auction-module .toggle-info .ts{font-size:12px;color:var(--text-muted);margin-top:2px}
.auction-module .toggle{position:relative;width:36px;height:20px;flex-shrink:0;display:inline-block}
.auction-module .toggle input{opacity:0;width:0;height:0;position:absolute}
.auction-module .toggle-slider{position:absolute;inset:0;background:var(--vw-color-gray-300);border-radius:var(--r-pill);cursor:pointer;transition:.2s}
.auction-module .toggle-slider::before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}
.auction-module .toggle input:checked+.toggle-slider{background:var(--brand)}
.auction-module .toggle input:checked+.toggle-slider::before{transform:translateX(16px)}

.auction-module .stepper{display:flex;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:4px 0}
.auction-module .step{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--text-muted);cursor:pointer}
.auction-module .step-num{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;flex-shrink:0;background:#fff}
.auction-module .step.active .step-num{background:var(--brand);border-color:var(--brand);color:#fff}
.auction-module .step.active{color:var(--ink)}
.auction-module .step.done .step-num{background:var(--brand);border-color:var(--brand);color:#fff}
.auction-module .step.done{color:var(--text-muted)}
.auction-module .step-line{flex:1;height:1px;background:var(--border);margin:0 8px;min-width:16px}
.auction-module .step-line.done{background:var(--brand)}

.auction-module .fmt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.auction-module .fmt-card{border:1.5px solid var(--border);border-radius:var(--r-md);padding:14px 12px;cursor:pointer;transition:border-color .12s ease-out,background-color .12s ease-out;text-align:left;background:#fff}
.auction-module .fmt-card:hover{border-color:var(--vw-color-gray-300);background:var(--vw-color-gray-50)}
.auction-module .fmt-card.selected{border-color:var(--brand);background:var(--brand-soft)}
.auction-module .fmt-card-icon{width:30px;height:30px;border-radius:var(--r-sm);background:var(--vw-color-gray-100);color:var(--vw-color-gray-600);display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.auction-module .fmt-card.selected .fmt-card-icon{background:var(--brand);color:#fff}
.auction-module .fmt-card-title{font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.3;margin-bottom:4px}
.auction-module .fmt-card.selected .fmt-card-title{color:var(--brand-hover)}
.auction-module .fmt-card-desc{font-size:11px;color:var(--text-muted);line-height:1.5}
.auction-module .fmt-card-tag{display:inline-block;font-size:9.5px;font-weight:600;padding:1px 6px;border-radius:var(--r-pill);margin-top:6px;text-transform:uppercase;letter-spacing:.3px}
.auction-module .fmt-card-tag.procurement{background:var(--vw-color-gray-200);color:var(--vw-color-gray-800)}
.auction-module .fmt-card-tag.asset{background:var(--vw-color-blue-100);color:var(--vw-color-blue-700)}
.auction-module .fmt-card-tag.commodity{background:var(--vw-color-amber-100);color:var(--vw-color-amber-800)}
.auction-module .fmt-browse-toggle{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:var(--brand-hover);background:none;border:none;cursor:pointer;padding:8px 0 0;margin-bottom:4px}
.auction-module .fmt-browse-toggle:hover{text-decoration:underline}
.auction-module .fmt-config{margin-top:14px;background:var(--vw-color-gray-50);border:1px solid var(--border);border-radius:var(--r-md);padding:16px}
.auction-module .fmt-config-title{font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:12px;display:flex;align-items:center;gap:6px}
.auction-module .fmt-config-title svg{color:var(--brand-hover)}

.auction-module .price-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.auction-module .price-card{border:1px solid var(--border);border-radius:var(--r-md);padding:10px 12px}
.auction-module .price-card-label{font-size:10.5px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px}

.auction-module .room-switcher{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.auction-module .room-switcher-label{font-size:12px;color:var(--text-muted);font-weight:500;margin-right:4px}
.auction-module .room-tab{padding:6px 13px;border-radius:var(--r-pill);border:1px solid var(--border);background:#fff;font-size:12.5px;font-weight:500;color:var(--text-primary);cursor:pointer;transition:all .12s ease-out;white-space:nowrap}
.auction-module .room-tab:hover{border-color:var(--vw-color-gray-400)}
.auction-module .room-tab.active{background:var(--vw-color-gray-900);border-color:var(--vw-color-gray-900);color:#fff}

.auction-module .live-banner{background:var(--vw-color-red-900);border-radius:var(--r-lg);padding:16px 20px;display:flex;align-items:center;gap:16px;margin-bottom:18px;color:#fff;flex-wrap:wrap}
.auction-module .live-pulse{width:9px;height:9px;border-radius:50%;background:var(--vw-color-red-300);animation:av-pulse 1s infinite;flex-shrink:0}
.auction-module .live-title{font-size:14.5px;font-weight:600}
.auction-module .live-sub{font-size:12px;color:var(--vw-color-red-300);margin-top:3px}
.auction-module .countdown{margin-left:auto;text-align:right}
.auction-module .countdown-val{font-size:26px;font-weight:300;font-feature-settings:'tnum';line-height:1;font-variant-numeric:tabular-nums}
.auction-module .countdown-label{font-size:10.5px;color:var(--vw-color-red-300);margin-top:3px;letter-spacing:.3px}

.auction-module .bid-rank-table th{background:var(--vw-color-slate-800);color:var(--vw-color-slate-300)}
.auction-module .bid-rank-table tr.rank1 td{background:var(--vw-color-amber-50);font-weight:500}
.auction-module .rank-badge{width:20px;height:20px;border-radius:50%;background:var(--brand);color:#fff;font-size:10.5px;font-weight:600;display:flex;align-items:center;justify-content:center}
.auction-module .rank1 .rank-badge{background:var(--vw-color-amber-500)}

.auction-module .chart-bar-wrap{display:flex;flex-direction:column;gap:8px}
.auction-module .chart-bar-row{display:flex;align-items:center;gap:10px}
.auction-module .chart-bar-label{font-size:12px;font-weight:500;width:100px;text-align:right;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0}
.auction-module .chart-bar-outer{flex:1;background:var(--faint);border-radius:var(--r-xs);height:22px;position:relative}
.auction-module .chart-bar-inner{height:100%;border-radius:var(--r-xs);background:var(--brand);display:flex;align-items:center;padding-left:8px;transition:width .4s}
.auction-module .chart-bar-val{font-size:11.5px;font-weight:500;color:#fff;white-space:nowrap}
.auction-module .chart-bar-row.winner .chart-bar-inner{background:var(--vw-color-amber-500)}

.auction-module .savings-box{background:var(--vw-color-green-50);border:1px solid var(--vw-color-green-100);border-radius:var(--r-lg);padding:18px}
.auction-module .savings-title{font-size:13px;font-weight:600;color:var(--vw-color-green-700);margin-bottom:12px;display:flex;align-items:center;gap:6px}
.auction-module .savings-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.auction-module .savings-card{background:#fff;border:1px solid var(--vw-color-green-200);border-radius:var(--r-md);padding:14px 16px}
.auction-module .savings-card .val{font-size:20px;font-weight:300;color:var(--vw-color-green-700);letter-spacing:-.01em}
.auction-module .savings-card .lbl{font-size:11.5px;color:var(--vw-color-green-600);margin-top:6px;font-weight:500}

.auction-module .tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px;overflow-x:auto}
.auction-module .tab{padding:10px 16px;font-size:13px;font-weight:500;color:var(--text-muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:all .12s ease-out;background:none;border-top:none;border-left:none;border-right:none;font-family:inherit}
.auction-module .tab.active{color:var(--brand);border-bottom-color:var(--brand);font-weight:600}
.auction-module .tab:hover:not(.active){color:var(--ink)}

.auction-module .supplier-rank-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--r-md);margin-bottom:8px;background:#fff;cursor:pointer}
.auction-module .supplier-rank-row.rank1{border-color:var(--vw-color-amber-200);background:var(--vw-color-amber-50)}
.auction-module .supplier-rank-row.rank2{border-color:var(--vw-color-gray-300);background:var(--vw-color-gray-50)}
.auction-module .supplier-rank-row.rank3{border-color:#fdba74;background:#fff8f0}
.auction-module .rank-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0}
.auction-module .rank-num.r1{background:var(--vw-color-amber-500);color:#fff}
.auction-module .rank-num.r2{background:var(--vw-color-gray-400);color:#fff}
.auction-module .rank-num.r3{background:#cd7f32;color:#fff}
.auction-module .rank-num.r4{background:var(--vw-color-gray-200);color:var(--vw-color-gray-600)}
.auction-module .supplier-name{font-size:13.5px;font-weight:600;color:var(--ink);flex:1}
.auction-module .supplier-bid{font-size:13.5px;font-weight:600;color:var(--ink)}
.auction-module .supplier-savings{font-size:11.5px;color:var(--vw-color-green-600);font-weight:500}

.auction-module .q-item{border:1px solid var(--border);border-radius:var(--r-md);padding:12px 14px;margin-bottom:8px;background:#fff}
.auction-module .q-item-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.auction-module .q-text{font-size:13px;font-weight:500;color:var(--ink)}
.auction-module .q-type{font-size:11px;color:var(--text-muted);background:var(--faint);padding:2px 8px;border-radius:var(--r-pill);white-space:nowrap;font-weight:500}

.auction-module .ext-alert{background:var(--vw-color-amber-50);border:1px solid var(--vw-color-amber-200);border-radius:var(--r-md);padding:11px 14px;font-size:12.5px;color:var(--vw-color-amber-800);display:flex;align-items:center;gap:8px;margin-bottom:12px}

.auction-module .items-tbl th{background:var(--vw-color-gray-100)}
.auction-module .del-btn{background:none;border:none;color:var(--text-light);cursor:pointer;padding:2px 6px;display:inline-flex}
.auction-module .del-btn:hover{color:var(--vw-color-red-600)}

.auction-module .doc-zone{border:1.5px dashed var(--border);border-radius:var(--r-md);padding:24px;text-align:center;color:var(--text-muted);cursor:pointer;transition:border-color .12s ease-out,color .12s ease-out}
.auction-module .doc-zone:hover{border-color:var(--brand);color:var(--brand)}
.auction-module .doc-zone svg{margin:0 auto 8px}
.auction-module .doc-zone p{font-size:13px}

.auction-module .invite-chip{display:inline-flex;align-items:center;gap:6px;background:var(--faint);border:1px solid var(--border);padding:4px 12px;border-radius:var(--r-pill);font-size:12.5px;margin:3px;font-weight:500}
.auction-module .invite-chip .rm{cursor:pointer;color:var(--text-light);display:inline-flex}
.auction-module .invite-chip .rm:hover{color:var(--vw-color-red-600)}

.auction-module .approval-banner{background:var(--vw-color-amber-50);border:1px solid var(--vw-color-amber-200);border-radius:var(--r-lg);padding:16px 18px;display:flex;align-items:center;gap:12px;margin-bottom:16px}
.auction-module .approval-icon{width:36px;height:36px;background:var(--vw-color-amber-100);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.auction-module .approval-text .at{font-size:13.5px;font-weight:600;color:var(--vw-color-amber-800)}
.auction-module .approval-text .as{font-size:12.5px;color:var(--vw-color-amber-600);margin-top:2px}

.auction-module .supplier-view-banner{background:var(--vw-color-slate-900);border-radius:var(--r-lg);padding:18px 22px;color:#fff;margin-bottom:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.auction-module .sv-badge{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);color:#fff;font-size:11.5px;font-weight:500;padding:4px 12px;border-radius:var(--r-pill)}

.auction-module .cmp-tbl th.winner{background:var(--vw-color-amber-50);color:var(--vw-color-amber-800)}
.auction-module .cmp-tbl td.winner{background:var(--vw-color-amber-50);font-weight:600}
.auction-module .lowest{color:var(--vw-color-green-600);font-weight:600}

.auction-module .divider{height:1px;background:var(--faint);margin:16px 0}
.auction-module .info-row{display:flex;gap:28px;flex-wrap:wrap}
.auction-module .info-item{display:flex;flex-direction:column;gap:3px}
.auction-module .info-item .ik{font-size:11px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.4px}
.auction-module .info-item .iv{font-size:13.5px;font-weight:600;color:var(--ink)}
.auction-module .empty-state{text-align:center;padding:40px 20px;color:var(--text-muted)}
.auction-module .empty-state svg{margin:0 auto 12px;opacity:.35}
.auction-module .empty-state p{font-size:13px}
.auction-module .tag{display:inline-block;background:var(--faint);color:var(--text-muted);font-size:11px;padding:3px 10px;border-radius:var(--r-pill);font-weight:500}
.auction-module .action-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.auction-module .award-modal-card{box-shadow:var(--shadow-float)}
.auction-module .av-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px}
.auction-module .av-modal-card{background:#fff;border-radius:10px;width:520px;max-width:100%;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.3)}

/* ── App shell: left sidebar nav (added for path-based routing) ── */
.auction-module.app-shell{display:flex;min-height:100vh;background:var(--paper)}
.auction-module .app-sidebar{width:240px;flex-shrink:0;background:#fff;border-right:1px solid var(--border);padding:16px 10px;display:flex;flex-direction:column;gap:2px}
.auction-module .app-sidebar-brand{display:flex;align-items:center;gap:10px;padding:8px 10px 18px;font-size:15px;font-weight:600;color:var(--ink)}
.auction-module .app-sidebar-link{display:flex;align-items:center;gap:11px;padding:10px 12px;font-size:14px;font-weight:400;color:var(--ink);cursor:pointer;border-radius:var(--r-pill);text-decoration:none;transition:background-color .12s ease-out,color .12s ease-out;position:relative}
.auction-module .app-sidebar-link:hover{background:var(--vw-color-gray-100)}
.auction-module .app-sidebar-link.active{background:var(--brand);color:#fff}
.auction-module .app-sidebar-link.active svg{color:#fff}
.auction-module .app-sidebar-link svg{width:18px;height:18px;flex-shrink:0;color:var(--vw-color-gray-500)}
.auction-module .app-sidebar-label{flex:1}
.auction-module .app-sidebar-count{background:var(--vw-color-gray-100);color:var(--text-muted);font-size:11px;font-weight:600;padding:1px 7px;border-radius:var(--r-pill);line-height:16px}
.auction-module .app-sidebar-link.active .app-sidebar-count{background:rgba(255,255,255,.2);color:#fff}
.auction-module .app-sidebar-badge{background:var(--vw-color-red-600);color:#fff;font-size:11px;font-weight:600;padding:1px 7px;border-radius:var(--r-pill);line-height:16px}
.auction-module .app-content{flex:1;min-width:0;overflow-y:auto}
.auction-module .app-placeholder{padding:60px 20px;text-align:center;color:var(--text-muted)}
.auction-module .app-placeholder svg{margin:0 auto 14px;opacity:.35;width:40px;height:40px}
.auction-module .app-placeholder h2{font-size:16px;font-weight:600;color:var(--ink);margin-bottom:6px}
`;

/* ═════════════════════════════════════════════════════════════
   TYPES
   ═════════════════════════════════════════════════════════════ */
type AuctionFormatKey =
  | 'dynamic' | 'sealed' | 'twoenvelope' | 'multiattr' | 'hybrid'
  | 'bafo' | 'negotiation' | 'english' | 'dutch';

type AuctionStatus = 'Live' | 'Pending approval' | 'Draft' | 'Awarded' | 'Closed';

interface FormatMeta {
  label: string;
  desc: string;
  tag: string;
  tagClass: 'procurement' | 'asset' | 'commodity';
  icon: React.ReactNode;
}

interface AuctionSummary {
  id: string;
  auctionId: string;
  title: string;
  category: string;
  format: AuctionFormatKey;
  items: number;
  startPrice: number;
  suppliers: number;
  startDate: string;
  endDate: string;
  status: AuctionStatus;
}

interface LineItem {
  id: string;
  description: string;
  uom: string;
  qty: number;
  deliveryDate: string;
  startPrice: number;
  budgetPrice: number;
  historicalPrice: number;
}

interface RankedSupplier {
  rank: number;
  name: string;
  totalBid: number;
  savingsPct: number;
  bidsCount: number;
  lastBidAt: string;
}

interface ItemComparisonRow {
  item: string;
  qty: number;
  startPrice: number;
  bids: Record<string, number>;
}

interface BidHistoryEntry {
  time: string;
  supplier: string;
  item: string;
  value: number;
  change: number;
}

interface QuestionnaireAnswerRow {
  question: string;
  answers: Record<string, string>;
}

interface AuctionDetailData extends AuctionSummary {
  description: string;
  currency: string;
  lineItems: LineItem[];
  ranking: RankedSupplier[];
  itemComparison: ItemComparisonRow[];
  bidHistory: BidHistoryEntry[];
  questionnaireComparison: QuestionnaireAnswerRow[];
  budgetPriceTotal: number;
  suppliersList: string[];
}

type PQQType = 'File Upload' | 'Numeric' | 'Yes / No' | 'Text Area';
interface PQQQuestion { id: string; text: string; type: PQQType; required: boolean; }

interface PortalLineItem {
  id: string;
  description: string;
  qty: number;
  startPrice: number;
  currentLowest: number;
  yourLastBid: number;
}

/* ═════════════════════════════════════════════════════════════
   MOCK DATA
   ═════════════════════════════════════════════════════════════ */
const FORMAT_META: Record<AuctionFormatKey, FormatMeta> = {
  dynamic: { label: 'Dynamic reverse auction', desc: 'Continuous open window, suppliers bid down, rank visible', tag: 'Most common', tagClass: 'procurement', icon: <TrendingDown className="w-4 h-4" /> },
  sealed: { label: 'Sealed bid', desc: 'One hidden quote per supplier, all opened together', tag: 'Government / regulated', tagClass: 'procurement', icon: <Lock className="w-4 h-4" /> },
  twoenvelope: { label: 'Two-envelope (two-bid)', desc: 'Technical opens first, commercial only after qualification', tag: 'Government mandate', tagClass: 'procurement', icon: <Layers className="w-4 h-4" /> },
  multiattr: { label: 'Multi-attribute auction', desc: 'Weighted scoring across price, quality, risk, ESG', tag: 'Enterprise strategic', tagClass: 'procurement', icon: <BarChart3 className="w-4 h-4" /> },
  hybrid: { label: 'Hybrid RFQ + auction', desc: 'RFQ scores shortlist suppliers, then top N go live', tag: 'Complex sourcing', tagClass: 'procurement', icon: <ListChecks className="w-4 h-4" /> },
  bafo: { label: 'Best and final offer', desc: 'One last sealed round for shortlisted suppliers', tag: 'Fortune 500 strategic', tagClass: 'procurement', icon: <Award className="w-4 h-4" /> },
  negotiation: { label: 'Bilateral negotiation', desc: 'Private offer / counter-offer per supplier, not competitive', tag: 'Services / complex', tagClass: 'procurement', icon: <MessageSquare className="w-4 h-4" /> },
  english: { label: 'English auction', desc: 'Price rises, bidders outbid each other, highest wins', tag: 'Asset disposal', tagClass: 'asset', icon: <TrendingUp className="w-4 h-4" /> },
  dutch: { label: 'Dutch auction', desc: 'Price drops automatically, first to accept wins', tag: 'Time-sensitive / perishable', tagClass: 'commodity', icon: <Hourglass className="w-4 h-4" /> },
};

const STATUS_BADGE_CLASS: Record<AuctionStatus, string> = {
  Live: 'badge-live',
  'Pending approval': 'badge-pending',
  Draft: 'badge-draft',
  Awarded: 'badge-awarded',
  Closed: 'badge-closed',
};

const MOCK_AUCTIONS: AuctionSummary[] = [
  { id: 'A0041', auctionId: 'AUC-2025-0041', title: 'IT Hardware — Laptops & Monitors Q2', category: 'IT Equipment', format: 'dynamic', items: 3, startPrice: 1250000, suppliers: 5, startDate: '27 Mar 2025 14:00', endDate: '27 Mar 2025 16:00', status: 'Live' },
  { id: 'A0040', auctionId: 'AUC-2025-0040', title: 'Office Stationery & Supplies Annual', category: 'MRO', format: 'dynamic', items: 12, startPrice: 320000, suppliers: 4, startDate: '27 Mar 2025 10:00', endDate: '27 Mar 2025 11:30', status: 'Live' },
  { id: 'A0039', auctionId: 'AUC-2025-0039', title: 'Facility Management Services FY25', category: 'Facility', format: 'hybrid', items: 6, startPrice: 780000, suppliers: 6, startDate: '28 Mar 2025 09:00', endDate: '28 Mar 2025 11:00', status: 'Pending approval' },
  { id: 'A0038', auctionId: 'AUC-2025-0038', title: 'Manpower Supply — Warehouse Staff', category: 'HR Services', format: 'dynamic', items: 2, startPrice: 2100000, suppliers: 7, startDate: '30 Mar 2025 13:00', endDate: '30 Mar 2025 15:00', status: 'Draft' },
  { id: 'A0037', auctionId: 'AUC-2025-0037', title: 'Network Infrastructure — Switches & Routers', category: 'IT Infrastructure', format: 'dynamic', items: 4, startPrice: 940000, suppliers: 5, startDate: '20 Mar 2025 10:00', endDate: '20 Mar 2025 12:30', status: 'Awarded' },
  { id: 'A0044', auctionId: 'AUC-2025-0044', title: 'Annual Software Licensing Renewal', category: 'Professional Services', format: 'sealed', items: 8, startPrice: 1450000, suppliers: 6, startDate: '26 Mar 2025 09:00', endDate: '26 Mar 2025 09:00', status: 'Live' },
  { id: 'A0046', auctionId: 'AUC-2025-0046', title: 'Enterprise Cloud Migration Services', category: 'IT Infrastructure', format: 'hybrid', items: 1, startPrice: 3600000, suppliers: 4, startDate: '25 Mar 2025 09:00', endDate: '25 Mar 2025 17:00', status: 'Live' },
  { id: 'A0050', auctionId: 'AUC-2025-0050', title: 'Enterprise ERP System Replacement', category: 'IT Infrastructure', format: 'twoenvelope', items: 1, startPrice: 12500000, suppliers: 7, startDate: '26 Mar 2025 09:00', endDate: '02 Apr 2025 17:00', status: 'Live' },
  { id: 'ENG0003', auctionId: 'ENG-2025-0003', title: 'Excess IT Assets — Data Centre Hardware Lot', category: 'IT Equipment', format: 'english', items: 1, startPrice: 500000, suppliers: 12, startDate: '27 Mar 2025 13:00', endDate: '27 Mar 2025 14:30', status: 'Live' },
  { id: 'DUTCH0001', auctionId: 'DUTCH-2025-0001', title: 'Treasury Bills — SAR 500M Issuance', category: 'Treasury', format: 'dutch', items: 1, startPrice: 5000000, suppliers: 8, startDate: '27 Mar 2025 09:00', endDate: '27 Mar 2025 17:00', status: 'Live' },
  { id: 'A0053', auctionId: 'AUC-2025-0053', title: 'Ministry Data Centre Fit-Out', category: 'Facility', format: 'sealed', items: 9, startPrice: 2400000, suppliers: 0, startDate: '10 Apr 2025 09:00', endDate: '10 Apr 2025 09:00', status: 'Draft' },
  { id: 'A0028', auctionId: 'AUC-2025-0028', title: 'Municipal Street Lighting Upgrade', category: 'Facility', format: 'sealed', items: 2, startPrice: 1750000, suppliers: 7, startDate: '18 Feb 2025 10:00', endDate: '18 Feb 2025 10:00', status: 'Closed' },
  { id: 'A0021', auctionId: 'AUC-2025-0021', title: 'Water Treatment Plant Chemicals — Annual', category: 'MRO', format: 'twoenvelope', items: 8, startPrice: 2260000, suppliers: 5, startDate: '05 Feb 2025 09:00', endDate: '05 Feb 2025 09:00', status: 'Awarded' },
  { id: 'A0058', auctionId: 'AUC-2025-0058', title: 'Enterprise ERP Managed Services — 3yr', category: 'Professional Services', format: 'multiattr', items: 1, startPrice: 9600000, suppliers: 5, startDate: '30 Mar 2025 09:00', endDate: '06 Apr 2025 17:00', status: 'Pending approval' },
  { id: 'A0049', auctionId: 'AUC-2025-0049', title: 'Legal Advisory Retainer — Annual', category: 'Professional Services', format: 'negotiation', items: 1, startPrice: 1200000, suppliers: 3, startDate: '31 Mar 2025 09:00', endDate: '14 Apr 2025 17:00', status: 'Pending approval' },
  { id: 'A0060', auctionId: 'AUC-2025-0060', title: 'Facility Security Services — BAFO', category: 'Facility', format: 'bafo', items: 1, startPrice: 1840000, suppliers: 3, startDate: '28 Mar 2025 09:00', endDate: '30 Mar 2025 17:00', status: 'Live' },
  { id: 'DUTCH0002', auctionId: 'DUTCH-2025-0002', title: 'Bulk Diesel Fuel Supply — Q2 Contract', category: 'MRO', format: 'dutch', items: 1, startPrice: 4200000, suppliers: 0, startDate: '08 Apr 2025 09:00', endDate: '08 Apr 2025 09:00', status: 'Pending approval' },
];

// Detailed record — matches the deeply-worked HTML example (AUC-2025-0041)
const DETAIL_AUCTION: AuctionDetailData = {
  ...MOCK_AUCTIONS[0],
  description: 'Procurement of IT hardware including laptops, desktop monitors, and docking stations for Q2 2025. Vendors must comply with NetSingularity IT policy standards.',
  currency: 'SAR',
  suppliersList: ['Lenovo Middle East FZE', 'Dell Technologies KSA', 'HP Inc. Arabia', 'Acer Gulf Distribution', 'Samsung Gulf'],
  lineItems: [
    { id: 'LI1', description: 'Lenovo ThinkPad E15 Laptop — i7, 16GB, 512GB SSD', uom: 'Each', qty: 50, deliveryDate: '2025-04-15', startPrice: 4800, budgetPrice: 4500, historicalPrice: 5100 },
    { id: 'LI2', description: 'Dell 27" QHD Monitor P2723D', uom: 'Each', qty: 50, deliveryDate: '2025-04-15', startPrice: 1600, budgetPrice: 1450, historicalPrice: 1750 },
    { id: 'LI3', description: 'Lenovo ThinkPad USB-C Docking Station', uom: 'Each', qty: 50, deliveryDate: '2025-04-15', startPrice: 900, budgetPrice: 820, historicalPrice: 950 },
  ],
  budgetPriceTotal: 4500 * 50 + 1450 * 50 + 820 * 50,
  ranking: [
    { rank: 1, name: 'Lenovo Middle East FZE', totalBid: 323000, savingsPct: 11.5, bidsCount: 14, lastBidAt: '14:36:04' },
    { rank: 2, name: 'Dell Technologies KSA', totalBid: 332500, savingsPct: 8.9, bidsCount: 11, lastBidAt: '14:35:48' },
    { rank: 3, name: 'HP Inc. Arabia', totalBid: 342500, savingsPct: 6.2, bidsCount: 8, lastBidAt: '14:34:12' },
    { rank: 4, name: 'Acer Gulf Distribution', totalBid: 353000, savingsPct: 3.3, bidsCount: 5, lastBidAt: '14:31:57' },
    { rank: 5, name: 'Samsung Gulf', totalBid: 362500, savingsPct: 0.7, bidsCount: 3, lastBidAt: '14:28:30' },
  ],
  itemComparison: [
    { item: 'Laptop (per unit)', qty: 50, startPrice: 4800, bids: { 'Lenovo ME': 4250, 'Dell KSA': 4380, 'HP Arabia': 4520, 'Acer Gulf': 4650, 'Samsung Gulf': 4750 } },
    { item: 'Monitor (per unit)', qty: 50, startPrice: 1600, bids: { 'Lenovo ME': 1420, 'Dell KSA': 1450, 'HP Arabia': 1480, 'Acer Gulf': 1530, 'Samsung Gulf': 1580 } },
    { item: 'Docking Station (per unit)', qty: 50, startPrice: 900, bids: { 'Lenovo ME': 790, 'Dell KSA': 820, 'HP Arabia': 850, 'Acer Gulf': 880, 'Samsung Gulf': 920 } },
  ],
  bidHistory: [
    { time: '14:36:04', supplier: 'Lenovo ME FZE', item: 'Laptop', value: 4250, change: -70 },
    { time: '14:35:48', supplier: 'Dell Tech KSA', item: 'Monitor', value: 1450, change: -40 },
    { time: '14:35:21', supplier: 'Lenovo ME FZE', item: 'Docking', value: 790, change: -20 },
    { time: '14:34:12', supplier: 'HP Inc. Arabia', item: 'Laptop', value: 4520, change: -60 },
    { time: '14:33:45', supplier: 'Dell Tech KSA', item: 'Laptop', value: 4380, change: -70 },
    { time: '14:31:57', supplier: 'Acer Gulf', item: 'Monitor', value: 1530, change: -40 },
    { time: '14:28:30', supplier: 'Samsung Gulf', item: 'Docking', value: 920, change: -40 },
  ],
  questionnaireComparison: [
    { question: 'VAT registration certificate', answers: { 'Lenovo ME #1': '✓ Uploaded', 'Dell KSA': '✓ Uploaded', 'HP Arabia': '✓ Uploaded' } },
    { question: 'Lead time (working days)', answers: { 'Lenovo ME #1': '7 days', 'Dell KSA': '10 days', 'HP Arabia': '12 days' } },
    { question: 'SASO standards compliance', answers: { 'Lenovo ME #1': '✓ Yes', 'Dell KSA': '✓ Yes', 'HP Arabia': '✓ Yes' } },
    { question: 'Warranty terms', answers: { 'Lenovo ME #1': '3yr laptop / 3yr monitor / 2yr dock, on-site 48h', 'Dell KSA': '3yr laptop / 3yr monitor / 1yr dock, NBD courier', 'HP Arabia': '2yr laptop / 2yr monitor / 1yr dock, depot repair' } },
    { question: 'On-site support in KSA', answers: { 'Lenovo ME #1': '✓ Riyadh, Jeddah, Dammam', 'Dell KSA': '✓ Riyadh, Jeddah', 'HP Arabia': 'Partial — Riyadh only' } },
  ],
};

const PQQ_QUESTIONS: PQQQuestion[] = [
  { id: 'q1', text: 'Do you have a valid VAT registration certificate? Please upload a copy.', type: 'File Upload', required: true },
  { id: 'q2', text: 'What is your lead time for delivery after PO issuance? (in working days)', type: 'Numeric', required: true },
  { id: 'q3', text: 'Confirm that all equipment meets Saudi SASO standards and CE marking requirements.', type: 'Yes / No', required: true },
  { id: 'q4', text: 'Provide warranty terms for each item category (Laptops / Monitors / Docking Stations).', type: 'Text Area', required: false },
  { id: 'q5', text: 'Do you offer on-site support and maintenance services in KSA?', type: 'Yes / No', required: true },
];

const PORTAL_LINE_ITEMS: PortalLineItem[] = [
  { id: 'LI1', description: 'Lenovo ThinkPad E15 Laptop', qty: 50, startPrice: 4800, currentLowest: 4250, yourLastBid: 4250 },
  { id: 'LI2', description: 'Dell 27" QHD Monitor', qty: 50, startPrice: 1600, currentLowest: 1420, yourLastBid: 1420 },
  { id: 'LI3', description: 'Lenovo Docking Station', qty: 50, startPrice: 900, currentLowest: 790, yourLastBid: 790 },
];

/* ═════════════════════════════════════════════════════════════
   UTILITIES
   ═════════════════════════════════════════════════════════════ */
const fmtSAR = (v: number) => 'SAR ' + Math.round(v).toLocaleString('en-US');

function fmtCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => (n < 10 ? '0' : '') + n;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

/* ═════════════════════════════════════════════════════════════
   SHARED UI ATOMS
   ═════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: AuctionStatus }) {
  return <span className={`badge ${STATUS_BADGE_CLASS[status]}`}>{status}</span>;
}

function SectionHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="sec-hdr">
      <div>
        <div className="sec-title">{title}</div>
        {sub && <div className="sec-sub">{sub}</div>}
      </div>
      {actions && <div className="action-bar">{actions}</div>}
    </div>
  );
}

function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span>*</span>}</label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="empty-state">
      {icon}
      <p>{text}</p>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   VIEW: AUCTION LIST
   ═════════════════════════════════════════════════════════════ */
function AuctionList({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AuctionStatus>('All');

  const filtered = useMemo(() => MOCK_AUCTIONS.filter(a => {
    const q = search.toLowerCase();
    const matchesQ = !q || a.title.toLowerCase().includes(q) || a.auctionId.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesQ && matchesStatus;
  }), [search, statusFilter]);

  const totals = {
    total: MOCK_AUCTIONS.length,
    value: MOCK_AUCTIONS.reduce((s, a) => s + a.startPrice, 0),
    live: MOCK_AUCTIONS.filter(a => a.status === 'Live').length,
    awarded: MOCK_AUCTIONS.filter(a => a.status === 'Awarded').length,
  };

  const actionFor = (a: AuctionSummary) => {
    if (a.status === 'Live') return { label: 'Join', cls: 'btn-primary', go: () => onNavigate('detail', a) };
    if (a.status === 'Awarded' || a.status === 'Closed') return { label: 'Results', cls: 'btn-outline', go: () => onNavigate('detail', a) };
    if (a.status === 'Draft') return { label: 'Edit', cls: 'btn-outline', go: () => onNavigate('create', a) };
    return { label: 'Review', cls: 'btn-outline', go: () => onNavigate('detail', a) };
  };

  return (
    <div className="auction-module">
      <div className="av-page">
        <SectionHeader
          title="All auctions"
          sub="Every reverse auction created by your team"
          actions={
            <button className="btn btn-primary" onClick={() => onNavigate('create')}>
              <Plus className="w-3.5 h-3.5" /> New auction
            </button>
          }
        />

        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Total auctions</div><div className="stat-val">{totals.total}</div><div className="stat-delta">↑ 4 this month</div></div>
          <div className="stat-card"><div className="stat-label">Total value under auction</div><div className="stat-val">{fmtSAR(totals.value)}</div><div className="stat-delta">Across all statuses</div></div>
          <div className="stat-card"><div className="stat-label">Live right now</div><div className="stat-val">{totals.live}</div><div className="stat-delta">Bidding open</div></div>
          <div className="stat-card"><div className="stat-label">Awarded</div><div className="stat-val">{totals.awarded}</div><div className="stat-delta">Converting to PO</div></div>
        </div>

        <div className="card">
          <div className="list-toolbar">
            <span className="tb-count">Displaying {filtered.length} of {MOCK_AUCTIONS.length}</span>
            <div className="tb-search">
              <Search className="w-3.5 h-3.5" />
              <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ width: 'auto', minHeight: 32, fontSize: 12.5 }}>
              <option value="All">All statuses</option>
              {(['Live', 'Pending approval', 'Draft', 'Awarded', 'Closed'] as AuctionStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="tb-spacer" />
            <div className="tb-icons">
              <span className="icon-btn" title="Refresh"><RefreshCw className="w-4 h-4" /></span>
              <span className="icon-btn" title="Export"><Download className="w-4 h-4" /></span>
              <span className="icon-btn" title="Columns"><Columns3 className="w-4 h-4" /></span>
            </div>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Auction ID</th><th>Title</th><th>Category</th><th>Format</th><th>Items</th>
                  <th>Start price</th><th>Suppliers</th><th>Start date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => {
                  const action = actionFor(a);
                  return (
                    <tr key={a.id}>
                      <td className="td-mono">{a.auctionId}</td>
                      <td>
                        <button className="btn-ghost" style={{ padding: 0, fontWeight: 500, color: 'var(--ink)', textAlign: 'left' }} onClick={() => onNavigate('detail', a)}>{a.title}</button>
                      </td>
                      <td>{a.category}</td>
                      <td>{FORMAT_META[a.format].label}</td>
                      <td>{a.items}</td>
                      <td className="td-mono">{fmtSAR(a.startPrice)}</td>
                      <td>{a.suppliers}</td>
                      <td>{a.startDate}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td><button className={`btn btn-sm ${action.cls}`} onClick={action.go}>{action.label}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState icon={<Gavel className="w-8 h-8" />} text="No auctions match your filters." />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   VIEW: AUCTION CREATE (6-step wizard)
   ═════════════════════════════════════════════════════════════ */
const WIZARD_STEPS = ['Auction details', 'Questionnaire', 'Items and pricing', 'Documents', 'Invite suppliers', 'Review and publish'];

interface WizardItem { id: string; description: string; uom: string; qty: number; deliveryDate: string; startPrice: number; budgetPrice: number; historicalPrice: number; }
interface WizardVendor { id: string; name: string; category: string; rating: string; country: string; checked: boolean; }

function AuctionCreate({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('IT Hardware — Laptops & Monitors Q2 2025');
  const [category, setCategory] = useState('IT Equipment');
  const [format, setFormat] = useState<AuctionFormatKey>('dynamic');
  const [showAllFormats, setShowAllFormats] = useState(false);
  const [currency, setCurrency] = useState('SAR — Saudi Riyal');
  const [description, setDescription] = useState('Procurement of IT hardware including laptops, desktop monitors, and docking stations for Q2 2025.');
  const [showLowestBid, setShowLowestBid] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [startDateTime, setStartDateTime] = useState('2025-03-27T14:00');
  const [endDateTime, setEndDateTime] = useState('2025-03-27T16:00');
  const [minDecrement, setMinDecrement] = useState(500);

  const [questions, setQuestions] = useState<PQQQuestion[]>(PQQ_QUESTIONS);
  const [showNewQ, setShowNewQ] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState<PQQType>('Yes / No');

  const [items, setItems] = useState<WizardItem[]>([
    { id: 'i1', description: 'Lenovo ThinkPad E15 Laptop — i7, 16GB, 512GB SSD', uom: 'Each', qty: 50, deliveryDate: '2025-04-15', startPrice: 4800, budgetPrice: 4500, historicalPrice: 5100 },
    { id: 'i2', description: 'Dell 27" QHD Monitor P2723D', uom: 'Each', qty: 50, deliveryDate: '2025-04-15', startPrice: 1600, budgetPrice: 1450, historicalPrice: 1750 },
    { id: 'i3', description: 'Lenovo ThinkPad USB-C Docking Station', uom: 'Each', qty: 50, deliveryDate: '2025-04-15', startPrice: 900, budgetPrice: 820, historicalPrice: 950 },
  ]);

  const [vendors, setVendors] = useState<WizardVendor[]>([
    { id: 'VND-1042', name: 'Lenovo Middle East FZE', category: 'IT Equipment', rating: '4.6 / 5', country: 'UAE', checked: true },
    { id: 'VND-1087', name: 'Dell Technologies KSA', category: 'IT Equipment', rating: '4.4 / 5', country: 'KSA', checked: true },
    { id: 'VND-1102', name: 'HP Inc. Arabia', category: 'IT Equipment', rating: '4.3 / 5', country: 'KSA', checked: true },
    { id: 'VND-1156', name: 'Acer Gulf Distribution', category: 'IT Equipment', rating: '4.1 / 5', country: 'UAE', checked: true },
    { id: 'VND-1198', name: 'MSI Arabia', category: 'IT Equipment', rating: '3.9 / 5', country: 'KSA', checked: false },
  ]);
  const [emailInvites, setEmailInvites] = useState<string[]>(['procurement@samsung-gulf.com']);
  const [extEmail, setExtEmail] = useState('');
  const [published, setPublished] = useState(false);

  const addItem = () => setItems(p => [...p, { id: 'i' + (p.length + 1) + '-' + Date.now(), description: '', uom: 'Each', qty: 1, deliveryDate: '', startPrice: 0, budgetPrice: 0, historicalPrice: 0 }]);
  const delItem = (id: string) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id: string, patch: Partial<WizardItem>) => setItems(p => p.map(i => i.id === id ? { ...i, ...patch } : i));

  const toggleVendor = (id: string) => setVendors(p => p.map(v => v.id === id ? { ...v, checked: !v.checked } : v));
  const addEmailInvite = () => {
    const email = extEmail.trim();
    if (!email) return;
    setEmailInvites(p => [...p, email]);
    setExtEmail('');
  };
  const removeEmailInvite = (email: string) => setEmailInvites(p => p.filter(e => e !== email));

  const invitedCount = vendors.filter(v => v.checked).length + emailInvites.length;
  const totalStart = items.reduce((s, i) => s + i.startPrice * i.qty, 0);
  const formatKeys = Object.keys(FORMAT_META) as AuctionFormatKey[];
  const primaryFormats = formatKeys.slice(0, 3);
  const advancedFormats = formatKeys.slice(3);

  const saveQuestion = () => {
    if (!newQText.trim()) return;
    setQuestions(p => [...p, { id: 'nq' + Date.now(), text: newQText, type: newQType, required: true }]);
    setNewQText('');
    setShowNewQ(false);
  };

  if (published) {
    return (
      <div className="auction-module">
        <div className="av-page-narrow">
          <div className="card" style={{ marginTop: 40 }}>
            <div className="card-body" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ width: 56, height: 56, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 className="w-7 h-7" color="#fff" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Auction submitted for approval</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Invitations queued for {invitedCount} supplier{invitedCount !== 1 ? 's' : ''}. Approver: Mariam Al-Dosari.</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => onNavigate('ebid-list')}>Back to list</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auction-module">
      <div className="av-page">
        <button className="btn btn-ghost" style={{ marginBottom: 14 }} onClick={() => onNavigate('ebid-list')}>
          <ArrowLeft className="w-3.5 h-3.5" /> All auctions
        </button>

        <div className="stepper">
          {WIZARD_STEPS.map((label, idx) => {
            const n = idx + 1;
            const cls = n < step ? 'step done' : n === step ? 'step active' : 'step';
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', flex: n < WIZARD_STEPS.length ? 1 : undefined }}>
                <div className={cls} onClick={() => setStep(n)}>
                  <div className="step-num">{n < step ? <Check className="w-3 h-3" /> : n}</div>
                  <span>{label}</span>
                </div>
                {n < WIZARD_STEPS.length && <div className={`step-line ${n < step ? 'done' : ''}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr"><span className="card-hdr-title">Basic information</span></div>
              <div className="card-body">
                <div className="form-grid form-grid-2" style={{ marginBottom: 14 }}>
                  <FormField label="Auction title" required><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter auction title" /></FormField>
                  <FormField label="Category" required>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      {['IT Equipment', 'Facility', 'MRO', 'Professional Services', 'HR Services'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Auction format <span>*</span></label>
                  <div className="fmt-grid">
                    {(showAllFormats ? [...primaryFormats, ...advancedFormats] : primaryFormats).map(key => {
                      const meta = FORMAT_META[key];
                      return (
                        <div key={key} className={`fmt-card ${format === key ? 'selected' : ''}`} onClick={() => setFormat(key)}>
                          <div className="fmt-card-icon">{meta.icon}</div>
                          <div className="fmt-card-title">{meta.label}</div>
                          <div className="fmt-card-desc">{meta.desc}</div>
                          <div className={`fmt-card-tag ${meta.tagClass}`}>{meta.tag}</div>
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" className="fmt-browse-toggle" onClick={() => setShowAllFormats(s => !s)}>
                    {showAllFormats ? 'Show fewer formats' : `Browse all ${formatKeys.length} formats`}
                    <ChevronDown className="w-3 h-3" style={{ transform: showAllFormats ? 'rotate(180deg)' : undefined }} />
                  </button>

                  <div className="fmt-config">
                    <div className="fmt-config-title">{FORMAT_META[format].icon} {FORMAT_META[format].label} settings</div>
                    {format === 'dynamic' && (
                      <div className="form-grid form-grid-3">
                        <FormField label="Bid visibility to suppliers"><select><option>Rank only (recommended)</option><option>Rank + lowest bid value</option><option>Full leaderboard</option></select></FormField>
                        <FormField label="Minimum bid decrement" hint="Minimum amount each new bid must improve by"><input type="number" value={minDecrement} onChange={e => setMinDecrement(parseInt(e.target.value) || 0)} /></FormField>
                        <FormField label="Auto-extension trigger"><select><option>Last 5 min → +5 min</option><option>Last 10 min → +10 min</option><option>No auto-extension</option></select></FormField>
                      </div>
                    )}
                    {format === 'sealed' && (
                      <div className="form-grid form-grid-3">
                        <FormField label="Bid opening date and time"><input type="datetime-local" defaultValue="2025-03-27T16:00" /></FormField>
                        <FormField label="Opening attendees"><select><option>Procurement team only</option><option>Procurement + committee</option></select></FormField>
                        <FormField label="Allow bid revision before close"><select><option>Yes, until deadline</option><option>No, one submission only</option></select></FormField>
                      </div>
                    )}
                    {format === 'english' && (
                      <div className="form-grid form-grid-3">
                        <FormField label="Starting price (reserve)" hint="Minimum acceptable opening bid"><input type="number" defaultValue={500000} /></FormField>
                        <FormField label="Minimum bid increment"><input type="number" defaultValue={50000} /></FormField>
                        <FormField label="Reserve price visible to bidders"><select><option>Hidden</option><option>Visible</option></select></FormField>
                      </div>
                    )}
                    {format === 'dutch' && (
                      <div className="form-grid form-grid-3">
                        <FormField label="Opening price" hint="Price starts here and drops automatically"><input type="number" defaultValue={5000000} /></FormField>
                        <FormField label="Price drop interval (seconds)"><input type="number" defaultValue={30} /></FormField>
                        <FormField label="Price drop amount per interval"><input type="number" defaultValue={50000} /></FormField>
                      </div>
                    )}
                    {!['dynamic', 'sealed', 'english', 'dutch'].includes(format) && (
                      <p className="form-hint">Format-specific settings for {FORMAT_META[format].label} are configured after auction details are saved.</p>
                    )}
                  </div>
                </div>

                <FormField label="Currency" required>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ maxWidth: 260 }}>
                    <option>SAR — Saudi Riyal</option><option>USD — US Dollar</option><option>EUR — Euro</option>
                  </select>
                </FormField>
                <div className="form-group" style={{ margin: '14px 0' }}>
                  <label className="form-label">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the scope, requirements, and any special conditions..." />
                </div>
                <div className="toggle-row" style={{ marginBottom: 10 }}>
                  <div className="toggle-info"><div className="tl">Show lowest bid to suppliers</div><div className="ts">Suppliers can see the current lowest bid during the live auction.</div></div>
                  <Toggle checked={showLowestBid} onChange={setShowLowestBid} />
                </div>
                <div className="toggle-row">
                  <div className="toggle-info"><div className="tl">Require approval before publishing</div><div className="ts">Auction will be routed to approver before going live to suppliers.</div></div>
                  <Toggle checked={requireApproval} onChange={setRequireApproval} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-hdr"><span className="card-hdr-title">Schedule and timing</span></div>
              <div className="card-body">
                <div className="form-grid form-grid-2">
                  <FormField label="Auction start date and time" required><input type="datetime-local" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} /></FormField>
                  <FormField label="Auction end date and time" required><input type="datetime-local" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} /></FormField>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>Next: questionnaire →</button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr">
                <span className="card-hdr-title">Questionnaire setup</span>
                <div className="action-bar">
                  <button className="btn btn-sm btn-outline">Use existing template</button>
                  <button className="btn btn-sm btn-primary" onClick={() => setShowNewQ(true)}>+ Add question</button>
                </div>
              </div>
              <div className="card-body">
                {questions.map((q, idx) => (
                  <div className="q-item" key={q.id}>
                    <div className="q-item-hdr">
                      <div>
                        <div className="q-text">{idx + 1}. {q.text}</div>
                        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>{q.required ? 'Required' : 'Optional'} · {q.type}</div>
                      </div>
                      <span className="q-type">{q.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {showNewQ && (
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="card-hdr"><span className="card-hdr-title">Add new question</span></div>
                <div className="card-body">
                  <div className="form-grid form-grid-2" style={{ marginBottom: 10 }}>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Question text <span>*</span></label>
                      <textarea value={newQText} onChange={e => setNewQText(e.target.value)} placeholder="Enter your question..." />
                    </div>
                    <FormField label="Response type">
                      <select value={newQType} onChange={e => setNewQType(e.target.value as PQQType)}>
                        <option>Yes / No</option><option>Text Area</option><option>Numeric</option><option>File Upload</option>
                      </select>
                    </FormField>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={saveQuestion}>Save question</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowNewQ(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next: items and pricing →</button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr">
                <span className="card-hdr-title">Auction line items</span>
                <div className="action-bar">
                  <button className="btn btn-sm btn-outline">Import from database</button>
                  <button className="btn btn-sm btn-primary" onClick={addItem}>+ Add item</button>
                </div>
              </div>
              <div className="card-body">
                <div className="tbl-wrap">
                  <table className="items-tbl">
                    <thead>
                      <tr><th>#</th><th>Item description</th><th>UOM</th><th>Qty</th><th>Delivery date</th><th>Start price</th><th>Budget price</th><th>Historical price</th><th /></tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td><input type="text" value={item.description} style={{ minWidth: 220 }} onChange={e => updateItem(item.id, { description: e.target.value })} /></td>
                          <td><select value={item.uom} style={{ width: 80 }} onChange={e => updateItem(item.id, { uom: e.target.value })}><option>Each</option><option>Set</option><option>Lot</option></select></td>
                          <td><input type="number" value={item.qty} style={{ width: 64 }} onChange={e => updateItem(item.id, { qty: parseInt(e.target.value) || 0 })} /></td>
                          <td><input type="date" value={item.deliveryDate} style={{ width: 140 }} onChange={e => updateItem(item.id, { deliveryDate: e.target.value })} /></td>
                          <td><input type="number" value={item.startPrice || ''} style={{ width: 100 }} onChange={e => updateItem(item.id, { startPrice: parseFloat(e.target.value) || 0 })} /></td>
                          <td><input type="number" value={item.budgetPrice || ''} style={{ width: 100 }} onChange={e => updateItem(item.id, { budgetPrice: parseFloat(e.target.value) || 0 })} /></td>
                          <td><input type="number" value={item.historicalPrice || ''} style={{ width: 100 }} onChange={e => updateItem(item.id, { historicalPrice: parseFloat(e.target.value) || 0 })} /></td>
                          <td><button className="del-btn" onClick={() => delItem(item.id)}><Trash2 className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 14, padding: 12, background: 'var(--vw-color-gray-50)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Price legend</div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 12 }}>
                    <span><b>Start price</b> — ceiling visible to suppliers</span>
                    <span><b>Budget price</b> — internal target, used for savings only</span>
                    <span><b>Historical price</b> — last purchased price, benchmark</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)' }}>Total start price: <b className="td-mono" style={{ color: 'var(--ink)' }}>{fmtSAR(totalStart)}</b></div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>Next: documents →</button>
            </div>
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr"><span className="card-hdr-title">Supporting documents</span></div>
              <div className="card-body">
                <div className="doc-zone">
                  <Upload className="w-6 h-6" />
                  <p><b>Click to upload</b> or drag and drop files here</p>
                  <p style={{ fontSize: 11, marginTop: 4 }}>PDF, DOCX, XLSX — max 25MB per file</p>
                </div>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[{ name: 'Technical_Specifications_IT_Hardware_Q2.pdf', size: '2.4 MB' }, { name: 'Delivery_Requirements_KSA.docx', size: '0.8 MB' }].map(f => (
                    <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff' }}>
                      <FileText className="w-4 h-4" color="var(--text-light)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.size} · Uploaded 27 Mar 2025</div>
                      </div>
                      <button className="btn btn-sm btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--vw-color-red-200)' }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(5)}>Next: invite suppliers →</button>
            </div>
          </>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr"><span className="card-hdr-title">Supplier invitation</span></div>
              <div className="card-body">
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Invite by vendor master</div>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th /><th>Vendor ID</th><th>Vendor name</th><th>Category</th><th>Rating</th><th>Country</th></tr></thead>
                    <tbody>
                      {vendors.map(v => (
                        <tr key={v.id}>
                          <td><input type="checkbox" checked={v.checked} onChange={() => toggleVendor(v.id)} /></td>
                          <td className="td-mono">{v.id}</td>
                          <td className="td-bold">{v.name}</td>
                          <td>{v.category}</td>
                          <td>{v.rating}</td>
                          <td>{v.country}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divider" />
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Invite by email (external suppliers)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="email" placeholder="Enter email address" value={extEmail} onChange={e => setExtEmail(e.target.value)} />
                  <button className="btn btn-outline btn-sm" onClick={addEmailInvite}>Add</button>
                </div>
                <div style={{ marginTop: 8 }}>
                  {emailInvites.map(email => (
                    <span className="invite-chip" key={email}>{email} <span className="rm" onClick={() => removeEmailInvite(email)}><X className="w-3 h-3" /></span></span>
                  ))}
                </div>
                <div style={{ marginTop: 14, background: 'var(--vw-color-amber-50)', border: '1px solid var(--vw-color-amber-200)', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: 'var(--vw-color-amber-800)' }}>
                  <b>Notification:</b> All invited suppliers receive an email with auction details and a secure login link.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <button className="btn btn-outline" onClick={() => setStep(4)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(6)}>Next: review and publish →</button>
            </div>
          </>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <>
            {requireApproval && (
              <div className="approval-banner">
                <div className="approval-icon"><AlertTriangle className="w-4 h-4" color="var(--vw-color-amber-600)" /></div>
                <div className="approval-text">
                  <div className="at">Approval required before publishing</div>
                  <div className="as">Approver: Mariam Al-Dosari (Procurement Lead) — will receive email notification upon publish</div>
                </div>
              </div>
            )}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr"><span className="card-hdr-title">Auction summary</span></div>
              <div className="card-body">
                <div className="info-row" style={{ marginBottom: 14 }}>
                  <div className="info-item"><span className="ik">Auction title</span><span className="iv">{title}</span></div>
                  <div className="info-item"><span className="ik">Format</span><span className="iv">{FORMAT_META[format].label}</span></div>
                  <div className="info-item"><span className="ik">Category</span><span className="iv">{category}</span></div>
                  <div className="info-item"><span className="ik">Currency</span><span className="iv">{currency.split(' ')[0]}</span></div>
                </div>
                <div className="divider" />
                <div className="info-row" style={{ marginBottom: 14 }}>
                  <div className="info-item"><span className="ik">Start</span><span className="iv">{startDateTime.replace('T', ' · ')}</span></div>
                  <div className="info-item"><span className="ik">End</span><span className="iv">{endDateTime.replace('T', ' · ')}</span></div>
                  <div className="info-item"><span className="ik">Show lowest bid</span><span className="iv">{showLowestBid ? 'Yes (to suppliers)' : 'No'}</span></div>
                </div>
                <div className="divider" />
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Items ({items.length})</div>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Item</th><th>Qty</th><th>Start price</th><th>Budget price</th><th>Total start</th></tr></thead>
                    <tbody>
                      {items.map(i => (
                        <tr key={i.id}><td>{i.description || '—'}</td><td>{i.qty}</td><td className="td-mono">{fmtSAR(i.startPrice)}</td><td className="td-mono">{fmtSAR(i.budgetPrice)}</td><td className="td-mono td-bold">{fmtSAR(i.startPrice * i.qty)}</td></tr>
                      ))}
                      <tr style={{ background: 'var(--vw-color-gray-50)' }}><td colSpan={4} style={{ fontWeight: 700, textAlign: 'right' }}>Total start price</td><td className="td-mono td-bold">{fmtSAR(totalStart)}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="divider" />
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Invited suppliers ({invitedCount})</div>
                <div>
                  {vendors.filter(v => v.checked).map(v => <span className="tag" key={v.id} style={{ margin: 2 }}>{v.name}</span>)}
                  {emailInvites.map(e => <span className="tag" key={e} style={{ margin: 2 }}>{e}</span>)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <button className="btn btn-outline" onClick={() => setStep(5)}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={() => setPublished(true)}>
                <Send className="w-4 h-4" /> Publish auction
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   VIEW: AUCTION DETAIL (Overview / Live Room / Evaluation / Award)
   ═════════════════════════════════════════════════════════════ */
type DetailTab = 'overview' | 'live' | 'evaluation' | 'award';

function AuctionDetail({ bid, onNavigate }: { bid: AuctionSummary; onNavigate: (v: string, d?: any) => void }) {
  const auction: AuctionDetailData = bid.id === DETAIL_AUCTION.id ? DETAIL_AUCTION : { ...DETAIL_AUCTION, ...bid };
  const [activeTab, setActiveTab] = useState<DetailTab>(bid.status === 'Live' ? 'live' : 'overview');
  const [awarded, setAwarded] = useState(bid.status === 'Awarded');

  const TABS: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'live', label: 'Live room' },
    { id: 'evaluation', label: 'Evaluation gates' },
    { id: 'award', label: 'Award' },
  ];

  return (
    <div className="auction-module">
      <div className="av-page">
        <div className="sec-hdr">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <button className="icon-btn" onClick={() => onNavigate('ebid-list')}><ArrowLeft className="w-4 h-4" /></button>
            <div>
              <div className="sec-title">{auction.title}</div>
              <div className="sec-sub">{auction.auctionId} · {auction.category} · {FORMAT_META[auction.format].label}</div>
            </div>
          </div>
          <div className="action-bar">
            <StatusBadge status={awarded ? 'Awarded' : auction.status} />
            <button className="btn btn-outline btn-sm"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'overview' && <DetailOverview auction={auction} />}
        {activeTab === 'live' && <LiveRoom auction={auction} />}
        {activeTab === 'evaluation' && <BidEvaluationGates auction={auction} awarded={awarded} onAwarded={() => setAwarded(true)} />}
        {activeTab === 'award' && <AwardTab auction={auction} awarded={awarded} onAwarded={() => setAwarded(true)} />}
      </div>
    </div>
  );
}

function DetailOverview({ auction }: { auction: AuctionDetailData }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Description</h3>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{auction.description}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Line items</span></div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Item</th><th>UOM</th><th>Qty</th><th>Start price</th><th>Budget price</th><th>Historical price</th></tr></thead>
              <tbody>
                {auction.lineItems.map(li => (
                  <tr key={li.id}><td className="td-bold">{li.description}</td><td>{li.uom}</td><td>{li.qty}</td><td className="td-mono">{fmtSAR(li.startPrice)}</td><td className="td-mono">{fmtSAR(li.budgetPrice)}</td><td className="td-mono">{fmtSAR(li.historicalPrice)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Auction info</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="info-item"><span className="ik">Auction ID</span><span className="iv">{auction.auctionId}</span></div>
            <div className="info-item"><span className="ik">Category</span><span className="iv">{auction.category}</span></div>
            <div className="info-item"><span className="ik">Format</span><span className="iv">{FORMAT_META[auction.format].label}</span></div>
            <div className="info-item"><span className="ik">Start price</span><span className="iv">{fmtSAR(auction.startPrice)}</span></div>
            <div className="info-item"><span className="ik">Budget price</span><span className="iv">{fmtSAR(auction.budgetPriceTotal)}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Key dates</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="info-item"><span className="ik">Start</span><span className="iv">{auction.startDate}</span></div>
            <div className="info-item"><span className="ik">End</span><span className="iv">{auction.endDate}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Invited suppliers ({auction.suppliersList.length})</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {auction.suppliersList.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}><Building2 className="w-3.5 h-3.5" color="var(--text-light)" /> {s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live Room — dynamic reverse / sealed / english / dutch, with real countdown + price-drop timers ── */
function LiveRoom({ auction }: { auction: AuctionDetailData }) {
  const [room, setRoom] = useState<'dynamic' | 'sealed' | 'english' | 'dutch'>('dynamic');
  const [seconds, setSeconds] = useState(5027); // 1h 23m 47s, mirrors HTML default
  const [dutchDrop, setDutchDrop] = useState(18);
  const [dutchPrice, setDutchPrice] = useState(4200000);
  const [itemTab, setItemTab] = useState<'all' | string>('all');

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setDutchDrop(d => {
        if (d <= 0) {
          setDutchPrice(p => Math.max(3000000, p - 50000));
          return 30;
        }
        return d - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const ROOMS: { id: 'dynamic' | 'sealed' | 'english' | 'dutch'; label: string }[] = [
    { id: 'dynamic', label: 'Dynamic reverse' }, { id: 'sealed', label: 'Sealed bid' },
    { id: 'english', label: 'English' }, { id: 'dutch', label: 'Dutch' },
  ];

  return (
    <div>
      <div className="room-switcher">
        <span className="room-switcher-label">Preview format:</span>
        {ROOMS.map(r => (
          <div key={r.id} className={`room-tab ${room === r.id ? 'active' : ''}`} onClick={() => setRoom(r.id)}>{r.label}</div>
        ))}
      </div>

      {room === 'dynamic' && (
        <div>
          <div className="live-banner">
            <div className="live-pulse" />
            <div>
              <div className="live-title">{auction.auctionId} · {auction.title}</div>
              <div className="live-sub">Dynamic reverse auction · Continuous open window · {auction.suppliersList.length} suppliers · Rank only visible</div>
            </div>
            <div className="countdown">
              <div className="countdown-val">{fmtCountdown(seconds)}</div>
              <div className="countdown-label">REMAINING TIME</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
            <div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="card-hdr"><span className="card-hdr-title">Live bid board</span></div>
                <div className="card-body">
                  <div className="tabs">
                    <button className={`tab ${itemTab === 'all' ? 'active' : ''}`} onClick={() => setItemTab('all')}>All items</button>
                    {auction.lineItems.map(li => (
                      <button key={li.id} className={`tab ${itemTab === li.id ? 'active' : ''}`} onClick={() => setItemTab(li.id)}>{li.description.split(' ').slice(0, 2).join(' ')}</button>
                    ))}
                  </div>
                  <table className="bid-rank-table">
                    <thead><tr><th>Rank</th><th>Supplier</th><th>Total bid</th><th>Savings</th><th>Last bid at</th></tr></thead>
                    <tbody>
                      {auction.ranking.map(r => (
                        <tr key={r.name} className={r.rank === 1 ? 'rank1' : ''}>
                          <td><div className="rank-badge">{r.rank}</div></td>
                          <td className="td-bold">{r.name}</td>
                          <td className="td-mono td-bold">{fmtSAR(r.totalBid)}</td>
                          <td style={{ color: r.savingsPct > 5 ? 'var(--green)' : r.savingsPct > 1 ? 'var(--amber)' : 'var(--text-muted)', fontWeight: 600 }}>↓ {r.savingsPct}%</td>
                          <td className="td-mono" style={{ fontSize: 11 }}>{r.lastBidAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <div className="card-hdr"><span className="card-hdr-title">Bid activity log</span></div>
                <div className="card-body" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table>
                    <thead><tr><th>Time</th><th>Supplier</th><th>Item</th><th>New bid</th><th>Change</th></tr></thead>
                    <tbody>
                      {auction.bidHistory.map((h, i) => (
                        <tr key={i}><td className="td-mono">{h.time}</td><td>{h.supplier}</td><td>{h.item}</td><td className="td-mono">{fmtSAR(h.value)}</td><td style={{ color: 'var(--green)' }}>↓ SAR {Math.abs(h.change)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="savings-box">
                <div className="savings-title">Real-time savings vs start price</div>
                <div className="savings-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="savings-card"><div className="val">{fmtSAR(auction.startPrice - auction.ranking[0].totalBid)}</div><div className="lbl">Current saving</div></div>
                  <div className="savings-card"><div className="val">{auction.ranking[0].savingsPct}%</div><div className="lbl">Saving %</div></div>
                </div>
              </div>
              <div className="card">
                <div className="card-hdr"><span className="card-hdr-title">Auction controls</span></div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="btn btn-outline" style={{ justifyContent: 'center' }}><PauseCircle className="w-4 h-4" /> Pause auction</button>
                  <button className="btn btn-danger" style={{ justifyContent: 'center' }}>End auction now</button>
                  <button className="btn btn-outline" style={{ justifyContent: 'center' }}><MessageSquare className="w-4 h-4" /> Message suppliers</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {room === 'sealed' && (
        <div>
          <div className="live-banner" style={{ background: 'var(--vw-color-slate-900)' }}>
            <div className="live-pulse" style={{ background: 'var(--vw-color-slate-400)', animation: 'none' }} />
            <div>
              <div className="live-title">{auction.auctionId} · {auction.title}</div>
              <div className="live-sub" style={{ color: 'var(--vw-color-slate-300)' }}>Sealed bid · {auction.suppliersList.length} invited suppliers · Bids hidden until opening</div>
            </div>
            <div className="countdown"><div className="countdown-val">{fmtCountdown(seconds)}</div><div className="countdown-label">UNTIL BID OPENING</div></div>
          </div>
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Submission status</span></div>
            <div className="card-body">
              <table>
                <thead><tr><th>Supplier</th><th>Status</th><th>Bid amount</th></tr></thead>
                <tbody>
                  {auction.suppliersList.map((s, i) => (
                    <tr key={s}><td className="td-bold">{s}</td><td><span className="badge badge-approved">Submitted</span></td><td className="td-mono" style={{ color: 'var(--text-light)' }}>Sealed</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {room === 'english' && (
        <div>
          <div className="live-banner" style={{ background: '#1c4532' }}>
            <div className="live-pulse" style={{ background: '#6ee7b7' }} />
            <div>
              <div className="live-title">ENG-2025-0003 · Excess IT Assets — Data Centre Hardware Lot</div>
              <div className="live-sub" style={{ color: '#6ee7b7' }}>English auction · Price rises · Highest bid wins · Min increment SAR 50,000</div>
            </div>
            <div className="countdown"><div className="countdown-val">{fmtCountdown(seconds)}</div><div className="countdown-label">REMAINING TIME</div></div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '20px 0 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8 }}>CURRENT HIGHEST BID</div>
              <div style={{ fontSize: 40, fontWeight: 300, color: 'var(--vw-color-green-700)' }}>{fmtSAR(1350000)}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Leading: Bidder #7 · Next min bid: {fmtSAR(1400000)}</div>
            </div>
          </div>
        </div>
      )}

      {room === 'dutch' && (
        <div>
          <div className="live-banner" style={{ background: '#7c3aed' }}>
            <div className="live-pulse" style={{ background: '#ddd6fe', animation: 'none' }} />
            <div>
              <div className="live-title">DUTCH-2025-0001 · Treasury Bills — SAR 500M Issuance</div>
              <div className="live-sub" style={{ color: '#ddd6fe' }}>Dutch auction · Price drops every 30s · First to accept wins</div>
            </div>
            <div className="countdown"><div className="countdown-val">{fmtCountdown(dutchDrop)}</div><div className="countdown-label" style={{ color: '#ddd6fe' }}>UNTIL NEXT DROP</div></div>
          </div>
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Price clock</span></div>
            <div className="card-body" style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 10 }}>CURRENT PRICE</div>
              <div style={{ fontSize: 48, fontWeight: 300, color: '#7c3aed' }}>{fmtSAR(dutchPrice)}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>↓ Dropping from {fmtSAR(5000000)} · Floor {fmtSAR(3000000)}</div>
              <div style={{ marginTop: 20, background: 'var(--vw-color-purple-50)', border: '1px solid var(--vw-color-purple-200)', borderRadius: 'var(--r-md)', padding: 14 }}>
                <div style={{ fontSize: 12, color: '#6d28d9', marginBottom: 6 }}>Any institution can accept the current price at any moment</div>
                <button className="btn btn-lg" style={{ background: '#7c3aed', color: '#fff', width: '100%', justifyContent: 'center' }}>Accept {fmtSAR(dutchPrice)} →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   COMPONENT: BID EVALUATION GATES
   (Ranking → Item comparison → Questionnaire → Award, gated & sequential)
   ═════════════════════════════════════════════════════════════ */
type GateStage = 'ranking' | 'items' | 'questionnaire' | 'award';
type GateStatus = 'locked' | 'not_started' | 'completed';

function BidEvaluationGates({ auction, awarded, onAwarded }: { auction: AuctionDetailData; awarded: boolean; onAwarded: () => void }) {
  const GATES: { id: GateStage; label: string }[] = [
    { id: 'ranking', label: 'Bid ranking' },
    { id: 'items', label: 'Item comparison' },
    { id: 'questionnaire', label: 'Questionnaire' },
    { id: 'award', label: 'Award' },
  ];
  const [completed, setCompleted] = useState<Record<GateStage, boolean>>({ ranking: false, items: false, questionnaire: false, award: awarded });
  const [activeIdx, setActiveIdx] = useState(0);

  const statusOf = (idx: number): GateStatus => {
    if (completed[GATES[idx].id]) return 'completed';
    if (idx === 0 || completed[GATES[idx - 1].id]) return 'not_started';
    return 'locked';
  };

  const approve = (idx: number) => {
    setCompleted(p => ({ ...p, [GATES[idx].id]: true }));
    if (idx + 1 < GATES.length) setActiveIdx(idx + 1);
  };

  const active = GATES[activeIdx];
  const totalStart = auction.startPrice;
  const totalWin = auction.ranking[0].totalBid;
  const savings = totalStart - totalWin;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GATES.map((g, idx) => {
          const st = statusOf(idx);
          return (
            <div key={g.id} className={`fmt-card ${activeIdx === idx ? 'selected' : ''}`} style={{ opacity: st === 'locked' ? 0.45 : 1, cursor: st === 'locked' ? 'not-allowed' : 'pointer' }} onClick={() => st !== 'locked' && setActiveIdx(idx)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="fmt-card-title" style={{ marginBottom: 0 }}>{g.label}</span>
                {st === 'completed' && <CheckCircle2 className="w-4 h-4" color="var(--vw-color-green-600)" />}
                {st === 'locked' && <Lock className="w-3.5 h-3.5" color="var(--text-light)" />}
              </div>
              <div className="fmt-card-desc" style={{ marginTop: 4, textTransform: 'capitalize' }}>{st.replace('_', ' ')}</div>
            </div>
          );
        })}
        <div className="savings-box" style={{ marginTop: 4 }}>
          <div className="savings-title" style={{ fontSize: 12 }}>Savings snapshot</div>
          <div style={{ fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Start</span><b>{fmtSAR(totalStart)}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Leading bid</span><b>{fmtSAR(totalWin)}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--vw-color-green-600)', fontWeight: 600 }}><span>Savings</span><span>{fmtSAR(savings)}</span></div>
          </div>
        </div>
      </div>

      <div>
        {active.id === 'ranking' && (
          <div>
            <div className="savings-box" style={{ marginBottom: 16 }}>
              <div className="savings-title">Final savings summary</div>
              <div className="savings-grid">
                <div className="savings-card"><div className="val">{fmtSAR(totalStart)}</div><div className="lbl">Start price</div></div>
                <div className="savings-card"><div className="val">{fmtSAR(totalWin)}</div><div className="lbl">Leading bid</div></div>
                <div className="savings-card"><div className="val">{auction.ranking[0].savingsPct}%</div><div className="lbl">Savings %</div></div>
              </div>
            </div>
            {auction.ranking.map(r => (
              <div key={r.name} className={`supplier-rank-row ${r.rank === 1 ? 'rank1' : r.rank === 2 ? 'rank2' : r.rank === 3 ? 'rank3' : ''}`}>
                <div className={`rank-num r${Math.min(r.rank, 4)}`}>{r.rank}</div>
                <div style={{ flex: 1 }}>
                  <div className="supplier-name">{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.bidsCount} bids · Last bid {r.lastBidAt}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="supplier-bid">{fmtSAR(r.totalBid)}</div>
                  <div className="supplier-savings">↓ {r.savingsPct}% vs start</div>
                </div>
              </div>
            ))}
            <GateApproveBar disabled={completed.ranking} onApprove={() => approve(0)} />
          </div>
        )}

        {active.id === 'items' && (
          <div className="card">
            <div className="card-body">
              <div className="tbl-wrap">
                <table className="cmp-tbl">
                  <thead>
                    <tr><th>Item</th><th>Qty</th><th>Start price</th>{auction.ranking.map((r, i) => <th key={r.name} className={i === 0 ? 'winner' : ''}>{r.name.split(' ')[0]}</th>)}</tr>
                  </thead>
                  <tbody>
                    {auction.itemComparison.map(row => (
                      <tr key={row.item}>
                        <td className="td-bold">{row.item}</td><td>{row.qty}</td><td className="td-mono">{fmtSAR(row.startPrice)}</td>
                        {auction.ranking.map((r, i) => {
                          const shortName = Object.keys(row.bids).find(k => r.name.startsWith(k.split(' ')[0])) || Object.keys(row.bids)[i];
                          const val = row.bids[shortName];
                          return <td key={r.name} className={`td-mono ${i === 0 ? 'winner lowest' : ''}`}>{val ? fmtSAR(val) : '—'}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <GateApproveBar disabled={completed.items} onApprove={() => approve(1)} />
            </div>
          </div>
        )}

        {active.id === 'questionnaire' && (
          <div className="card">
            <div className="card-body">
              <div className="tbl-wrap">
                <table className="cmp-tbl">
                  <thead><tr><th>Question</th>{Object.keys(auction.questionnaireComparison[0]?.answers || {}).map((k, i) => <th key={k} className={i === 0 ? 'winner' : ''}>{k}</th>)}</tr></thead>
                  <tbody>
                    {auction.questionnaireComparison.map(row => (
                      <tr key={row.question}>
                        <td style={{ fontWeight: 500 }}>{row.question}</td>
                        {Object.entries(row.answers).map(([k, v], i) => <td key={k} className={i === 0 ? 'winner' : ''} style={{ fontSize: 11.5 }}>{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <GateApproveBar disabled={completed.questionnaire} onApprove={() => approve(2)} />
            </div>
          </div>
        )}

        {active.id === 'award' && <AwardTab auction={auction} awarded={awarded} onAwarded={onAwarded} />}
      </div>
    </div>
  );
}

function GateApproveBar({ disabled, onApprove }: { disabled: boolean; onApprove: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
      {disabled ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--vw-color-green-600)', fontWeight: 500 }}><CheckCircle2 className="w-4 h-4" /> Gate approved</span>
      ) : (
        <button className="btn btn-primary" onClick={onApprove}><ShieldCheck className="w-4 h-4" /> Approve gate</button>
      )}
    </div>
  );
}

/* ── Award tab / modal ── */
function AwardTab({ auction, awarded, onAwarded }: { auction: AuctionDetailData; awarded: boolean; onAwarded: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('Lowest total bid, best warranty terms, fastest lead time, SASO compliant, nationwide KSA support.');
  const winner = auction.ranking[0];
  const savings = auction.startPrice - winner.totalBid;

  if (awarded) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ width: 56, height: 56, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Award className="w-7 h-7" color="#fff" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Auction awarded</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{winner.name} awarded {fmtSAR(winner.totalBid)}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-hdr"><span className="card-hdr-title">Award auction</span></div>
        <div className="card-body">
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 14 }}>Leading supplier is pre-selected based on the completed evaluation gates.</p>
          <div className="supplier-rank-row rank1" style={{ cursor: 'default' }}>
            <div className="rank-num r1">1</div>
            <div style={{ flex: 1 }}><div className="supplier-name">{winner.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{winner.bidsCount} bids · Last bid {winner.lastBidAt}</div></div>
            <div style={{ textAlign: 'right' }}><div className="supplier-bid">{fmtSAR(winner.totalBid)}</div><div className="supplier-savings">↓ {winner.savingsPct}% vs start</div></div>
            <button className="btn btn-green btn-sm" onClick={() => setShowModal(true)}>Award</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="av-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="av-modal-card award-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Award auction</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>You are about to award {auction.auctionId} to the selected supplier.</div>
            <div style={{ background: 'var(--vw-color-green-50)', border: '1px solid var(--vw-color-green-100)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--vw-color-green-700)', marginBottom: 8 }}>Award summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Supplier:</span><b>{winner.name}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total award value:</span><b className="td-mono">{fmtSAR(winner.totalBid)}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Savings:</span><b style={{ color: 'var(--vw-color-green-600)' }}>{fmtSAR(savings)} ({winner.savingsPct}%)</b></div>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Award notes or justification</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-green" onClick={() => { setShowModal(false); onAwarded(); }}>Confirm award and create PO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   VIEW: VENDOR BID PORTAL (supplier journey: invite → PQQ → eligibility)
   ═════════════════════════════════════════════════════════════ */
type SupplierStage = 'invite' | 'declined' | 'pqq' | 'evaluating' | 'ineligible' | 'bidding';

function VendorBidPortal({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) {
  const [stage, setStage] = useState<SupplierStage>('invite');
  const [vatUploaded, setVatUploaded] = useState(true);
  const [leadTime, setLeadTime] = useState(7);
  const [saso, setSaso] = useState<'yes' | 'no'>('yes');
  const [support, setSupport] = useState<'yes' | 'no'>('yes');
  const [warranty, setWarranty] = useState('3-year on-site warranty on laptops and docking stations, 2-year on monitors.');
  const [reasons, setReasons] = useState<string[]>([]);

  const stepIdx: Record<SupplierStage, number> = { invite: 1, declined: 1, pqq: 2, evaluating: 3, ineligible: 3, bidding: 4 };
  const STAGE_LABELS = ['Invitation', 'Pre-Qualification', 'Eligibility', 'Bidding'];

  const statusBadge: Record<SupplierStage, { text: string; cls: string }> = {
    invite: { text: 'Invitation pending response', cls: '' },
    declined: { text: 'Declined', cls: '' },
    pqq: { text: 'Pre-qualification pending', cls: 'badge-pending' },
    evaluating: { text: 'Evaluating…', cls: 'badge-pending' },
    ineligible: { text: 'Not eligible', cls: 'badge-rejected' },
    bidding: { text: 'Eligible — bidding open', cls: 'badge-approved' },
  };

  const acknowledge = (accept: boolean) => setStage(accept ? 'pqq' : 'declined');

  const evaluateEligibility = () => {
    const found: string[] = [];
    if (!vatUploaded) found.push('VAT registration certificate was not uploaded (required).');
    if (!leadTime || leadTime > 15) found.push(`Lead time of ${leadTime || '—'} working days exceeds the buyer's 15-day requirement.`);
    if (saso !== 'yes') found.push('SASO standards & CE marking compliance was not confirmed (required).');
    if (support !== 'yes') found.push('On-site KSA support was not confirmed (required).');
    setReasons(found);
    setStage(found.length === 0 ? 'bidding' : 'ineligible');
  };

  const submitPQQ = () => {
    setStage('evaluating');
    setTimeout(evaluateEligibility, 800);
  };

  return (
    <div className="auction-module">
      <div className="av-page">
        <div className="supplier-view-banner">
          <div>
            <div style={{ fontSize: 11, color: 'var(--vw-color-slate-400)', marginBottom: 4 }}>SUPPLIER PORTAL — SIMULATED VIEW</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Lenovo Middle East FZE · Supplier dashboard</div>
            <div style={{ fontSize: 12, color: 'var(--vw-color-slate-400)', marginTop: 4 }}>Contact: ahmed.hassan@lenovo-me.com · Vendor ID: VND-1042</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`badge ${statusBadge[stage].cls}`} style={!statusBadge[stage].cls ? { background: 'var(--vw-color-slate-700)', color: '#fff' } : undefined}>{statusBadge[stage].text}</span>
            <span className="sv-badge">Simulated supplier view</span>
          </div>
        </div>

        <div className="stepper">
          {STAGE_LABELS.map((label, i) => {
            const n = i + 1;
            const cls = n < stepIdx[stage] ? 'step done' : n === stepIdx[stage] ? 'step active' : 'step';
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', flex: n < STAGE_LABELS.length ? 1 : undefined }}>
                <div className={cls}><div className="step-num">{n}</div>{label}</div>
                {n < STAGE_LABELS.length && <div className={`step-line ${n < stepIdx[stage] ? 'done' : ''}`} />}
              </div>
            );
          })}
        </div>

        {stage === 'invite' && (
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Auction invitation</span><span className="badge badge-live">Live now</span></div>
            <div className="card-body">
              <div className="info-row" style={{ marginBottom: 10 }}>
                <div className="info-item"><span className="ik">Auction</span><span className="iv">AUC-2025-0041</span></div>
                <div className="info-item"><span className="ik">Title</span><span className="iv">IT Hardware — Laptops & Monitors Q2</span></div>
                <div className="info-item"><span className="ik">Buyer</span><span className="iv">NetSingularity Procurement</span></div>
                <div className="info-item"><span className="ik">Format</span><span className="iv">Dynamic reverse auction</span></div>
              </div>
              <div className="info-row" style={{ marginBottom: 14 }}>
                <div className="info-item"><span className="ik">Bidding window</span><span className="iv">27 Mar 2025 · 14:00 – 16:00</span></div>
                <div className="info-item"><span className="ik">Items</span><span className="iv">3 line items · 150 units total</span></div>
                <div className="info-item"><span className="ik">Start price</span><span className="iv">{fmtSAR(1250000)}</span></div>
              </div>
              <div style={{ background: 'var(--vw-color-amber-50)', border: '1px solid var(--vw-color-amber-200)', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: 'var(--vw-color-amber-800)', marginBottom: 14 }}>
                Accepting requires completing a 5-question pre-qualification questionnaire before you're eligible to bid. Declining removes you from this auction.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={() => acknowledge(true)}>Accept invitation →</button>
                <button className="btn btn-outline" onClick={() => acknowledge(false)}>Decline</button>
              </div>
            </div>
          </div>
        )}

        {stage === 'declined' && (
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Invitation declined</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>You won't be invited to bid on AUC-2025-0041. The buyer has been notified.</div>
              <button className="btn btn-outline btn-sm" onClick={() => setStage('invite')}><RefreshCw className="w-3.5 h-3.5" /> Reconsider — restart</button>
            </div>
          </div>
        )}

        {stage === 'pqq' && (
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Pre-qualification questionnaire</span><span className="badge badge-pending">Not submitted</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="q-item">
                <div className="q-text">1. Do you have a valid VAT registration certificate? Please upload a copy. <span style={{ color: 'var(--red)' }}>*</span></div>
                <div style={{ marginTop: 8 }}>
                  {vatUploaded ? (
                    <><span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Uploaded: VAT_Certificate_Lenovo_ME.pdf</span> <button className="btn btn-sm btn-outline" style={{ marginLeft: 10 }} onClick={() => setVatUploaded(false)}>Remove</button></>
                  ) : (
                    <><span style={{ color: 'var(--vw-color-amber-700)', fontWeight: 600 }}>Not uploaded</span> <button className="btn btn-sm btn-outline" style={{ marginLeft: 10 }} onClick={() => setVatUploaded(true)}>Simulate upload</button></>
                  )}
                </div>
              </div>
              <div className="q-item">
                <div className="q-text">2. What is your lead time for delivery after PO issuance? (in working days) <span style={{ color: 'var(--red)' }}>*</span></div>
                <div style={{ marginTop: 6 }}><input type="number" value={leadTime} style={{ width: 80, display: 'inline-block' }} onChange={e => setLeadTime(parseInt(e.target.value) || 0)} /> <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>working days — buyer requires 15 or fewer</span></div>
              </div>
              <div className="q-item">
                <div className="q-text">3. Confirm that all equipment meets Saudi SASO standards and CE marking requirements. <span style={{ color: 'var(--red)' }}>*</span></div>
                <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}><input type="radio" name="saso" checked={saso === 'yes'} onChange={() => setSaso('yes')} /> Yes</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}><input type="radio" name="saso" checked={saso === 'no'} onChange={() => setSaso('no')} /> No</label>
                </div>
              </div>
              <div className="q-item">
                <div className="q-text">4. Provide warranty terms for each item category.</div>
                <div style={{ marginTop: 6 }}><textarea value={warranty} onChange={e => setWarranty(e.target.value)} /></div>
              </div>
              <div className="q-item">
                <div className="q-text">5. Do you offer on-site support and maintenance services in KSA? <span style={{ color: 'var(--red)' }}>*</span></div>
                <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}><input type="radio" name="support" checked={support === 'yes'} onChange={() => setSupport('yes')} /> Yes</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}><input type="radio" name="support" checked={support === 'no'} onChange={() => setSupport('no')} /> No</label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={submitPQQ}>Submit questionnaire →</button>
              </div>
            </div>
          </div>
        )}

        {stage === 'evaluating' && (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: 32 }}><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Evaluating your responses against the buyer's eligibility rules…</div></div></div>
        )}

        {stage === 'ineligible' && (
          <div className="card">
            <div className="card-hdr"><span className="card-hdr-title">Pre-qualification result</span><span className="badge badge-rejected">Not eligible</span></div>
            <div className="card-body">
              <div style={{ background: 'var(--vw-color-red-50)', border: '1px solid var(--vw-color-red-200)', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: 'var(--vw-color-red-800)', marginBottom: 14 }}>
                <b>You do not meet this auction's pre-qualification criteria:</b>
                <ul style={{ margin: '8px 0 0 18px' }}>{reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setStage('pqq')}><RefreshCw className="w-3.5 h-3.5" /> Revise answers and resubmit</button>
            </div>
          </div>
        )}

        {stage === 'bidding' && (
          <div>
            <div style={{ background: 'var(--vw-color-green-50)', border: '1px solid var(--vw-color-green-200)', borderRadius: 6, padding: '10px 14px', fontSize: 12.5, color: 'var(--vw-color-green-800)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>✓ Pre-qualified</span> — you're eligible to bid on AUC-2025-0041.
              <button className="btn-ghost" style={{ marginLeft: 'auto', textDecoration: 'underline' }} onClick={() => setStage('pqq')}>Review answers</button>
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-hdr"><span className="card-hdr-title">Auction status</span></div>
              <div className="card-body">
                <div className="info-row">
                  <div className="info-item"><span className="ik">Lowest bid (total)</span><span className="iv" style={{ color: 'var(--teal)' }}>{fmtSAR(323000)}</span></div>
                  <div className="info-item"><span className="ik">Your current rank</span><span className="iv" style={{ color: 'var(--vw-color-green-600)' }}>#1</span></div>
                  <div className="info-item"><span className="ik">Your total bid</span><span className="iv">{fmtSAR(323000)}</span></div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Ready to submit or update your bid?</p>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('vendor-submit')}><Gauge className="w-4 h-4" /> Go to bid submission →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   VIEW: VENDOR BID SUBMISSION
   ═════════════════════════════════════════════════════════════ */
function VendorBidSubmissionView({ onNavigate }: { onNavigate: (v: string, d?: any) => void }) {
  const [prices, setPrices] = useState<Record<string, string>>(() => Object.fromEntries(PORTAL_LINE_ITEMS.map(i => [i.id, String(i.yourLastBid - 70)])));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(5027);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const setPrice = (id: string, v: string) => setPrices(p => ({ ...p, [id]: v }));
  const totalBid = PORTAL_LINE_ITEMS.reduce((s, i) => s + (parseFloat(prices[i.id]) || 0) * i.qty, 0);
  const lastTotal = PORTAL_LINE_ITEMS.reduce((s, i) => s + i.yourLastBid * i.qty, 0);
  const startTotal = PORTAL_LINE_ITEMS.reduce((s, i) => s + i.startPrice * i.qty, 0);
  const savingsPct = startTotal > 0 ? ((startTotal - totalBid) / startTotal) * 100 : 0;
  const allPriced = PORTAL_LINE_ITEMS.every(i => (parseFloat(prices[i.id]) || 0) > 0);

  const submitBid = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <div className="auction-module">
        <div className="av-page-narrow" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
          <div className="card" style={{ width: '100%' }}>
            <div className="card-body" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ width: 56, height: 56, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 className="w-7 h-7" color="#fff" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Bid submitted</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total bid <b>{fmtSAR(totalBid)}</b> · Savings {savingsPct.toFixed(1)}% vs start price.</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => onNavigate('ebid-list')}>Back to list</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auction-module">
      <div style={{ background: 'var(--vw-color-slate-900)', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'var(--vw-color-slate-700)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gavel className="w-4 h-4" /></div>
          <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>Submit bid — AUC-2025-0041</div><div style={{ fontSize: 11.5, color: 'var(--vw-color-slate-400)' }}>Lenovo Middle East FZE</div></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, color: 'var(--vw-color-slate-400)' }}>Remaining time</div><div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'monospace' }}>{fmtCountdown(seconds)}</div></div>
          <button className="btn btn-outline btn-sm" style={{ background: 'transparent', color: '#e5e7eb', borderColor: 'var(--vw-color-slate-700)' }} onClick={() => onNavigate('vendor-portal')}><ArrowLeft className="w-3.5 h-3.5" /> Exit</button>
        </div>
      </div>

      <div className="av-page">
        <div className="ext-alert">
          <b>Rules:</b> Your bid cannot exceed the start price. Min decrement per item: SAR 500. Bids are binding once submitted.
        </div>
        <div className="card">
          <div className="card-hdr"><span className="card-hdr-title">Submit or update your bid</span></div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Item</th><th>Qty</th><th>Start price</th><th>Current lowest</th><th>Your last bid</th><th>New bid (per unit)</th></tr></thead>
              <tbody>
                {PORTAL_LINE_ITEMS.map(item => (
                  <tr key={item.id}>
                    <td className="td-bold">{item.description}</td>
                    <td>{item.qty}</td>
                    <td className="td-mono">{fmtSAR(item.startPrice)}</td>
                    <td className="td-mono" style={{ color: 'var(--teal)' }}>{fmtSAR(item.currentLowest)}</td>
                    <td className="td-mono">{fmtSAR(item.yourLastBid)}</td>
                    <td><input type="number" value={prices[item.id]} style={{ width: 110 }} onChange={e => setPrice(item.id, e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ margin: 16, padding: 12, background: 'var(--vw-color-green-50)', border: '1px solid var(--vw-color-green-100)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--vw-color-green-700)' }}>New total bid</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--vw-color-green-700)' }}>{fmtSAR(totalBid)}</div>
              <div style={{ fontSize: 11, color: 'var(--vw-color-green-600)' }}>{totalBid < lastTotal ? '↓' : '↑'} {fmtSAR(Math.abs(totalBid - lastTotal))} vs your last bid · ↓ {savingsPct.toFixed(1)}% vs start</div>
            </div>
            <button className="btn btn-primary btn-lg" disabled={!allPriced || submitting} onClick={submitBid}>
              {submitting ? <RefreshCw className="w-4 h-4" /> : <Send className="w-4 h-4" />} Submit bid →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════
   MAIN APP — sidebar + path-based router
   ═════════════════════════════════════════════════════════════
   No react-router-dom here (this sandbox has no npm registry access,
   see build.js's header comment), so real-path routing is hand-rolled
   on the History API: nav clicks / internal onNavigate() calls push a
   real pathname, a popstate listener reacts to Back/Forward, and the
   view shown is derived from whatever the current pathname is.

   IMPORTANT if you host this build for real: a plain static file server
   only serves files that exist on disk, so a hard refresh or a typed-in
   URL on e.g. /live-auction-room will 404 unless the server falls back
   to index.html for unrecognized paths (the standard SPA rewrite rule —
   Vercel/Netlify "rewrites", nginx try_files, etc.). dist/serve.js in
   this project already does this for local use. */
type AppView = 'dashboard' | 'create' | 'detail' | 'vendor-portal' | 'vendor-submit' | 'reports' | 'templates' | 'ebid-list' | 'live-room' | 'compare-bids';

type NavIcon = (props: { className?: string }) => any;

interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
  count?: number;
  badge?: string;
}

// The sidebar, in the exact order/labels/hrefs/icons requested. Edit this
// table to add/rename/reorder menu items.
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutGrid, count: 2 },
  { label: 'Auction', href: '/ebid-list', icon: PlusCircle },
  { label: 'Live auction', href: '/live-auction-room', icon: LiveDot, badge: 'Live' },
  { label: 'Compare bids', href: '/compare-bids', icon: CompareColumns },
  { label: 'Reports', href: '/auction-reports', icon: FileText },
  { label: 'Questionnaire templates', href: '/questionnaire-templates', icon: TemplateLayout },
  { label: 'Supplier view', href: '/vendor-submit', icon: UserSingle },
];

// Canonical path per view — used when an internal onNavigate() call (e.g. a
// "Back to list" button deep in a view component) doesn't specify an exact
// href. Sidebar clicks bypass this and push their own literal href instead,
// which is why both '/' and '/ebid-list' resolve to the same 'list' view
// without one clobbering the other's URL.
const CANONICAL_PATH_BY_VIEW: Record<AppView, string> = {
  'dashboard': '/',
  'create': '/create',
  'detail': '/live-auction-room',
  'vendor-portal': '/vendor-portal',
  'vendor-submit': '/vendor-submit',
  'reports': '/auction-reports',
  'templates': '/questionnaire-templates',
  'ebid-list': '/ebid-list',
  'live-room': '/live-auction-room',
  'compare-bids': '/compare-bids',
};

// Every known exact path -> view. '/live-auction-room/:auctionId' (a
// specific auction) is matched separately in viewForPath below.
//
// '/ebid-list' and bare '/live-auction-room' each render a dedicated,
// fully-built page (eBidList.tsx / LiveAuctionRoom.tsx) rather than
// reusing the dashboard list or the per-auction AuctionDetail workflow.
// '/live-auction-room/<id>' (e.g. from a "Join" click on the dashboard)
// still opens the existing per-auction AuctionDetail view.
const VIEW_BY_PATH: Record<string, AppView> = {
  '/': 'dashboard',
  '/ebid-list': 'ebid-list',
  '/create': 'create',
  '/live-auction-room': 'live-room',
  '/compare-bids': 'compare-bids',
  '/vendor-portal': 'vendor-portal',
  '/vendor-submit': 'vendor-submit',
  '/auction-reports': 'reports',
  '/questionnaire-templates': 'templates',
};

function normalizePathname(): string {
  if (typeof window === 'undefined') return '/';
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

// Resolves a pathname into a view + (for a specific auction) its id.
function viewForPath(pathname: string): { view: AppView; id?: string } {
  if (pathname.startsWith('/live-auction-room/')) {
    const id = decodeURIComponent(pathname.slice('/live-auction-room/'.length));
    return { view: 'detail', id: id || undefined };
  }
  return { view: VIEW_BY_PATH[pathname] || 'dashboard' };
}

// The detail view needs an actual auction record, not just its id — look
// it up by auctionId (falls back to the first mock auction so
// /live-auction-room with no id still shows something real).
function resolveNavDataForView(view: AppView, id?: string): any {
  if (view !== 'detail') return null;
  if (id) {
    const found = MOCK_AUCTIONS.find(a => a.auctionId === id || a.id === id);
    if (found) return found;
  }
  return MOCK_AUCTIONS[0] || null;
}

function Sidebar({ activePath, onNavigate }: { activePath: string; onNavigate: (href: string) => void }) {
  return (
    <nav className="app-sidebar">
      <div className="app-sidebar-brand">
        <Gavel className="w-4 h-4" />
        NetSingularity
      </div>
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = activePath === item.href
          || (item.href === '/live-auction-room' && activePath.startsWith('/live-auction-room'));
        return (
          <a
            key={item.href}
            href={item.href}
            className={`app-sidebar-link${isActive ? ' active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate(item.href); }}
          >
            <Icon className="w-4 h-4" />
            <span className="app-sidebar-label">{item.label}</span>
            {typeof item.count === 'number' && <span className="app-sidebar-count">{item.count}</span>}
            {item.badge && <span className="app-sidebar-badge">{item.badge}</span>}
          </a>
        );
      })}
    </nav>
  );
}

// Reports and Questionnaire templates are wired up (real routes, real
// sidebar links) but not ported from the HTML prototype yet — this stands
// in until that content is built.
function ComingSoonPlaceholder({ title, icon: Icon }: { title: string; icon: NavIcon }) {
  return (
    <div className="auction-module">
      <div className="av-page">
        <div className="sec-hdr"><div className="sec-title">{title}</div></div>
        <div className="card app-placeholder">
          <Icon className="w-4 h-4" />
          <h2>Coming soon</h2>
          <p>This page isn't built into the React app yet — see the HTML prototype's {title} section for the full experience.</p>
        </div>
      </div>
    </div>
  );
}

export default function AuctionModule() {
  const [path, setPath] = useState<string>(normalizePathname);
  const [navData, setNavData] = useState<any>(() => {
    const initial = viewForPath(normalizePathname());
    return resolveNavDataForView(initial.view, initial.id);
  });

  function pushPath(nextPath: string) {
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setPath(nextPath);
  }

  // Used by every existing onNavigate(view, data?) call inside the view
  // components below (unchanged call sites — "Join", "Back to list", "Exit",
  // etc.). Computes that view's canonical path (or, for the detail view
  // with a specific auction, /live-auction-room/<auctionId>) and pushes it.
  const navigateToView = (v: string, d?: any) => {
    // eBidList / LiveAuctionRoom / AuctionReports / QuestionnaireTemplates /
    // Dashboard / CompareBids call onNavigate with a few view names outside
    // the AppView union ('ebid-create', 'ebid-detail', 'live-auction-room',
    // 'compare-bids') — map those onto the closest existing route instead
    // of falling through to '/'.
    //
    // Note: callers pass `d` in a few different shapes (eBidList/Dashboard
    // pass auctionData.ts's AuctionRow, which has no `format`/`auctionId`
    // compatible with AuctionDetail's local MOCK_AUCTIONS). Rather than
    // trust the caller's object as navData for the 'detail' view, we only
    // use it to find the auction's id, then re-resolve the real record via
    // resolveNavDataForView so AuctionDetail always gets the right shape.
    if (v === 'ebid-create') { pushPath('/create'); if (d !== undefined) setNavData(d); return; }
    if (v === 'live-auction-room') { pushPath('/live-auction-room'); if (d !== undefined) setNavData(d); return; }
    if (v === 'ebid-detail') {
      // A specific auction (id/auctionId present) opens the per-auction
      // AuctionDetail evaluation view; otherwise fall back to the generic
      // live auction room.
      const aid = d && (d.auctionId || d.id);
      if (aid) {
        pushPath(`/live-auction-room/${encodeURIComponent(aid)}`);
        setNavData(resolveNavDataForView('detail', aid));
      } else {
        pushPath('/live-auction-room');
      }
      return;
    }

    const view = v as AppView;
    const aid = d && (d.auctionId || d.id);
    if (view === 'detail' && aid) {
      pushPath(`/live-auction-room/${encodeURIComponent(aid)}`);
      setNavData(resolveNavDataForView('detail', aid));
      return;
    }
    pushPath(CANONICAL_PATH_BY_VIEW[view] || '/');
    if (d !== undefined) setNavData(d);
  };

  // Used by the sidebar: navigates to the link's literal href, so e.g.
  // "Compare bids" shows /compare-bids rather than being normalized to '/'.
  const navigateToHref = (href: string) => {
    pushPath(href);
    const { view, id } = viewForPath(href);
    setNavData(resolveNavDataForView(view, id));
  };

  // Browser Back/Forward: the URL has already changed, just resync state.
  useEffect(() => {
    const onPopState = () => {
      const p = normalizePathname();
      setPath(p);
      const { view, id } = viewForPath(p);
      setNavData(resolveNavDataForView(view, id));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const { view } = viewForPath(path);

  let body: React.ReactNode;
  switch (view) {
    case 'dashboard':
      body = <DashboardPage onNavigate={navigateToView} />;
      break;
    case 'create':
      body = <AuctionCreate onNavigate={navigateToView} />;
      break;
    case 'detail':
      body = navData ? <AuctionDetail bid={navData} onNavigate={navigateToView} /> : <EBidListPage onNavigate={navigateToView} />;
      break;
    case 'vendor-portal':
      body = <VendorBidPortal onNavigate={navigateToView} />;
      break;
    case 'vendor-submit':
      body = <VendorBidPortal onNavigate={navigateToView} />;
      break;
    case 'ebid-list':
      body = <EBidListPage onNavigate={navigateToView} />;
      break;
    case 'live-room':
      body = <LiveAuctionRoomPage onNavigate={navigateToView} data={navData} />;
      break;
    case 'compare-bids':
      body = <CompareBidsPage onNavigate={navigateToView} data={navData} />;
      break;
    case 'reports':
      body = <AuctionReportsPage onNavigate={navigateToView} />;
      break;
    case 'templates':
      body = <QuestionnaireTemplatesPage onNavigate={navigateToView} />;
      break;
    default:
      body = <DashboardPage onNavigate={navigateToView} />;
  }

  return (
    <div className="auction-module app-shell">
      <style>{AUCTION_MODULE_CSS}</style>
      <Sidebar activePath={path} onNavigate={navigateToHref} />
      <div className="app-content">{body}</div>
    </div>
  );
}
