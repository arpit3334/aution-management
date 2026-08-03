'use client';

import { useRouter } from 'next/navigation';
import CompareBids from '@/components/auction/CompareBids';

export default function CompareBidsPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'list' || view === 'ebid-list') {
      router.push('/ebid-list');
    } else if (view === 'reports' || view === 'auction-reports') {
      router.push('/auction-reports');
    } else if (view === 'create' || view === 'ebid-create') {
      router.push('/create');
    } else if (view === 'live-auction-room') {
      router.push('/live-auction-room');
    } else if (view === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/${view}`);
    }
  };

  return <CompareBids onNavigate={handleNavigate} />;
}
