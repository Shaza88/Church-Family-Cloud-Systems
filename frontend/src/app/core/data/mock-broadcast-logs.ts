import { BroadcastLog } from '../models/broadcast-log.model';

export const MOCK_BROADCAST_LOGS: BroadcastLog[] = [
  {
    id: 'bl-001',
    subject: 'Sunday Service Update – April 13',
    body: 'Dear Congregation, please be advised that this Sunday\'s service will begin 30 minutes earlier at 9:30 AM due to a special guest speaker.',
    dateSent: '2025-04-13T09:00:00.000Z',
    recipientCount: 84,
    targetAudience: 'All Active Households',
    recipients: [{ name: 'John Doe', household: 'Doe Family', email: 'john@example.com' }, { name: 'Jane Doe', household: 'Doe Family', email: 'jane@example.com' }],
  },
  {
    id: 'bl-002',
    subject: 'Choir Rehearsal Cancelled – March 28',
    body: 'Hi Choir members, this Friday\'s rehearsal session has been cancelled due to a scheduling conflict. We will resume next Friday.',
    dateSent: '2025-03-28T14:30:00.000Z',
    recipientCount: 22,
    targetAudience: 'Choir',
    recipients: [{ name: 'Alice Smith', household: 'Smith Family', email: 'alice@example.com' }],
  },
  {
    id: 'bl-003',
    subject: 'Annual Stewardship Campaign Kickoff',
    body: 'We are excited to announce the beginning of this year\'s stewardship campaign. More details to follow. May God bless your generosity.',
    dateSent: '2025-03-01T08:00:00.000Z',
    recipientCount: 97,
    targetAudience: 'All Active Households',
    recipients: [{ name: 'Bob Johnson', household: 'Johnson Family', email: 'bob@example.com' }],
  },
];
