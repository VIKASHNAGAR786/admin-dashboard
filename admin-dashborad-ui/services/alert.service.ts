import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();
  private alertIdCounter = 0;

  constructor() {}

  private addAlert(type: 'error' | 'success' | 'warning' | 'info', message: string, duration: number = 5000): string {
    const id = `alert-${++this.alertIdCounter}`;
    const alert: Alert = {
      id,
      type,
      message,
      duration
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);

    // Auto-remove alert after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeAlert(id);
      }, duration);
    }

    return id;
  }

  success(message: string, duration: number = 5000): string {
    console.log('✅ Success:', message);
    return this.addAlert('success', message, duration);
  }

  error(message: string, duration: number = 5000): string {
    console.error('❌ Error:', message);
    return this.addAlert('error', message, duration);
  }

  warning(message: string, duration: number = 5000): string {
    console.warn('⚠️ Warning:', message);
    return this.addAlert('warning', message, duration);
  }

  info(message: string, duration: number = 5000): string {
    console.info('ℹ️ Info:', message);
    return this.addAlert('info', message, duration);
  }

  removeAlert(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next(currentAlerts.filter(a => a.id !== id));
  }

  clearAll(): void {
    this.alertsSubject.next([]);
  }

  getAll(): Alert[] {
    return this.alertsSubject.value;
  }
}
