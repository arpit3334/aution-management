'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  PlusCircle, 
  Radio, 
  GitCompare, 
  FileText, 
  ClipboardList, 
  Users 
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Dashboard', href: '/', icon: LayoutGrid, count: 2 },
    // Use dedicated Next.js routes
    { label: 'Auction', href: '/create', icon: PlusCircle }, 
    { label: 'Live auction', href: '/live-auction-room', icon: Radio, badge: 'Live' },
    { label: 'Compare bids', href: '/ebid-list', icon: GitCompare }, 
    { label: 'Reports', href: '/auction-reports', icon: FileText },
    { label: 'Questionnaire templates', href: '/questionnaire-templates', icon: ClipboardList },
    { label: 'Supplier view', href: '/vendor-submit', icon: Users }, 
  ];

  return (
    <div className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 h-full overflow-y-auto">
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 cursor-pointer shrink-0">
        <div className="grid grid-cols-3 gap-[3px] w-[18px] h-[18px] shrink-0">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-slate-700" />
          ))}
        </div>
        <div className="text-[15px] font-medium text-slate-600">Home</div>
      </div>

      <div className="p-2.5 flex-1">
        {NAV_ITEMS.map((item) => {
          // Strict match for root, prefix match for others to keep active state
          const isActive = pathname === item.href || (item.href !== '/' && !item.href.includes('?') && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 text-sm rounded-full transition-colors mb-0.5 whitespace-nowrap group ${
                isActive 
                  ? 'bg-slate-900 text-white font-medium' 
                  : 'text-slate-900 font-normal hover:bg-slate-100'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-700'}`} />
              {item.label}
              
              {item.count && (
                <span className="ml-auto bg-red-600 text-white text-[11px] font-semibold px-2 py-[1px] rounded-full leading-4">
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className="ml-auto bg-red-600 text-white text-[11px] font-semibold px-2 py-[1px] rounded-full leading-4">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="h-px bg-slate-100 mx-4 my-2" />
      
      <div className="p-2.5">
        <div className="flex items-center gap-3 px-3.5 py-3 mx-2.5 mt-1 mb-2.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-[13px] font-semibold text-white shrink-0">
            SJ
          </div>
          <div className="text-[15px] font-medium text-slate-900 flex-1">
            Sourabh Jain
          </div>
        </div>
      </div>
    </div>
  );
}
