'use client';

import { useRouter } from 'next/navigation';
import QuestionnaireTemplates from '@/components/auction/QuestionnaireTemplates';

export default function QuestionnaireTemplatesPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'ebid-list') {
      router.push('/ebid-list');
    } else {
      router.push(`/${view}`);
    }
  };

  return <QuestionnaireTemplates onNavigate={handleNavigate} />;
}
