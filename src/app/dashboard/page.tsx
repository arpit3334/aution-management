'use client';

import { useRouter } from 'next/navigation';
import Dashboard from '@/components/auction/Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'live-auction-room' || view === 'ebid-detail') {
      router.push('/live-auction-room');
    } else if (view === 'ebid-list' || view === 'list') {
      router.push('/ebid-list');
    } else if (view === 'compare-bids') {
      router.push('/compare-bids');
    } else if (view === 'reports' || view === 'auction-reports') {
      router.push('/auction-reports');
    } else if (view === 'create' || view === 'ebid-create') {
      router.push('/create');
    } else if (view === 'questionnaire-templates' || view === 'templates') {
      router.push('/questionnaire-templates');
    } else if (view === 'vendor-submit') {
      router.push('/vendor-submit');
    } else {
      router.push(`/${view}`);
    }
  };

  return <Dashboard onNavigate={handleNavigate} />;
}
