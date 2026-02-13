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

  getTotalClients(): number {
    return this.clients.length;
  }

  getActiveKeys(): number {
    return this.generatedKeys.filter((k) => k.active === 'active').length;
  }

  getActiveClients(): number {
    const activeKeyClientIds = new Set(
      this.generatedKeys
        .filter((k) => k.active === 'active')
        .map((k) => k.clientId)
    );
    return this.clients.filter((c) => activeKeyClientIds.has(c.id)).length;
  }

  getExpiringClients(): number {
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.generatedKeys.filter((k) => {
      if (k.active !== 'active') return false;
      const expiryDate = new Date(k.expirationDate);
      return expiryDate >= today && expiryDate <= sevenDaysLater;
    }).length;
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
      .filter((k) => k.active === 'active')
      .map((key) => {
        const today = new Date();
        const expiryDate = new Date(key.expirationDate);
        const daysRemaining = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          clientId: key.clientId,
          clientName: this.getClientNameById(key.clientId),
          plan: key.plan,
          expirationDate: key.expirationDate,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          status: daysRemaining > 0 ? 'Active' : 'Expired',
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
        if (k.active !== 'active') return false;
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
