'use client';
import { useState } from 'react';
import { AuctionList } from '@/components/auction/AuctionList';
import { AuctionCreate } from '@/components/auction/AuctionCreate';
import { AuctionDetail } from '@/components/auction/AuctionDetail';
import { VendorBidSubmit, SubmissionDetail } from '@/components/vendor/VendorBidPortal';

type AppView = 'list' | 'create' | 'detail' | 'vendor-submit' | 'submission';

export default function AuctionManagement() {
  const [view, setView] = useState<AppView>('list');
  const [navData, setNavData] = useState<any>(null);

  const navigateTo = (v: string, d?: any) => {
    setView(v as AppView);
    if (d !== undefined) setNavData(d);
  };

  switch (view) {
    case 'list':          return <AuctionList onNavigate={navigateTo} />;
    case 'create':        return <AuctionCreate onNavigate={navigateTo} />;
    case 'detail':        return navData ? <AuctionDetail bid={navData} onNavigate={navigateTo} /> : <AuctionList onNavigate={navigateTo} />;
    case 'vendor-submit': return navData ? <VendorBidSubmit bid={navData} onNavigate={navigateTo} /> : <AuctionList onNavigate={navigateTo} />;
    case 'submission':    return navData ? <SubmissionDetail data={navData} onNavigate={navigateTo} /> : <AuctionList onNavigate={navigateTo} />;
    default:              return <AuctionList onNavigate={navigateTo} />;
  }
}
