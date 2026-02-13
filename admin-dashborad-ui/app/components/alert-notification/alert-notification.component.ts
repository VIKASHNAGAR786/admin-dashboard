import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../../services/alert.service';

@Component({
  selector: 'app-alert-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.css']
})
export class AlertNotificationComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  removeAlert(id: string): void {
    this.alertService.removeAlert(id);
  }

  getAlertIcon(type: string): string {
    const icons = {
      'success': '✓',
      'error': '✕',
      'warning': '⚠',
      'info': 'ℹ'
    };
    return icons[type as keyof typeof icons] || '•';
  }

  getAlertClass(type: string): string {
    const classes = {
      'success': 'alert-success',
      'error': 'alert-error',
      'warning': 'alert-warning',
      'info': 'alert-info'
    };
    return classes[type as keyof typeof classes] || 'alert-info';
  }
}
