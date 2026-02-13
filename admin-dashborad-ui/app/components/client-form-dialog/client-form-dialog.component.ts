import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-client-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-form-dialog.component.html',
  styleUrls: ['./client-form-dialog.component.css']
})
export class ClientFormDialogComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<any>();

  formData = {
    companyName: '',
    email: '',
    contactPerson: '',
    contactNumber: '',
    address: ''
  };

  constructor(
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      console.log('Form dialog isOpen changed to:', this.isOpen);
      this.cdr.markForCheck();
    }
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  closeDialog(): void {
    console.log('Closing form dialog');
    this.resetForm();
    this.closeEvent.emit();
  }

  resetForm(): void {
    this.formData = {
      companyName: '',
      email: '',
      contactPerson: '',
      contactNumber: '',
      address: ''
    };
  }

  handleSubmit(): void {
    // Validate required fields
    if (!this.formData.companyName.trim()) {
      this.alertService.warning('Company Name is required');
      return;
    }

    if (!this.formData.email.trim()) {
      this.alertService.warning('Email is required');
      return;
    }

    if (!this.formData.contactPerson.trim()) {
      this.alertService.warning('Contact Person is required');
      return;
    }

    if (!this.formData.contactNumber.trim()) {
      this.alertService.warning('Contact Number is required');
      return;
    }

    // Emit the form data with defaults
    console.log('Submitting client form:', this.formData);
    this.submitEvent.emit({
      ...this.formData,
      status: 'Active' // Default status
    });
    this.resetForm();
  }
}
