import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneratedKey, Client } from '../../../models/types';
import { format, parseISO } from 'date-fns';
import { AlertService } from '../../../services/alert.service';

const AVAILABLE_MODULES = [
  'Pharmacy',
  'Sales',
  'Electronics',
  'Inventory',
  'HR Management',
  'CRM',
  'Accounting',
  'Reports',
  'Analytics',
];

@Component({
  selector: 'app-key-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './key-generator.component.html',
  styleUrls: ['./key-generator.component.css']
})
export class KeyGeneratorComponent {
  @Input() generatedKeys: GeneratedKey[] = [];
  @Input() clients: Client[] = [];
  @Output() onGenerateKey = new EventEmitter<Omit<GeneratedKey, 'id' | 'generatedAt'>>();

  AVAILABLE_MODULES = AVAILABLE_MODULES;

  selectedClientId: string = '';
  plan: string = '';
  expirationDate: string = '';
  selectedModulesMap: { [key: string]: boolean } = {};
  copiedKey: string | null = null;

  constructor(private alertService: AlertService) {
    AVAILABLE_MODULES.forEach(module => {
      this.selectedModulesMap[module] = false;
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  generateRandomKey(plan: string, company: string): string {
    const planPrefix = plan.substring(0, 3).toUpperCase();
    const companyPrefix = (company || 'UNKNOWN')
      .substring(0, 4)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X');
    const year = new Date().getFullYear();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${planPrefix}-${companyPrefix}-${year}-${randomString}`;
  }

  getSelectedClient(): Client | undefined {
    return this.clients.find(c => c.id === this.selectedClientId);
  }

  getClientDisplayName(client: Client | undefined): string {
    return client?.companyName || 'Unknown Client';
  }

  handleGenerate(): void {
    const selectedModules = AVAILABLE_MODULES.filter(m => this.selectedModulesMap[m]);
    const selectedClient = this.getSelectedClient();
    const displayName = this.getClientDisplayName(selectedClient);

    if (!this.selectedClientId) {
      this.alertService.warning('Please select a client');
      return;
    }

    if (!this.plan || !this.expirationDate) {
      this.alertService.warning('Please fill in all required fields');
      return;
    }

    if (selectedModules.length === 0) {
      this.alertService.warning('Please select at least one module');
      return;
    }

    const key = this.generateRandomKey(this.plan, displayName);

    // Emit both the key data and the clientId
    this.onGenerateKey.emit({
      key,
      clientId: this.selectedClientId,
      companyName: displayName,
      plan: this.plan,
      expirationDate: this.expirationDate,
      modules: selectedModules,
      email: selectedClient?.email || '',
      contactNumber: selectedClient?.contactNumber || '',
      contactPerson: selectedClient?.contactPerson || '',
      address: selectedClient?.address || '',
    } as any);

    // Reset form
    this.resetForm();
  }

  resetForm(): void {
    this.selectedClientId = '';
    this.plan = '';
    this.expirationDate = '';
    AVAILABLE_MODULES.forEach(module => {
      this.selectedModulesMap[module] = false;
    });
  }

  handleCopyKey(key: string): void {
    navigator.clipboard.writeText(key).then(() => {
      this.copiedKey = key;
      setTimeout(() => (this.copiedKey = null), 2000);
    });
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

  formatTimeAgo(dateString: string): string {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);
      
      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return format(date, 'MMM dd');
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
}

            
             
