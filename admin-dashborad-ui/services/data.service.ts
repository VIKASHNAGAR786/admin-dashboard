import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, GeneratedKey } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private clientsSubject = new BehaviorSubject<Client[]>([
    {
      id: '1',
      companyName: 'TechCorp Solutions',
      plan: 'Enterprise',
      startDate: '2025-06-15',
      expirationDate: '2026-06-15',
      accessKey: 'ENT-TECH-2025-A3F9K2',
      status: 'Active',
      modules: ['Pharmacy', 'Sales', 'Electronics', 'Inventory'],
      email: 'contact@techcorp.com',
      contactNumber: '+1 (555) 123-4567',
      contactPerson: 'John Smith',
      address: '123 Tech Street, Silicon Valley, CA 94025',
    },
    {
      id: '2',
      companyName: 'Digital Ventures',
      plan: 'Pro',
      startDate: '2025-08-20',
      expirationDate: '2026-02-20',
      accessKey: 'PRO-DIGI-2025-B7H4M1',
      status: 'Expiring Soon',
      modules: ['Sales', 'Electronics'],
      email: 'info@digitalventures.com',
      contactNumber: '+1 (555) 234-5678',
      contactPerson: 'Sarah Johnson',
      address: '456 Digital Ave, New York, NY 10001',
    },
    {
      id: '3',
      companyName: 'StartUp Inc',
      plan: 'Basic',
      startDate: '2025-09-10',
      expirationDate: '2025-12-10',
      accessKey: 'BAS-STAR-2025-C2J6N8',
      status: 'Expired',
      modules: ['Sales'],
      email: 'hello@startup.com',
      contactNumber: '+1 (555) 345-6789',
      contactPerson: 'Mike Chen',
      address: '789 Startup Blvd, Austin, TX 78701',
    },
    {
      id: '4',
      companyName: 'Global Systems',
      plan: 'Enterprise',
      startDate: '2025-07-01',
      expirationDate: '2026-07-01',
      accessKey: 'ENT-GLOB-2025-D5K9P4',
      status: 'Active',
      modules: ['Pharmacy', 'Sales', 'Electronics', 'Inventory', 'HR Management'],
      email: 'contact@globalsystems.com',
      contactNumber: '+1 (555) 456-7890',
      contactPerson: 'Emily Davis',
      address: '321 Global Plaza, Chicago, IL 60601',
    },
    {
      id: '5',
      companyName: 'Innovation Labs',
      plan: 'Pro',
      startDate: '2025-10-15',
      expirationDate: '2026-04-15',
      accessKey: 'PRO-INNO-2025-E8L3Q7',
      status: 'Active',
      modules: ['Sales', 'Inventory', 'CRM'],
      email: 'team@innovationlabs.com',
      contactNumber: '+1 (555) 567-8901',
      contactPerson: 'David Lee',
      address: '555 Innovation Drive, Seattle, WA 98101',
    },
  ]);

  private generatedKeysSubject = new BehaviorSubject<GeneratedKey[]>([
    {
      id: '1',
      key: 'ENT-TECH-2025-A3F9K2',
      companyName: 'TechCorp Solutions',
      plan: 'Enterprise',
      expirationDate: '2026-06-15',
      generatedAt: '2025-06-15T10:30:00',
      modules: ['Pharmacy', 'Sales', 'Electronics', 'Inventory'],
      email: 'contact@techcorp.com',
      contactNumber: '+1 (555) 123-4567',
      contactPerson: 'John Smith',
      address: '123 Tech Street, Silicon Valley, CA 94025',
    },
  ]);

  public clients$: Observable<Client[]> = this.clientsSubject.asObservable();
  public generatedKeys$: Observable<GeneratedKey[]> = this.generatedKeysSubject.asObservable();

  constructor() {}

  getClients(): Client[] {
    return this.clientsSubject.value;
  }

  getGeneratedKeys(): GeneratedKey[] {
    return this.generatedKeysSubject.value;
  }

  addGeneratedKey(keyData: Omit<GeneratedKey, 'id' | 'generatedAt'>): void {
    const newKey: GeneratedKey = {
      ...keyData,
      id: Date.now().toString(),
      generatedAt: new Date().toISOString(),
    };
    const currentKeys = this.generatedKeysSubject.value;
    this.generatedKeysSubject.next([newKey, ...currentKeys]);
  }
}
