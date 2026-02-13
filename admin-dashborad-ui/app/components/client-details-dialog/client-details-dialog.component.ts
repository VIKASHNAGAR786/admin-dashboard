import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/types';

@Component({
  selector: 'app-client-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-details-dialog.component.html',
  styleUrls: ['./client-details-dialog.component.css']
})
export class ClientDetailsDialogComponent implements OnChanges {
  @Input() client: Client | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      console.log('Client details dialog isOpen changed to:', this.isOpen);
      this.cdr.markForCheck();
    }
    if (changes['client']) {
      console.log('Client details dialog client changed to:', this.client);
      this.cdr.markForCheck();
    }
  }

  closeDialog(): void {
    console.log('Closing client details dialog');
    this.closeEvent.emit();
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
