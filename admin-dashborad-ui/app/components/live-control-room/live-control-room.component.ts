import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/alert.service';
import { AlertNotificationComponent } from '../alert-notification/alert-notification.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-control-room',
  standalone: true,
  imports: [CommonModule, SidebarComponent, AlertNotificationComponent],
  templateUrl: './live-control-room.component.html',
  styleUrls: ['./live-control-room.component.css']
})
export class LiveControlRoomComponent implements OnInit, OnDestroy {
  liveLogs: any[] = [];
  isLoading = true;
  lastUpdated: Date = new Date();
  sidebarOpen = false;
  private refreshSubscription?: Subscription;

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => {
          this.isLoading = true;
          return this.dataService.getLiveLogs();
        })
      )
      .subscribe({
        next: (data) => {
          this.liveLogs = data;
          this.isLoading = false;
          this.lastUpdated = new Date();
        },
        error: (err) => {
          this.alertService.error('Failed to sync with Live Control Room');
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  refreshNow(): void {
    this.isLoading = true;
    this.dataService.getLiveLogs().subscribe({
      next: (data) => {
        this.liveLogs = data;
        this.isLoading = false;
        this.lastUpdated = new Date();
        this.alertService.success('Live logs updated');
      },
      error: () => {
        this.isLoading = false;
        this.alertService.error('Refresh failed');
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'active' || s === 'valid') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'blocked' || s === 'denied') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  handleToggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.markForCheck();
  }

  handleLogout(): void {
    localStorage.removeItem('isAdminAuthenticated');
    this.router.navigate(['/logout']);
  }
}
