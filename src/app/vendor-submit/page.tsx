'use client';

import { useRouter } from 'next/navigation';
import VendorBidPortal from '@/components/auction/VendorBidPortal';

export default function VendorSubmitPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'list' || view === 'ebid-list') {
      router.push('/ebid-list');
    } else if (view === 'detail') {
      router.push('/ebid-list');
    } else {
      router.push(`/${view}`);
    }
  };

  return <VendorBidPortal onNavigate={handleNavigate} />;
}
