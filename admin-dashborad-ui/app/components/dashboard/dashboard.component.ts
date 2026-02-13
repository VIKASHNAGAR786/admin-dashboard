import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardStatsComponent } from '../dashboard-stats/dashboard-stats.component';
import { KeyGeneratorComponent } from '../key-generator/key-generator.component';
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
    KeyGeneratorComponent,
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

  handleGenerateKey(keyData: any): void {
    // Extract clientId from the emitted data
    const { clientId, ...displayData } = keyData;
    const expirationDate = keyData.expirationDate; // Already in YYYY-MM-DD format
    
    // Prepare request for backend
    const backendRequest = {
      clientId,
      modules: keyData.modules,
      expirationDate: expirationDate
    };

    console.log('Generating key with clientId:', clientId);
    console.log('Backend request:', backendRequest);

    this.dataService.addGeneratedKey(backendRequest).subscribe({
      next: (response: any) => {
        if (response.alreadyExists) {
          // Key already exists
          const expiryDate = new Date(response.existingKey.expirationDate).toLocaleDateString();
          this.alertService.warning(
            `Client already has an active key that expires on ${expiryDate}. No new key was generated.`,
            7000
          );
          console.log('Existing key found for client:', response.existingKey);
        } else {
          // New key generated successfully
          this.alertService.success('Access key generated successfully!');
          console.log('Key generated successfully:', response);
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error generating key:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to generate key';
        this.alertService.error(`Error: ${errorMessage}`);
        this.cdr.markForCheck();
      }
    });
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
}
