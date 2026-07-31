import { Plus } from 'lucide-react';

interface Props {
  onNavigate: (view: string, data?: any) => void;
}

type QType = 'File' | 'Numeric' | 'Yes/No' | 'Text';

interface Question { text: string; type: QType; }
interface Template  { title: string; status: 'Active' | 'Draft'; usedIn: number; createdBy: string; questions: Question[]; }

// Sourced verbatim from Auction_Module_v2_4_4.html's #v-templates section —
// the HTML prototype only has these two templates.
const TEMPLATES: Template[] = [
  {
    title: 'IT hardware supplier qualification',
    status: 'Active', usedIn: 8, createdBy: 'Sourabh Jain',
    questions: [
      { text: 'VAT Registration Certificate', type: 'File' },
      { text: 'Lead time in working days',    type: 'Numeric' },
      { text: 'SASO/CE compliance',           type: 'Yes/No' },
      { text: 'Warranty terms',               type: 'Text' },
      { text: 'On-site KSA support',          type: 'Yes/No' },
    ],
  },
  {
    title: 'Facility services qualification',
    status: 'Active', usedIn: 4, createdBy: 'Mariam Al-Dosari',
    questions: [
      { text: 'License and registration documents', type: 'File' },
      { text: 'GOSI compliance certificate',         type: 'File' },
      { text: 'Saudization percentage',              type: 'Numeric' },
      { text: 'Service coverage cities',              type: 'Text' },
      { text: 'Insurance coverage details',           type: 'Text' },
      { text: 'Previous similar contracts',           type: 'File' },
    ],
  },
];

export default function QuestionnaireTemplates({ onNavigate }: Props) {
  const filtered = TEMPLATES;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Questionnaire templates</h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Reusable question banks for auction questionnaires</p>
          </div>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}>
            <Plus size={14} /> New template
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {filtered.map(tmpl => (
            <div key={tmpl.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Card header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>{tmpl.title}</p>
                  <span className={tmpl.status === 'Active' ? 'vw-chip vw-chip--success' : 'vw-chip vw-chip--neutral'} style={{ flexShrink: 0 }}>{tmpl.status}</span>
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                  {tmpl.questions.length} questions · Used in {tmpl.usedIn} auctions · Created by {tmpl.createdBy}
                </p>
              </div>

              {/* Questions list — plain numbered text, matching the HTML exactly */}
              <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tmpl.questions.map((q, i) => (
                  <p key={i} style={{ fontSize: 12.5, color: '#374151', margin: 0, lineHeight: 1.6 }}>
                    {i + 1}. {q.text} ({q.type})
                  </p>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: '11px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
                <button style={{ padding: '5px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                  Edit
                </button>
                <button style={{ padding: '5px 12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}>
                  Use template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
