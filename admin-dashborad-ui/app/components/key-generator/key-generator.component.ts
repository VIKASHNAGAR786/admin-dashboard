import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneratedKey } from '../../../models/types';
import { format, parseISO } from 'date-fns';

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
  @Output() onGenerateKey = new EventEmitter<Omit<GeneratedKey, 'id' | 'generatedAt'>>();

  AVAILABLE_MODULES = AVAILABLE_MODULES;

  companyName: string = '';
  plan: string = '';
  expirationDate: string = '';
  selectedModulesMap: { [key: string]: boolean } = {};
  email: string = '';
  contactNumber: string = '';
  contactPerson: string = '';
  address: string = '';
  copiedKey: string | null = null;

  constructor() {
    AVAILABLE_MODULES.forEach(module => {
      this.selectedModulesMap[module] = false;
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  generateRandomKey(plan: string, company: string): string {
    const planPrefix = plan.substring(0, 3).toUpperCase();
    const companyPrefix = company
      .substring(0, 4)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X');
    const year = new Date().getFullYear();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${planPrefix}-${companyPrefix}-${year}-${randomString}`;
  }

  handleGenerate(): void {
    const selectedModules = AVAILABLE_MODULES.filter(m => this.selectedModulesMap[m]);

    if (!this.companyName || !this.plan || !this.expirationDate || !this.email || !this.contactNumber || !this.contactPerson) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedModules.length === 0) {
      alert('Please select at least one module');
      return;
    }

    const key = this.generateRandomKey(this.plan, this.companyName);

    this.onGenerateKey.emit({
      key,
      companyName: this.companyName,
      plan: this.plan,
      expirationDate: this.expirationDate,
      modules: selectedModules,
      email: this.email,
      contactNumber: this.contactNumber,
      contactPerson: this.contactPerson,
      address: this.address,
    });

    // Reset form
    this.resetForm();
  }

  resetForm(): void {
    this.companyName = '';
    this.plan = '';
    this.expirationDate = '';
    this.email = '';
    this.contactNumber = '';
    this.contactPerson = '';
    this.address = '';
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
}

            
             
