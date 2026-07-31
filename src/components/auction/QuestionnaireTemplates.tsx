import { useState } from 'react';
import { Plus, Edit2, Copy, FileText, ToggleLeft, Hash, AlignLeft, ArrowLeft, Search, Upload, Star } from 'lucide-react';

interface Props {
  onNavigate: (view: string, data?: any) => void;
}

type QType = 'File' | 'Numeric' | 'Yes/No' | 'Text' | 'Single Select' | 'Rating';

interface Question { text: string; type: QType; required: boolean; }
interface Template  { title: string; status: 'Active' | 'Draft'; category: string; usedIn: number; createdBy: string; questions: Question[]; }

const TEMPLATES: Template[] = [
  {
    title: 'IT Hardware Supplier Qualification',
    status: 'Active', category: 'IT Equipment', usedIn: 8, createdBy: 'Sourabh Jain',
    questions: [
      { text: 'Provide a copy of your VAT registration certificate.', type: 'File', required: true },
      { text: 'What is your lead time in working days after PO issuance?', type: 'Numeric', required: true },
      { text: 'Confirm equipment meets SASO and CE standards.', type: 'Yes/No', required: true },
      { text: 'Describe warranty terms for each product category.', type: 'Text', required: false },
      { text: 'Do you provide on-site support in KSA?', type: 'Yes/No', required: true },
    ],
  },
  {
    title: 'Facility Services Qualification',
    status: 'Active', category: 'Facility Management', usedIn: 4, createdBy: 'Mariam Al-Dosari',
    questions: [
      { text: 'Upload your company commercial registration certificate.', type: 'File', required: true },
      { text: 'How many years of facility management experience do you have?', type: 'Numeric', required: true },
      { text: 'Upload a valid Zakat compliance certificate.', type: 'File', required: true },
      { text: 'Upload GOSI compliance certificate.', type: 'File', required: true },
      { text: 'Do you provide 24×7 emergency response services?', type: 'Yes/No', required: true },
      { text: 'Describe your SLA terms and response time guarantees.', type: 'Text', required: false },
    ],
  },
  {
    title: 'Professional Services Evaluation',
    status: 'Active', category: 'Professional Services', usedIn: 6, createdBy: 'Ahmed Al-Rashidi',
    questions: [
      { text: 'Upload your firm\'s professional indemnity insurance certificate.', type: 'File', required: true },
      { text: 'How many certified consultants will be assigned to this engagement?', type: 'Numeric', required: true },
      { text: 'Have you delivered similar projects in KSA within the last 3 years?', type: 'Yes/No', required: true },
      { text: 'Provide two references from comparable past engagements.', type: 'Text', required: true },
      { text: 'Rate your ability to mobilise within 2 weeks.', type: 'Rating', required: false },
      { text: 'Select your primary delivery methodology.', type: 'Single Select', required: true },
    ],
  },
  {
    title: 'Logistics & Freight Supplier',
    status: 'Active', category: 'Logistics', usedIn: 3, createdBy: 'Sourabh Jain',
    questions: [
      { text: 'Upload your freight forwarding licence issued by ZATCA.', type: 'File', required: true },
      { text: 'What is your maximum cargo capacity per shipment (in kg)?', type: 'Numeric', required: true },
      { text: 'Do you have real-time shipment tracking capability?', type: 'Yes/No', required: true },
      { text: 'List the ports and airports you operate from.', type: 'Text', required: true },
      { text: 'Do you offer cold-chain or hazmat handling?', type: 'Yes/No', required: false },
    ],
  },
  {
    title: 'Construction & Civil Works',
    status: 'Draft', category: 'Construction', usedIn: 0, createdBy: 'Mariam Al-Dosari',
    questions: [
      { text: 'Upload your contractor classification certificate (Grade A or above).', type: 'File', required: true },
      { text: 'What is your maximum bonding capacity (SAR)?', type: 'Numeric', required: true },
      { text: 'Confirm compliance with Vision 2030 Saudization requirements.', type: 'Yes/No', required: true },
      { text: 'Describe your safety management system and incident rate.', type: 'Text', required: true },
      { text: 'Upload your ISO 9001 or equivalent quality certificate.', type: 'File', required: false },
      { text: 'How many active projects are you currently managing?', type: 'Numeric', required: false },
    ],
  },
  {
    title: 'Software & SaaS Vendor Qualification',
    status: 'Active', category: 'IT Software', usedIn: 5, createdBy: 'Ahmed Al-Rashidi',
    questions: [
      { text: 'Is your solution hosted in a KSA or GCC data centre?', type: 'Yes/No', required: true },
      { text: 'Upload your ISO 27001 information security certificate.', type: 'File', required: true },
      { text: 'What is your guaranteed uptime SLA (%)?', type: 'Numeric', required: true },
      { text: 'Describe your data backup and disaster recovery policy.', type: 'Text', required: true },
      { text: 'Do you support SAML 2.0 / SSO integration?', type: 'Yes/No', required: false },
      { text: 'Rate the maturity of your customer support operation.', type: 'Rating', required: false },
    ],
  },
];

const TYPE_ICON: Record<QType, any> = {
  'File':          FileText,
  'Numeric':       Hash,
  'Yes/No':        ToggleLeft,
  'Text':          AlignLeft,
  'Single Select': Copy,
  'Rating':        Star,
};

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '8px 11px', fontSize: 13,
  fontFamily: 'inherit', border: '1px solid #e2e8f0', borderRadius: 7,
  outline: 'none', background: '#fff', color: '#111827',
};

export default function QuestionnaireTemplates({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [showNew, setShowNew]   = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat]     = useState('');
  const [newQ, setNewQ]         = useState('');
  const [newType, setNewType]   = useState<QType>('Text');

  const filtered = TEMPLATES.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Questionnaire Templates</h1>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Reusable question banks for auction questionnaires</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
                style={{ ...inp, paddingLeft: 28, width: 200, fontSize: 12 }} />
            </div>
            <button onClick={() => setShowNew(v => !v)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}>
              <Plus size={14} /> New Template
            </button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>

          {/* New template form */}
          {showNew && (
            <div style={{ background: '#fff', border: '1.5px dashed #e2e8f0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>New Template</p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Build a reusable question bank</p>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 5px' }}>Template Name <span style={{ color: '#ef4444' }}>*</span></p>
                  <input style={inp} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. MRO Supplier Qualification" />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 5px' }}>Category</p>
                  <select style={inp} value={newCat} onChange={e => setNewCat(e.target.value)}>
                    <option value="">Select…</option>
                    <option>IT Equipment</option><option>Facility Management</option>
                    <option>Professional Services</option><option>Logistics</option>
                    <option>Construction</option><option>IT Software</option>
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 5px' }}>First Question</p>
                  <textarea style={{ ...inp, resize: 'none' }} rows={2} value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Enter your question…" />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', margin: '0 0 5px' }}>Response Type</p>
                  <select style={inp} value={newType} onChange={e => setNewType(e.target.value as QType)}>
                    <option value="Text">Text</option>
                    <option value="Numeric">Numeric</option>
                    <option value="Yes/No">Yes/No</option>
                    <option value="File">File</option>
                    <option value="Single Select">Single Select</option>
                    <option value="Rating">Rating</option>
                  </select>
                </div>
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
                <button onClick={() => setShowNew(false)}
                  style={{ padding: '6px 14px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
                <button style={{ padding: '6px 14px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}>
                  Save Template
                </button>
              </div>
            </div>
          )}

          {/* Existing templates */}
          {filtered.map(tmpl => (
            <div key={tmpl.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Card header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0, lineHeight: 1.4 }}>{tmpl.title}</p>
                  <span className={tmpl.status === 'Active' ? 'vw-chip vw-chip--success' : 'vw-chip vw-chip--neutral'} style={{ flexShrink: 0 }}>{tmpl.status}</span>
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                  {tmpl.category} · {tmpl.questions.length} questions · used in {tmpl.usedIn} auction{tmpl.usedIn !== 1 ? 's' : ''} · {tmpl.createdBy}
                </p>
              </div>

              {/* Questions list */}
              <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tmpl.questions.map((q, i) => {
                  const Icon = TYPE_ICON[q.type];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace', flexShrink: 0, marginTop: 2, width: 14 }}>{i + 1}.</span>
                      <p style={{ fontSize: 12, color: '#374151', margin: 0, flex: 1, lineHeight: 1.45 }}>{q.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, background: '#f1f5f9', borderRadius: 999, padding: '2px 7px' }}>
                        <Icon size={11} color="#6b7280" />
                        <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{q.type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div style={{ padding: '11px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#fff', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                  <Edit2 size={12} /> Edit
                </button>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}>
                  <Upload size={12} /> Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>No templates match "{search}"</p>
            <p style={{ fontSize: 12, margin: '6px 0 0' }}>Try a different keyword or create a new template.</p>
          </div>
        )}
      </div>
    </div>
  );
}
