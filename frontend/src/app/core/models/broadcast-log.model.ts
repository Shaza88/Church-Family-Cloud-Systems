export interface BroadcastLog {
  id: string;
  subject: string;
  body: string;
  dateSent: string; // ISO 8601 string
  recipientCount: number;
  targetAudience: string; // Human-readable description e.g. "All Active Households" or "Choir Members, Youth Group"
  recipients: { name: string; household: string; email?: string }[];
}
