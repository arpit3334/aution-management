import { EvalGateStage, EvalCriteria, EvalGate, eBid } from '../types/auction';

export const GATE_CRITERIA: Record<EvalGateStage, EvalCriteria[]> = {
  preliminary: [
    { id: 'bid_bond', name: 'Bid Bond Submitted & Verified', description: 'Confirm bid security/bank guarantee submitted', type: 'boolean', weight: 0, required: true },
    { id: 'docs_complete', name: 'Document Completeness', description: 'All required documents submitted', type: 'boolean', weight: 0, required: true },
    { id: 'format_compliance', name: 'Submission Format Compliance', description: 'Bid submitted in prescribed format before deadline', type: 'boolean', weight: 0, required: true },
    { id: 'vendor_eligibility', name: 'Vendor Eligibility (Not Blacklisted)', description: 'Vendor is registered, not debarred', type: 'boolean', weight: 0, required: true },
    { id: 'validity_adequate', name: 'Bid Validity Period Adequate', description: 'Quoted validity meets required bid validity', type: 'boolean', weight: 0, required: false },
  ],
  technical: [
    { id: 'spec_compliance', name: 'Technical Specification Compliance', description: 'Degree of compliance with stated technical specifications', type: 'score', weight: 30, required: false },
    { id: 'experience', name: 'Previous Experience & References', description: 'Track record with similar projects', type: 'score', weight: 25, required: false },
    { id: 'certifications', name: 'Quality Certifications & Standards', description: 'Relevant ISO or industry certifications', type: 'score', weight: 20, required: false },
    { id: 'team_capability', name: 'Technical Team Qualifications', description: 'Competency of proposed delivery team', type: 'score', weight: 15, required: false },
    { id: 'methodology', name: 'Implementation Methodology', description: 'Quality of proposed delivery plan', type: 'score', weight: 10, required: false },
  ],
  commercial: [
    { id: 'price_competitiveness', name: 'Pricing Competitiveness', description: 'Unit/total price relative to estimate and competing bids', type: 'score', weight: 40, required: false },
    { id: 'payment_terms', name: 'Payment Terms Favourability', description: 'Advance payment requirements, credit terms', type: 'score', weight: 20, required: false },
    { id: 'delivery_timeline', name: 'Delivery / Completion Timeline', description: 'Proposed delivery schedule vs requirement', type: 'score', weight: 20, required: false },
    { id: 'warranty_support', name: 'Warranty & After-Sales Support', description: 'Duration and coverage of warranty', type: 'score', weight: 10, required: false },
    { id: 'packaging_logistics', name: 'Packaging & Logistics', description: 'Packaging quality, transportation terms', type: 'score', weight: 10, required: false },
  ],
  financial: [
    { id: 'evaluated_bid_price', name: 'Evaluated Bid Price (EBP)', description: 'Adjusted total price accounting for deviations', type: 'score', weight: 50, required: false },
    { id: 'value_for_money', name: 'Value for Money Score', description: 'Combined weighted technical + commercial score', type: 'score', weight: 30, required: false },
    { id: 'savings_potential', name: 'Savings vs Budget Estimate', description: 'Percentage savings relative to estimated value', type: 'score', weight: 20, required: false },
  ],
};

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────
export const eb001Gates: EvalGate[] = [
  {
    stage: 'preliminary', label: 'Preliminary', status: 'completed',
    startedDate: '2025-01-06', completedDate: '2025-01-06', completedBy: 'John Smith',
    gateNotes: 'All 3 vendors passed preliminary compliance check.',
    vendorEvals: [
      { vendorId: 'V001', vendorName: 'Tech Solutions Ltd', criteriaEvals: [{ criteriaId: 'bid_bond', passed: true }, { criteriaId: 'docs_complete', passed: true }, { criteriaId: 'format_compliance', passed: true }, { criteriaId: 'vendor_eligibility', passed: true }, { criteriaId: 'validity_adequate', passed: true }], result: 'pass', evaluatedBy: 'John Smith', evaluatedDate: '2025-01-06', evaluatorNotes: 'Full compliance. All documents in order.' },
      { vendorId: 'V002', vendorName: 'Digital Systems Inc', criteriaEvals: [{ criteriaId: 'bid_bond', passed: true }, { criteriaId: 'docs_complete', passed: true }, { criteriaId: 'format_compliance', passed: true }, { criteriaId: 'vendor_eligibility', passed: true }, { criteriaId: 'validity_adequate', passed: true }], result: 'pass', evaluatedBy: 'John Smith', evaluatedDate: '2025-01-06', evaluatorNotes: 'All documents present and valid.' },
      { vendorId: 'V003', vendorName: 'Hardware Pro', criteriaEvals: [{ criteriaId: 'bid_bond', passed: true }, { criteriaId: 'docs_complete', passed: true }, { criteriaId: 'format_compliance', passed: true }, { criteriaId: 'vendor_eligibility', passed: true }, { criteriaId: 'validity_adequate', passed: true }], result: 'pass', evaluatedBy: 'John Smith', evaluatedDate: '2025-01-06', evaluatorNotes: 'Compliant.' },
    ],
  },
  {
    stage: 'technical', label: 'Technical', status: 'in_progress', passingScore: 70,
    startedDate: '2025-01-07', completedBy: '', gateNotes: '',
    vendorEvals: [
      { vendorId: 'V001', vendorName: 'Tech Solutions Ltd', criteriaEvals: [{ criteriaId: 'spec_compliance', score: 92 }, { criteriaId: 'experience', score: 88 }, { criteriaId: 'certifications', score: 85 }, { criteriaId: 'team_capability', score: 82 }, { criteriaId: 'methodology', score: 90 }], weightedScore: 88, result: 'pass', evaluatedBy: 'Sarah Wilson', evaluatedDate: '2025-01-08', evaluatorNotes: 'Excellent technical submission.' },
      { vendorId: 'V002', vendorName: 'Digital Systems Inc', criteriaEvals: [{ criteriaId: 'spec_compliance', score: 85 }, { criteriaId: 'experience', score: 80 }, { criteriaId: 'certifications', score: 78 }, { criteriaId: 'team_capability', score: 82 }, { criteriaId: 'methodology', score: 80 }], weightedScore: 82, result: 'pass', evaluatedBy: 'Sarah Wilson', evaluatedDate: '2025-01-08', evaluatorNotes: 'Good technical compliance.' },
      { vendorId: 'V003', vendorName: 'Hardware Pro', criteriaEvals: [{ criteriaId: 'spec_compliance', score: 78 }, { criteriaId: 'experience', score: 75 }, { criteriaId: 'certifications', score: 72 }, { criteriaId: 'team_capability', score: 70 }, { criteriaId: 'methodology', score: 68 }], weightedScore: 74, result: 'pass', evaluatedBy: 'Sarah Wilson', evaluatedDate: '2025-01-08', evaluatorNotes: 'Meets minimum technical threshold.' },
    ],
  },
  { stage: 'commercial', label: 'Commercial', status: 'locked', passingScore: 60, vendorEvals: [{ vendorId: 'V001', vendorName: 'Tech Solutions Ltd', criteriaEvals: [], result: 'pending' }, { vendorId: 'V002', vendorName: 'Digital Systems Inc', criteriaEvals: [], result: 'pending' }, { vendorId: 'V003', vendorName: 'Hardware Pro', criteriaEvals: [], result: 'pending' }] },
  { stage: 'financial', label: 'Financial', status: 'locked', vendorEvals: [{ vendorId: 'V001', vendorName: 'Tech Solutions Ltd', criteriaEvals: [], result: 'pending' }, { vendorId: 'V002', vendorName: 'Digital Systems Inc', criteriaEvals: [], result: 'pending' }, { vendorId: 'V003', vendorName: 'Hardware Pro', criteriaEvals: [], result: 'pending' }] },
];

export const MOCK_BIDS: eBid[] = [
  {
    id: 'EB001', eBidNumber: 'eBID-2024-001', title: 'IT Hardware Supply - Laptops & Peripherals',
    linkedRFQId: 'RFQ-2024-102', linkedRFQNumber: 'RFQ-2024-102', linkedPRId: 'PR-2024-046', linkedPRNumber: 'PR-2024-046',
    status: 'Under Evaluation', bidType: 'Sealed', category: 'IT Equipment', department: 'IT Department',
    createdBy: 'John Smith', createdDate: '2024-12-18', publishedDate: '2024-12-19',
    submissionOpenDate: '2024-12-19', submissionDeadline: '2025-01-05', bidOpeningDate: '2025-01-06',
    bidValidityDays: 90, bidBondRequired: true, bidBondAmount: 25000, estimatedValue: 450000, currency: 'INR',
    description: 'Sealed bid for supply of IT hardware including laptops, monitors, and accessories for 25 new workstations.',
    termsAndConditions: ['All bids must be submitted electronically before the submission deadline.', 'Bid bond of ₹25,000 is mandatory in the form of a bank guarantee.', 'Bids will remain valid for 90 days from the submission deadline.', 'Delivery must be completed within the quoted timeline to the Main Office.', 'All products must carry manufacturer warranty of minimum 1 year.'],
    lineItems: [
      { id: 'LI001', code: 'FG-LT-001', description: 'Dell Latitude 5420 Laptop', quantity: 25, unit: 'pcs', specifications: 'i5-11th Gen, 16GB RAM, 512GB SSD, Win 11 Pro', estimatedUnitPrice: 75000 },
      { id: 'LI002', code: 'FG-MN-024', description: 'Dell 24" Monitor P2422H', quantity: 25, unit: 'pcs', specifications: 'Full HD 1920x1080, IPS, USB-C', estimatedUnitPrice: 18000 },
      { id: 'LI003', code: 'FG-KM-015', description: 'Wireless Keyboard & Mouse Combo', quantity: 25, unit: 'sets', specifications: 'Logitech MK270, 2.4GHz', estimatedUnitPrice: 2500 },
      { id: 'LI004', code: 'FG-LB-008', description: 'Laptop Bags', quantity: 25, unit: 'pcs', specifications: '15.6" professional grade, water resistant', estimatedUnitPrice: 2000 },
    ],
    vendorInvitations: [
      { id: 'VI001', vendorId: 'V001', vendorName: 'Tech Solutions Ltd', email: 'contact@techsolutions.com', contactPerson: 'Rajesh Kumar', phone: '+91 98765 43210', invitedDate: '2024-12-19', status: 'Submitted', acknowledgedDate: '2024-12-20', submittedDate: '2024-12-28', submissionId: 'BS001' },
      { id: 'VI002', vendorId: 'V002', vendorName: 'Digital Systems Inc', email: 'sales@digitalsystems.com', contactPerson: 'Priya Sharma', phone: '+91 98765 43211', invitedDate: '2024-12-19', status: 'Submitted', acknowledgedDate: '2024-12-20', submittedDate: '2024-12-30', submissionId: 'BS002' },
      { id: 'VI003', vendorId: 'V003', vendorName: 'Hardware Pro', email: 'info@hardwarepro.com', contactPerson: 'Amit Patel', phone: '+91 98765 43212', invitedDate: '2024-12-19', status: 'Submitted', acknowledgedDate: '2024-12-21', submittedDate: '2025-01-02', submissionId: 'BS003' },
      { id: 'VI004', vendorId: 'V004', vendorName: 'CompuWorld', email: 'sales@compuworld.com', contactPerson: 'Sarah Johnson', phone: '+91 98765 43213', invitedDate: '2024-12-19', status: 'Declined', acknowledgedDate: '2024-12-20', declineReason: 'Unable to meet delivery timeline.' },
    ],
    submissions: [
      { id: 'BS001', submissionRef: 'BID-TS-001', eBidId: 'EB001', vendorId: 'V001', vendorName: 'Tech Solutions Ltd', submittedDate: '2024-12-28', status: 'Shortlisted', totalAmount: 2375000, currencyCode: 'INR', paymentTerms: '30% advance, 70% on delivery', deliveryDays: 15, validityDays: 90, bidBondProvided: true, bidBondAmount: 25000, lineItems: [{ lineItemId: 'LI001', code: 'FG-LT-001', description: 'Dell Latitude 5420 Laptop', quantity: 25, unit: 'pcs', unitPrice: 72500, totalPrice: 1812500, deliveryDays: 15, remarks: 'Bulk discount applied' }, { lineItemId: 'LI002', code: 'FG-MN-024', description: 'Dell 24" Monitor P2422H', quantity: 25, unit: 'pcs', unitPrice: 17000, totalPrice: 425000, deliveryDays: 15 }, { lineItemId: 'LI003', code: 'FG-KM-015', description: 'Wireless Keyboard & Mouse Combo', quantity: 25, unit: 'sets', unitPrice: 2200, totalPrice: 55000, deliveryDays: 15 }, { lineItemId: 'LI004', code: 'FG-LB-008', description: 'Laptop Bags', quantity: 25, unit: 'pcs', unitPrice: 1650, totalPrice: 41250, deliveryDays: 15 }], technicalScore: 88, commercialScore: 92, overallScore: 90, evaluatorNotes: 'Strong technical compliance. Competitive pricing. Recommended for award.', attachments: [{ name: 'Tech_Solutions_Bid.pdf', size: '3.2 MB' }, { name: 'Bid_Bond_TS.pdf', size: '0.8 MB' }] },
      { id: 'BS002', submissionRef: 'BID-DS-001', eBidId: 'EB001', vendorId: 'V002', vendorName: 'Digital Systems Inc', submittedDate: '2024-12-30', status: 'Submitted', totalAmount: 2598000, currencyCode: 'INR', paymentTerms: '50% advance, 50% on delivery', deliveryDays: 10, validityDays: 90, bidBondProvided: true, bidBondAmount: 25000, lineItems: [{ lineItemId: 'LI001', code: 'FG-LT-001', description: 'Dell Latitude 5420 Laptop', quantity: 25, unit: 'pcs', unitPrice: 78000, totalPrice: 1950000, deliveryDays: 10 }, { lineItemId: 'LI002', code: 'FG-MN-024', description: 'Dell 24" Monitor P2422H', quantity: 25, unit: 'pcs', unitPrice: 19500, totalPrice: 487500, deliveryDays: 10 }, { lineItemId: 'LI003', code: 'FG-KM-015', description: 'Wireless Keyboard & Mouse Combo', quantity: 25, unit: 'sets', unitPrice: 2450, totalPrice: 61250, deliveryDays: 10 }, { lineItemId: 'LI004', code: 'FG-LB-008', description: 'Laptop Bags', quantity: 25, unit: 'pcs', unitPrice: 1990, totalPrice: 49750, deliveryDays: 10 }], technicalScore: 82, commercialScore: 75, overallScore: 79, evaluatorNotes: 'Good offering. Faster delivery. Pricing above market.', attachments: [{ name: 'Digital_Systems_Bid.pdf', size: '2.9 MB' }] },
      { id: 'BS003', submissionRef: 'BID-HP-001', eBidId: 'EB001', vendorId: 'V003', vendorName: 'Hardware Pro', submittedDate: '2025-01-02', status: 'Submitted', totalAmount: 2212500, currencyCode: 'INR', paymentTerms: '50% advance, 50% on delivery', deliveryDays: 21, validityDays: 90, bidBondProvided: true, bidBondAmount: 25000, lineItems: [{ lineItemId: 'LI001', code: 'FG-LT-001', description: 'Dell Latitude 5420 Laptop', quantity: 25, unit: 'pcs', unitPrice: 68000, totalPrice: 1700000, deliveryDays: 21, remarks: 'Best price guarantee' }, { lineItemId: 'LI002', code: 'FG-MN-024', description: 'Dell 24" Monitor P2422H', quantity: 25, unit: 'pcs', unitPrice: 17500, totalPrice: 437500, deliveryDays: 21 }, { lineItemId: 'LI003', code: 'FG-KM-015', description: 'Wireless Keyboard & Mouse Combo', quantity: 25, unit: 'sets', unitPrice: 2000, totalPrice: 50000, deliveryDays: 21 }, { lineItemId: 'LI004', code: 'FG-LB-008', description: 'Laptop Bags', quantity: 25, unit: 'pcs', unitPrice: 1000, totalPrice: 25000, deliveryDays: 21 }], technicalScore: 79, commercialScore: 95, overallScore: 86, evaluatorNotes: 'Lowest bid. Long delivery timeline is a concern.', attachments: [{ name: 'Hardware_Pro_Bid.pdf', size: '2.5 MB' }] },
    ],
    activities: [{ action: 'Bids opened and evaluation started', user: 'John Smith', timestamp: '06 Jan 2025, 09:00', type: 'open' }, { action: 'Bid submitted by Hardware Pro', user: 'System', timestamp: '02 Jan 2025, 16:45', type: 'submission' }, { action: 'Bid submitted by Digital Systems Inc', user: 'System', timestamp: '30 Dec 2024, 14:22', type: 'submission' }, { action: 'Bid submitted by Tech Solutions Ltd', user: 'System', timestamp: '28 Dec 2024, 11:10', type: 'submission' }, { action: 'eBid published', user: 'John Smith', timestamp: '19 Dec 2024, 09:55', type: 'publish' }, { action: 'eBid created from RFQ-2024-102', user: 'John Smith', timestamp: '18 Dec 2024, 17:30', type: 'create' }],
    gates: eb001Gates,
  },
  {
    id: 'EB002', eBidNumber: 'eBID-2024-002', title: 'Office Furniture & Fixtures Procurement',
    linkedRFQId: 'RFQ-2024-098', linkedRFQNumber: 'RFQ-2024-098', linkedPRId: 'PR-2024-041', linkedPRNumber: 'PR-2024-041',
    status: 'Submission Open', bidType: 'Sealed', category: 'Furniture', department: 'Admin',
    createdBy: 'Anika Roy', createdDate: '2025-01-05', publishedDate: '2025-01-06',
    submissionOpenDate: '2025-01-06', submissionDeadline: '2025-01-25', bidOpeningDate: '2025-01-26',
    bidValidityDays: 60, bidBondRequired: false, estimatedValue: 850000, currency: 'INR',
    description: 'Supply and installation of office furniture for the new wing.',
    termsAndConditions: ['Installation must be completed within 7 days of delivery.', 'All furniture must meet BIS standards.'],
    lineItems: [{ id: 'LI001', code: 'OF-WS-001', description: 'Executive Workstation', quantity: 20, unit: 'nos', specifications: 'L-shaped, 1800x1600mm, laminate finish', estimatedUnitPrice: 25000 }, { id: 'LI002', code: 'OF-CH-002', description: 'Ergonomic Office Chair', quantity: 20, unit: 'nos', specifications: 'High back, lumbar support, mesh back', estimatedUnitPrice: 15000 }, { id: 'LI003', code: 'OF-ST-003', description: 'Filing Cabinet 4-Drawer', quantity: 10, unit: 'nos', specifications: 'Steel, lockable', estimatedUnitPrice: 12000 }],
    vendorInvitations: [{ id: 'VI001', vendorId: 'VF001', vendorName: 'Furniture World', email: 'sales@furnitureworld.com', contactPerson: 'Ravi Gupta', phone: '+91 99887 76655', invitedDate: '2025-01-06', status: 'Acknowledged', acknowledgedDate: '2025-01-07' }, { id: 'VI002', vendorId: 'VF002', vendorName: 'Office Plus', email: 'info@officeplus.com', contactPerson: 'Sunita Mehta', phone: '+91 99887 76656', invitedDate: '2025-01-06', status: 'Invited' }],
    submissions: [],
    activities: [{ action: 'eBid published', user: 'Anika Roy', timestamp: '06 Jan 2025, 10:25', type: 'publish' }, { action: 'eBid created from RFQ-2024-098', user: 'Anika Roy', timestamp: '05 Jan 2025, 16:00', type: 'create' }],
  },
  {
    id: 'EB003', eBidNumber: 'eBID-2024-003', title: 'Annual Security Services Contract',
    linkedRFQId: 'RFQ-2024-089', linkedRFQNumber: 'RFQ-2024-089', linkedPRId: 'PR-2024-032', linkedPRNumber: 'PR-2024-032',
    status: 'Awarded', bidType: 'Sealed', category: 'Security Services', department: 'Facilities',
    createdBy: 'Meera Nair', createdDate: '2024-11-15', publishedDate: '2024-11-16',
    submissionOpenDate: '2024-11-16', submissionDeadline: '2024-12-01', bidOpeningDate: '2024-12-02', awardDate: '2024-12-15',
    bidValidityDays: 120, bidBondRequired: true, bidBondAmount: 50000, estimatedValue: 3600000, currency: 'INR',
    description: 'Annual contract for security guard services across 3 facilities.',
    termsAndConditions: ['Services must commence from 01 Jan 2025.', 'All guards must be trained and certified.'],
    lineItems: [{ id: 'LI001', code: 'SV-SG-001', description: 'Security Guard (Day Shift)', quantity: 12, unit: 'persons/year', specifications: 'Trained, armed, 8-hr shift', estimatedUnitPrice: 200000 }, { id: 'LI002', code: 'SV-SG-002', description: 'Security Guard (Night Shift)', quantity: 12, unit: 'persons/year', specifications: 'Trained, armed, 8-hr shift', estimatedUnitPrice: 225000 }],
    vendorInvitations: [{ id: 'VI001', vendorId: 'VS001', vendorName: 'SecureShield India', email: 'bd@secureshield.com', contactPerson: 'Ajay Varma', phone: '+91 98800 11223', invitedDate: '2024-11-16', status: 'Submitted', acknowledgedDate: '2024-11-17', submittedDate: '2024-11-28' }],
    submissions: [],
    awardedVendorId: 'VS001', awardedVendorName: 'SecureShield India', awardedAmount: 3420000, awardedDate: '2024-12-15',
    awardNotes: 'Best overall bid with strong technical compliance and competitive pricing.',
    activities: [{ action: 'Bid awarded to SecureShield India', user: 'Meera Nair', timestamp: '15 Dec 2024, 11:30', type: 'award' }, { action: 'eBid created from RFQ-2024-089', user: 'Meera Nair', timestamp: '15 Nov 2024, 10:00', type: 'create' }],
  },
  {
    id: 'EB004', eBidNumber: 'eBID-2025-004', title: 'Printing & Stationery Supplies - Q1 2025',
    linkedRFQId: 'RFQ-2025-015', linkedRFQNumber: 'RFQ-2025-015', linkedPRId: 'PR-2025-008', linkedPRNumber: 'PR-2025-008',
    status: 'Submission Open', bidType: 'Open', category: 'Office Supplies', department: 'Procurement',
    createdBy: 'Rahul Sharma', createdDate: '2026-03-15', publishedDate: '2026-03-16',
    submissionOpenDate: '2026-03-16', submissionDeadline: '2026-04-15', bidOpeningDate: '2026-04-16',
    bidValidityDays: 60, bidBondRequired: false, estimatedValue: 285000, currency: 'INR',
    description: 'Open competitive bidding for printing and stationery supplies for Q1 2025.',
    termsAndConditions: ['This is an open bid - current lowest bid amount is visible to all vendors.', 'Delivery must be completed within 7 days of PO issuance.'],
    lineItems: [{ id: 'LI001', code: 'ST-PP-001', description: 'A4 Copier Paper 80 GSM', quantity: 500, unit: 'reams', specifications: 'White, 500 sheets/ream', estimatedUnitPrice: 250 }, { id: 'LI002', code: 'ST-PB-003', description: 'Ball Point Pens - Blue', quantity: 1000, unit: 'pcs', specifications: 'Smooth writing', estimatedUnitPrice: 10 }],
    vendorInvitations: [{ id: 'VI001', vendorId: 'VST001', vendorName: 'Office Supplies Plus', email: 'sales@officesuppliesplus.com', contactPerson: 'Anita Desai', phone: '+91 98765 43220', invitedDate: '2026-03-16', status: 'Submitted', acknowledgedDate: '2026-03-17', submittedDate: '2026-03-20', submissionId: 'BS-OSP-001' }],
    submissions: [{ id: 'BS-OSP-001', submissionRef: 'BID-OSP-001', eBidId: 'EB004', vendorId: 'VST001', vendorName: 'Office Supplies Plus', submittedDate: '2026-03-20', status: 'Submitted', totalAmount: 143500, currencyCode: 'INR', paymentTerms: 'Net 30 days', deliveryDays: 7, validityDays: 60, bidBondProvided: false, lineItems: [{ lineItemId: 'LI001', code: 'ST-PP-001', description: 'A4 Copier Paper 80 GSM', quantity: 500, unit: 'reams', unitPrice: 245, totalPrice: 122500, deliveryDays: 7 }, { lineItemId: 'LI002', code: 'ST-PB-003', description: 'Ball Point Pens - Blue', quantity: 1000, unit: 'pcs', unitPrice: 9, totalPrice: 9000, deliveryDays: 7 }], attachments: [{ name: 'OSP_Bid_Proposal.pdf', size: '1.8 MB' }] }],
    activities: [{ action: 'eBid published as Open Bid', user: 'Rahul Sharma', timestamp: '16 Mar 2026, 09:20', type: 'publish' }, { action: 'eBid created from RFQ-2025-015', user: 'Rahul Sharma', timestamp: '15 Mar 2026, 16:45', type: 'create' }],
  },
  {
    id: 'EB005', eBidNumber: 'eBID-2025-005', title: 'Cloud Infrastructure Services - Annual Contract',
    linkedRFQId: 'RFQ-2025-022', linkedRFQNumber: 'RFQ-2025-022', linkedPRId: 'PR-2025-012', linkedPRNumber: 'PR-2025-012',
    status: 'Draft', bidType: 'Sealed', category: 'IT Services', department: 'IT Department',
    createdBy: 'Priya Kapoor', createdDate: '2026-06-28',
    submissionOpenDate: '2026-07-15', submissionDeadline: '2026-08-15', bidOpeningDate: '2026-08-16',
    bidValidityDays: 120, bidBondRequired: true, bidBondAmount: 100000, estimatedValue: 5400000, currency: 'INR',
    description: 'Annual cloud infrastructure services including hosting, storage, and managed services. Draft in preparation.',
    termsAndConditions: ['Service Level Agreement must guarantee 99.9% uptime.', 'All data must be stored in India data centers.'],
    lineItems: [{ id: 'LI001', code: 'CL-VM-001', description: 'Virtual Machine Instances (Medium)', quantity: 12, unit: 'instances/year', specifications: '4 vCPU, 8GB RAM, 100GB SSD', estimatedUnitPrice: 120000 }, { id: 'LI002', code: 'CL-MS-004', description: 'Managed Services & Support', quantity: 1, unit: 'year', specifications: '24/7 support, dedicated account manager', estimatedUnitPrice: 960000 }],
    vendorInvitations: [], submissions: [],
    activities: [{ action: 'Draft eBid created from RFQ-2025-022', user: 'Priya Kapoor', timestamp: '28 Jun 2026, 11:30', type: 'create' }],
  },
];

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

export const AVAILABLE_RFQS = [
  { code: 'RFQ-2024-102', title: 'IT Hardware Quotation', category: 'IT Equipment', department: 'IT Department', currency: 'INR', items: [{ id: 'I1', code: 'FG-LT-001', description: 'Dell Latitude 5420 Laptop', quantity: 25, unit: 'pcs', specifications: 'i5-11th Gen, 16GB RAM, 512GB SSD', estimatedUnitPrice: 75000 }, { id: 'I2', code: 'FG-MN-024', description: 'Dell 24" Monitor P2422H', quantity: 25, unit: 'pcs', specifications: 'Full HD, IPS, USB-C', estimatedUnitPrice: 18000 }] },
  { code: 'RFQ-2024-098', title: 'Office Furniture Supply', category: 'Furniture', department: 'Admin', currency: 'INR', items: [{ id: 'I1', code: 'OF-WS-001', description: 'Executive Workstation', quantity: 20, unit: 'nos', specifications: 'L-shaped, 1800x1600mm', estimatedUnitPrice: 25000 }, { id: 'I2', code: 'OF-CH-002', description: 'Ergonomic Office Chair', quantity: 20, unit: 'nos', specifications: 'High back, lumbar support', estimatedUnitPrice: 15000 }] },
  { code: 'RFQ-2025-015', title: 'Printing & Stationery Q1', category: 'Office Supplies', department: 'Procurement', currency: 'INR', items: [{ id: 'I1', code: 'ST-PP-001', description: 'A4 Copier Paper 80 GSM', quantity: 500, unit: 'reams', specifications: 'JK/ITC brand', estimatedUnitPrice: 250 }] },
];

export const AVAILABLE_VENDORS = [
  { id: 'V001', name: 'Tech Solutions Ltd', email: 'contact@techsolutions.com', contact: 'Rajesh Kumar', category: 'IT Equipment' },
  { id: 'V002', name: 'Digital Systems Inc', email: 'sales@digitalsystems.com', contact: 'Priya Sharma', category: 'IT Equipment' },
  { id: 'V003', name: 'Hardware Pro', email: 'info@hardwarepro.com', contact: 'Amit Patel', category: 'IT Equipment' },
  { id: 'V004', name: 'Furniture World', email: 'sales@furnitureworld.com', contact: 'Ravi Gupta', category: 'Furniture' },
  { id: 'V005', name: 'Office Plus', email: 'info@officeplus.com', contact: 'Sunita Mehta', category: 'Furniture' },
];
