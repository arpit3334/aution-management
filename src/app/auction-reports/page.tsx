'use client';

import { useRouter } from 'next/navigation';
import AuctionReports from '@/components/auction/AuctionReports';

export default function AuctionReportsPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'list' || view === 'ebid-list') {
      router.push('/ebid-list');
    } else {
      router.push(`/${view}`);
    }
  };

  return <AuctionReports onNavigate={handleNavigate} />;
}
