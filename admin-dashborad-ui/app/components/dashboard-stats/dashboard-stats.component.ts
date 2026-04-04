import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client, GeneratedKey } from '../../../models/types';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.css']
})
export class DashboardStatsComponent {
  @Input() clients: Client[] = [];
  @Input() generatedKeys: GeneratedKey[] = [];
  @Input() apiStats: any = {};

  getTotalClients(): number {
    return this.apiStats.total || 0;
  }

  getActiveKeys(): number {
    return this.apiStats.active || 0;
  }

  getActiveClients(): number {
   return this.apiStats.active || 0;
  }

  getExpiringClients(): number {
    return this.apiStats.expiring || 0;
  }

  getClientNameById(clientId: string): string {
    const client = this.clients.find((c) => c.id === clientId);
    return client?.companyName || 'Unknown';
  }

  getLiveSubscriptions(): Array<{
    clientId: string;
    clientName: string;
    plan: string;
    expirationDate: string;
    daysRemaining: number;
    status: string;
  }> {
    return this.generatedKeys
      .map((key) => {
        return {
          clientId: key.clientId,
          clientName: key.clientName,
          plan: key.plan,
          expirationDate: key.expirationDate,
          daysRemaining: key.daysRemaining > 0 ? key.daysRemaining : 0,
          status: key.status || 'unknown',
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  getExpiringKeysDetails(): Array<{
    clientId: string;
    clientName: string;
    plan: string;
    expirationDate: string;
    daysRemaining: number;
  }> {
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.generatedKeys
      .filter((k) => {
        if (k.status !== 'active') return false;
        const expiryDate = new Date(k.expirationDate);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
      })
      .map((key) => {
        const expiryDate = new Date(key.expirationDate);
        const daysRemaining = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          clientId: key.clientId,
          clientName: this.getClientNameById(key.clientId),
          plan: key.plan,
          expirationDate: key.expirationDate,
          daysRemaining,
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
