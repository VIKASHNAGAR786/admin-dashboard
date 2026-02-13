import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/types';
import { differenceInDays, format, parseISO } from 'date-fns';
import { ClientDetailsDialogComponent } from '../client-details-dialog/client-details-dialog.component';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, ClientDetailsDialogComponent],
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.css']
})
export class ClientsTableComponent {
  @Input() clients: Client[] = [];

  selectedClient: Client | null = null;
  isDialogOpen: boolean = false;

  formatDate(dateString: string): string {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  }

  calculateRemainingDays(expirationDate: string): number {
    try {
      const expDate = parseISO(expirationDate);
      const today = new Date();
      return differenceInDays(expDate, today);
    } catch {
      return 0;
    }
  }

  getDaysText(expirationDate: string): string {
    const days = this.calculateRemainingDays(expirationDate);
    return days < 0 ? 'Expired' : `${days} days`;
  }

  getRemainingDaysClass(expirationDate: string): string {
    const days = this.calculateRemainingDays(expirationDate);
    if (days < 0) return 'text-red-600 font-medium';
    if (days < 30) return 'text-amber-600 font-medium';
    return 'text-green-600 font-medium';
  }

  getPlanBadgeClass(plan: string): string {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    const planClass = {
      'Basic': 'bg-blue-100 text-blue-800',
      'Pro': 'bg-purple-100 text-purple-800',
      'Enterprise': 'bg-orange-100 text-orange-800',
    }[plan] || 'bg-gray-100 text-gray-800';
    return `${baseClass} ${planClass}`;
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    const statusClass = {
      'Active': 'bg-green-100 text-green-800',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';
    return `${baseClass} ${statusClass}`;
  }

  openDialog(client: Client): void {
    this.selectedClient = client;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedClient = null;
  }
}
