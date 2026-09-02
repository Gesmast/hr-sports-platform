import { PortalOrder, NewsletterSubscriber, QuoteInquiryPayload, ContactMessagePayload } from '@/types';
import { generateReferenceId } from './utils';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string; // In production this would be hashed with bcrypt
  companyName: string;
  role: 'client' | 'admin';
}

// Initial mock users
export const mockUsers: DbUser[] = [
  {
    id: 'usr-client-01',
    name: 'Marcus Vance',
    email: 'client@demo.com',
    password: 'password123',
    companyName: 'Apex Sports Syndicate',
    role: 'client',
  },
  {
    id: 'usr-admin-01',
    name: 'Hafeez Ahmed',
    email: 'admin@hrsports.com',
    password: 'adminpassword123',
    companyName: 'HR Sports Headquarters',
    role: 'admin',
  },
];

// Initial realistic active factory orders for client portal
export const mockOrders: PortalOrder[] = [
  {
    id: 'ord-2026-091',
    referenceNumber: 'HRS-2026-8492',
    clientEmail: 'client@demo.com',
    companyName: 'Apex Sports Syndicate',
    garmentType: 'Pro Performance Jersey (Home & Away Sets)',
    quantity: 1200,
    material: 'AeroVent™ Performance Micro-Mesh (145 GSM)',
    stage: 'in_production',
    submittedDate: '2026-02-04',
    estimatedDeliveryDate: '2026-02-28',
    carrier: 'DHL Express Worldwide',
    trackingNumber: 'DHL-9482710394-EXP',
    sampleStatus: 'Sample Approved',
    productionProgressPercent: 65,
    documents: [
      {
        id: 'doc-1',
        name: 'Proforma_Invoice_HRS-8492.pdf',
        type: 'invoice',
        size: '245 KB',
        date: '2026-02-04',
        downloadUrl: '#download-invoice',
      },
      {
        id: 'doc-2',
        name: 'Approved_TechPack_Apex_v3.pdf',
        type: 'techpack',
        size: '14.2 MB',
        date: '2026-02-07',
        downloadUrl: '#download-techpack',
      },
      {
        id: 'doc-3',
        name: 'Physical_Sample_Approval_Signoff.pdf',
        type: 'qc_cert',
        size: '1.8 MB',
        date: '2026-02-09',
        downloadUrl: '#download-signoff',
      },
    ],
  },
  {
    id: 'ord-2026-088',
    referenceNumber: 'HRS-2026-7731',
    clientEmail: 'client@demo.com',
    companyName: 'Apex Sports Syndicate',
    garmentType: 'Winter Sideline Micro-Grid Fleece Tracksuits',
    quantity: 450,
    material: 'StormTech™ Micro-Grid Fleece (290 GSM)',
    stage: 'shipped',
    submittedDate: '2026-01-15',
    estimatedDeliveryDate: '2026-02-18',
    carrier: 'FedEx International Priority',
    trackingNumber: 'FX-88392019482',
    sampleStatus: 'Sample Approved',
    productionProgressPercent: 100,
    documents: [
      {
        id: 'doc-4',
        name: 'Commercial_Invoice_HRS-7731.pdf',
        type: 'invoice',
        size: '310 KB',
        date: '2026-01-15',
        downloadUrl: '#download-invoice',
      },
      {
        id: 'doc-5',
        name: 'AQL_2.5_Final_Quality_Certificate.pdf',
        type: 'qc_cert',
        size: '2.1 MB',
        date: '2026-02-10',
        downloadUrl: '#download-qc',
      },
      {
        id: 'doc-6',
        name: 'Air_Waybill_Cargo_BOL.pdf',
        type: 'shipping_bol',
        size: '890 KB',
        date: '2026-02-12',
        downloadUrl: '#download-bol',
      },
    ],
  },
];

// Persistent mock store in memory
export const mockSubscribers: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'procurement@sportsline.com',
    subscribedAt: new Date().toISOString(),
  },
];

export const mockInquiries: (QuoteInquiryPayload & { id: string; referenceNumber: string; createdAt: string })[] = [];
export const mockContactMessages: (ContactMessagePayload & { id: string; createdAt: string })[] = [];

// Database Helper Methods
export const db = {
  findUserByEmail: async (email: string) => {
    return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser: async (user: Omit<DbUser, 'id'>) => {
    const newUser: DbUser = {
      ...user,
      id: `usr-${Date.now()}`,
    };
    mockUsers.push(newUser);
    return newUser;
  },
  getOrdersForUser: async (email: string) => {
    return mockOrders.filter((o) => o.clientEmail.toLowerCase() === email.toLowerCase());
  },
  createOrderFromQuote: async (quote: QuoteInquiryPayload, refId: string) => {
    const newOrder: PortalOrder = {
      id: `ord-${Date.now()}`,
      referenceNumber: refId,
      clientEmail: quote.contactEmail,
      companyName: quote.companyName,
      garmentType: quote.garmentType,
      quantity: quote.volumeMOQ,
      material: quote.materialVariant,
      stage: 'received',
      submittedDate: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: quote.targetDeliveryDate || 'Pending Schedule',
      sampleStatus: 'Pending Design',
      productionProgressPercent: 10,
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: `Intake_Confirmation_${refId}.pdf`,
          type: 'invoice',
          size: '180 KB',
          date: new Date().toISOString().split('T')[0],
          downloadUrl: '#download-intake',
        },
      ],
    };
    mockOrders.unshift(newOrder);
    return newOrder;
  },
  saveQuoteInquiry: async (payload: QuoteInquiryPayload) => {
    const refId = generateReferenceId();
    const entry = {
      ...payload,
      id: `inq-${Date.now()}`,
      referenceNumber: refId,
      createdAt: new Date().toISOString(),
    };
    mockInquiries.push(entry);
    // Auto-create portal order entry so clients logging in can see their newly submitted quote
    await db.createOrderFromQuote(payload, refId);
    return entry;
  },
  addSubscriber: async (email: string) => {
    const existing = mockSubscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: true, alreadySubscribed: true, subscriber: existing };
    }
    const subscriber: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
    };
    mockSubscribers.push(subscriber);
    return { success: true, alreadySubscribed: false, subscriber };
  },
  saveContactMessage: async (payload: ContactMessagePayload) => {
    const entry = {
      ...payload,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockContactMessages.push(entry);
    return entry;
  },
};
