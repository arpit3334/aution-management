'use client';

import { useRouter } from 'next/navigation';
import LiveAuctionRoom from '@/components/auction/LiveAuctionRoom';

export default function LiveAuctionRoomPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'ebid-list') {
      router.push('/ebid-list');
    } else {
      router.push(`/${view}`);
    }
  };

  return <LiveAuctionRoom onNavigate={handleNavigate} />;
}
