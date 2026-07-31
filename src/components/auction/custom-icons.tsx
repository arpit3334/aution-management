/**
 * custom-icons.tsx — a handful of icons that are NOT part of the standard
 * lucide-react icon set, hand-authored as 1:1 copies of the inline SVGs
 * used by Auction_Module_v2_4_4.html itself (viewBox 0 0 20 20, strokeWidth
 * 1.5), so the sidebar nav and report cards match the HTML's icon shapes
 * exactly instead of substituting a "close enough" lucide icon.
 */
import type { CSSProperties } from 'react';

export interface IconProps {
  className?: string;
  color?: string;
  size?: number | string;
  style?: CSSProperties;
}

function Icon20({ path, className, color, size, style }: IconProps & { path: React.ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke={color || 'currentColor'} strokeWidth={1.5} className={className} style={style}>
      {path}
    </svg>
  );
}
const make20 = (path: React.ReactNode) => (props: IconProps) => <Icon20 path={path} {...props} />;

// Sidebar nav icons (#sidebar in the HTML)
export const LiveDot = make20(<><circle cx="10" cy="10" r="7.5" /><circle cx="10" cy="10" r="2.3" fill="currentColor" stroke="none" /></>);
export const CompareColumns = make20(<><rect x="2.5" y="4" width="15" height="12" rx="1.5" /><line x1="7.3" y1="4" x2="7.3" y2="16" /><line x1="12.7" y1="4" x2="12.7" y2="16" /></>);
export const TemplateLayout = make20(<><rect x="2.5" y="2.5" width="15" height="15" rx="2" /><line x1="2.5" y1="7.5" x2="17.5" y2="7.5" /><line x1="7.5" y1="7.5" x2="7.5" y2="17.5" /></>);
export const UserSingle = make20(<><circle cx="10" cy="6.8" r="3.3" /><path d="M3.3 16.8c0-3.7 3-6.7 6.7-6.7s6.7 3 6.7 6.7" /></>);

// Report-card icons (#v-reports in the HTML)
export const ReportChartBox = make20(<><rect x="3" y="3" width="14" height="14" rx="1.5" /><line x1="6.5" y1="13" x2="6.5" y2="10" /><line x1="10" y1="13" x2="10" y2="7" /><line x1="13.5" y1="13" x2="13.5" y2="9" /></>);
export const ReportDocument = make20(<><rect x="4" y="2.5" width="12" height="15" rx="1.5" /><line x1="7" y1="6.5" x2="13" y2="6.5" /><line x1="7" y1="9.5" x2="13" y2="9.5" /><line x1="7" y1="12.5" x2="10.5" y2="12.5" /></>);
export const ReportShieldCheck = make20(<><path d="M10 2.5 3 6v5c0 4 3 6 7 6.5 4-.5 7-2.5 7-6.5V6l-7-3.5Z" /><path d="M7.3 10 9 11.7l3.5-4" /></>);
export const ReportTrendLine = make20(<><path d="M3 15.5 7 10l3.5 3L17 6" /><path d="M3 16.5h14" /></>);
