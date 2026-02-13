import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client, GeneratedKey } from '../../../models/types';
import { DataService } from '../../../services/data.service';
import { ClientDetailsDialogComponent } from '../client-details-dialog/client-details-dialog.component';
import { ClientFormDialogComponent } from '../client-form-dialog/client-form-dialog.component';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, ClientDetailsDialogComponent, ClientFormDialogComponent],
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.css']
})
export class ClientsTableComponent {
  @Input() clients: Client[] = [];
  @Input() generatedKeys: GeneratedKey[] = [];
  @Output() onCreateClient = new EventEmitter<any>();

  selectedClient: Client | null = null;
  isDialogOpen: boolean = false;
  isFormDialogOpen: boolean = false;
  copiedKeyId: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

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
    console.log('=== openDialog CALLED ===');
    console.log('Client:', client);
    console.log('Before: isDialogOpen =', this.isDialogOpen);
    this.selectedClient = client;
    this.isDialogOpen = true;
    console.log('After: isDialogOpen =', this.isDialogOpen);
    this.cdr.markForCheck();
    setTimeout(() => {
      console.log('After timeout: isDialogOpen =', this.isDialogOpen);
    }, 100);
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedClient = null;
    this.cdr.markForCheck();
  }

  openFormDialog(): void {
    console.log('=== openFormDialog CALLED ===');
    console.log('Before: isFormDialogOpen =', this.isFormDialogOpen);
    this.isFormDialogOpen = true;
    console.log('After: isFormDialogOpen =', this.isFormDialogOpen);
    this.cdr.markForCheck();
    setTimeout(() => {
      console.log('After timeout: isFormDialogOpen =', this.isFormDialogOpen);
    }, 100);
  }

  closeFormDialog(): void {
    console.log('Closing form dialog');
    this.isFormDialogOpen = false;
    this.cdr.markForCheck();
  }

  handleCreateClient(clientData: any): void {
    console.log('Creating client with data:', clientData);
    this.onCreateClient.emit(clientData);
    this.closeFormDialog();
  }

  getActiveAccessKey(clientId: string): string | null {
    const key = this.generatedKeys.find((k) => k.clientId === clientId && k.active === 'active');
    return key?.accessKey || key?.key || null;
  }

  copyAccessKey(clientId: string, event: Event): void {
    event.stopPropagation();
    const accessKey = this.getActiveAccessKey(clientId);
    if (accessKey) {
      navigator.clipboard.writeText(accessKey).then(() => {
        this.copiedKeyId = clientId;
        setTimeout(() => {
          this.copiedKeyId = null;
          this.cdr.markForCheck();
        }, 2000);
        this.cdr.markForCheck();
      });
    }
  }
}
