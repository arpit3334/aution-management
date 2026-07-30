'use client';
import { useRouter } from 'next/navigation';
import { VendorBidSubmit } from '@/components/vendor/VendorBidPortal';
import { MOCK_BIDS } from '@/data/mockData';

export default function VendorSubmitPage() {
  const router = useRouter();
  
  const handleNavigate = (view: string, data?: any) => {
    if (view === 'list') {
      router.push('/');
    } else {
      if (view === 'detail') {
         router.push('/');
      } else {
         router.push(`/${view}`);
      }
    }
  };

  const previewBid = MOCK_BIDS[0];

  return <VendorBidSubmit bid={previewBid} onNavigate={handleNavigate} />;
}
