import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BroadcastLog } from '../models/broadcast-log.model';
import { MOCK_BROADCAST_LOGS } from '../data/mock-broadcast-logs';

@Injectable({
  providedIn: 'root',
})
export class BroadcastLogService {
  // In-memory store backed by mock data. When a real backend is available,
  // each method body becomes an HttpClient call to the API.
  private logs: BroadcastLog[] = [...MOCK_BROADCAST_LOGS];

  getLogs(): Observable<BroadcastLog[]> {
    // Return sorted newest-first so the store receives pre-sorted data.
    const sorted = [...this.logs].sort(
      (a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime()
    );
    return of(sorted).pipe(delay(400));
  }

  addLog(log: BroadcastLog): Observable<BroadcastLog> {
    this.logs.unshift(log); // Insert at top so it's always newest-first
    return of(log).pipe(delay(300));
  }
}
