import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/types';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.css']
})
export class DashboardStatsComponent {
  @Input() clients: Client[] = [];

  getTotalClients(): number {
    return this.clients.length;
  }

  getActiveClients(): number {
    return this.clients.filter((c) => c.status === 'Active').length;
  }

  getExpiringClients(): number {
    return this.clients.filter((c) => c.status === 'Expiring Soon').length;
  }

  getPlanBreakdown(): Record<string, number> {
    return this.clients.reduce(
      (acc, client) => {
        acc[client.plan] = (acc[client.plan] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }
}
