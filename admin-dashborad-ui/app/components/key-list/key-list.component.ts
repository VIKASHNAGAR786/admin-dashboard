import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneratedKey } from '../../../models/types';
import { format, parseISO } from 'date-fns';
import { AlertService } from '../../../services/alert.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-key-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'key-list.component.html',
  styleUrls: ['key-list.component.css']
})
export class KeyListComponent {
  @Input() generatedKeys: GeneratedKey[] = [];
  @Output() onEditKey = new EventEmitter<GeneratedKey>();

  copiedKey: string | null = null;
  selectedKeyDetails: any = null;
  searchQuery: string = '';

  constructor(
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  getFilteredKeys(): GeneratedKey[] {
    if (!this.searchQuery) {
      return this.generatedKeys;
    }
    const query = this.searchQuery.toLowerCase();
    return this.generatedKeys.filter(k =>
      (k.clientName && k.clientName.toLowerCase().includes(query)) ||
      (k.email && k.email.toLowerCase().includes(query)) ||
      (k.contactPerson && k.contactPerson.toLowerCase().includes(query)) ||
      (k.plan && k.plan.toLowerCase().includes(query))
    );
  }

  getPlanName(plan: string | undefined): string {
    return plan || 'Basic';
  }

  handleCopyKey(key: string): void {
    navigator.clipboard.writeText(key).then(() => {
      this.copiedKey = key;
      setTimeout(() => (this.copiedKey = null), 2000);
      this.alertService.success('Access key copied to clipboard!');
    });
  }

  viewKeyDetails(key: string): void {
    if (this.selectedKeyDetails && this.selectedKeyDetails.rawKey === key) {
      this.selectedKeyDetails = null;
      return;
    }

    try {
      // Decode Base64 JSON payload
      const payload = JSON.parse(atob(key));
      this.selectedKeyDetails = { ...payload, rawKey: key };
      this.alertService.success('Key decrypted successfully!');
    } catch (e) {
      console.error('Decryption failed:', e);
      this.alertService.error('This key is not in a decodable format');
    }
  }

  formatDate(dateString: string): string {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  }

  formatDateTime(dateString: string): string {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  }

  getRemainingDays(expirationDate: string): number {
    try {
      const expDate = parseISO(expirationDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  }

  getExpirationStatus(expirationDate: string): 'expired' | 'expiring-soon' | 'active' {
    const days = this.getRemainingDays(expirationDate);
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring-soon';
    return 'active';
  }

  getExpirationStatusClass(expirationDate: string): string {
    const status = this.getExpirationStatus(expirationDate);
    if (status === 'expired') return 'text-red-600 font-bold';
    if (status === 'expiring-soon') return 'text-amber-600 font-bold';
    return 'text-green-600 font-bold';
  }

  getExpirationText(expirationDate: string): string {
    const days = this.getRemainingDays(expirationDate);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires Today';
    if (days === 1) return 'Expires Tomorrow';
    return `${days} days remaining`;
  }

  handleQuickRenew(keyData: GeneratedKey, event: Event): void {
    event.stopPropagation();
    if (!keyData.id) {
      this.alertService.error('Cannot renew: key record ID is missing');
      return;
    }

    if (!confirm(`Are you sure you want to renew the key for ${keyData.clientName} by 1 year? This will revoke the current active key.`)) {
      return;
    }

    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const dateString = oneYearLater.toISOString().split('T')[0];

    this.dataService.renewKey(keyData.id, dateString).subscribe({
      next: (res) => {
        this.alertService.success('Key renewed successfully for 1 year!');
        this.dataService.loadGeneratedKeys();
      },
      error: (err) => {
        this.alertService.error(err.error?.message || 'Failed to renew key');
      }
    });
  }

  handleCloneAndEdit(keyData: GeneratedKey, event: Event): void {
    event.stopPropagation();
    this.onEditKey.emit(keyData);
  }
}
