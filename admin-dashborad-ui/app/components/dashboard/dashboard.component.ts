import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardStatsComponent } from '../dashboard-stats/dashboard-stats.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Client, GeneratedKey } from '../../../models/types';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatsComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
   generatedKeys: GeneratedKey[] = [];
  stats: any = {};
  sidebarOpen = false;

  activeClients: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load data when component initializes (after user is logged in)
    this.dataService.loadClients();
    this.dataService.loadGeneratedKeys();
    
    // Fetch dashboard statistics
    this.dataService.getClientStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          console.log('Dashboard stats loaded:', stats);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading stats:', error);
          this.alertService.error('Failed to load dashboard statistics');
          this.cdr.markForCheck();
        }
      });

      // active clients
    this.dataService.getActiveClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeClients) => {
        this.generatedKeys = activeClients;
        this.cdr.markForCheck();
      });

    // Subscribe to clients
    this.dataService.clients$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients) => {
        this.clients = clients;
        this.cdr.markForCheck();
      });

    // Subscribe to generated keys
    // this.dataService.generatedKeys$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((keys) => {
    //     this.generatedKeys = keys;
    //     this.cdr.markForCheck();
    //   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleCreateClient(clientData: any): void {
    console.log('Creating client:', clientData);
    
    this.dataService.createClient(clientData).subscribe({
      next: (newClient) => {
        console.log('Client created successfully:', newClient);
        this.alertService.success('Client created successfully!');
        // Reload clients to get the updated list
        this.dataService.loadClients();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error creating client:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to create client';
        this.alertService.error(`Error: ${errorMessage}`);
        this.cdr.markForCheck();
      }
    });
  }

  handleLogout(): void {
    localStorage.removeItem('isAdminAuthenticated');
    this.router.navigate(['/logout']);
  }

  handleToggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.markForCheck();
  }

  getPlanName(plan: any): string {
    if (typeof plan === 'string') return plan;
    if (Array.isArray(plan)) {
      if (plan.length === 0) return 'No Modules';
      const names = plan.map(p => p.label || p.name || 'Module');
      if (names.length > 3) {
        return names.slice(0, 3).join(', ') + ` +${names.length - 3} more`;
      }
      return names.join(', ');
    }
    if (plan && typeof plan === 'object') {
      return plan.name || plan.label || 'Standard Plan';
    }
    return 'Basic';
  }
}
