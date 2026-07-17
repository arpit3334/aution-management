'use client';

import { useRouter } from 'next/navigation';
import EBidList from '@/components/auction/eBidList';

export default function EBidListPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'list') {
      router.push('/');
    } else {
      router.push(`/${view}`);
    }
  };

  return <EBidList onNavigate={handleNavigate} />;
}
