import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { AlertNotificationComponent } from '../alert-notification/alert-notification.component';
import { Client, GeneratedKey } from '../../../models/types';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ClientsTableComponent,
    AlertNotificationComponent
  ],
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsPageComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  generatedKeys: GeneratedKey[] = [];
  sidebarOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.loadClients();
    this.dataService.loadGeneratedKeys();

    this.dataService.clients$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients) => {
        this.clients = clients;
        this.cdr.markForCheck();
      });

    this.dataService.generatedKeys$
      .pipe(takeUntil(this.destroy$))
      .subscribe((keys) => {
        this.generatedKeys = keys;
        this.cdr.markForCheck();
      });
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
