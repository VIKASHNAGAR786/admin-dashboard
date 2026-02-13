import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/types';
import { formatDate, parseISO } from 'date-fns';

@Component({
  selector: 'app-client-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details-dialog.component.html',
  styleUrls: ['./client-details-dialog.component.css']
})
export class ClientDetailsDialogComponent {
  @Input() client: Client | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  formatDate(dateString: string): string {
    try {
      const date = parseISO(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  closeDialog(): void {
    this.closeEvent.emit();
  }

  getPlanBadgeClass(): string {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    const planClass: { [key: string]: string } = {
      'Basic': 'bg-blue-100 text-blue-800',
      'Pro': 'bg-purple-100 text-purple-800',
      'Enterprise': 'bg-orange-100 text-orange-800',
    };
    const plan = this.client?.plan || '';
    const planSpecificClass = planClass[plan] || 'bg-gray-100 text-gray-800';
    return `${baseClass} ${planSpecificClass}`;
  }

  getStatusBadgeClass(): string {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    const statusClass: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800',
    };
    const status = this.client?.status || '';
    const statusSpecificClass = statusClass[status] || 'bg-gray-100 text-gray-800';
    return `${baseClass} ${statusSpecificClass}`;
  }
}
