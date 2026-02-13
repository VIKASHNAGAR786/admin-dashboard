import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardStatsComponent } from '../dashboard-stats/dashboard-stats.component';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { KeyGeneratorComponent } from '../key-generator/key-generator.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Client, GeneratedKey } from '../../../models/types';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatsComponent,
    ClientsTableComponent,
    KeyGeneratorComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  generatedKeys: GeneratedKey[] = [];
  activeTab: 'clients' | 'keys' = 'clients';
  sidebarOpen = true;

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to clients
    this.dataService.clients$
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients) => {
        this.clients = clients;
      });

    // Subscribe to generated keys
    this.dataService.generatedKeys$
      .pipe(takeUntil(this.destroy$))
      .subscribe((keys) => {
        this.generatedKeys = keys;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleGenerateKey(keyData: Omit<GeneratedKey, 'id' | 'generatedAt'>): void {
    this.dataService.addGeneratedKey(keyData).subscribe({
      next: (generatedKey) => {
        console.log('Key generated successfully:', generatedKey);
      },
      error: (error) => {
        console.error('Error generating key:', error);
        alert('Failed to generate key. Please try again.');
      }
    });
  }

  handleLogout(): void {
    localStorage.removeItem('isAdminAuthenticated');
    this.router.navigate(['/logout']);
  }

  handleToggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
