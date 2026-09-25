'use client';
import { useRouter } from 'next/navigation';
import { AuctionCreate } from '@/components/auction/AuctionCreate';

export default function CreateAuctionPage() {
  const router = useRouter();
  
  const handleNavigate = (view: string, data?: any) => {
    if (view === 'list') {
      router.push('/');
    } else {
      router.push(`/${view}`);
    }
  };

  return <AuctionCreate onNavigate={handleNavigate} />;
}
