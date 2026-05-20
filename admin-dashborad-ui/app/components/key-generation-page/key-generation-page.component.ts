import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KeyGeneratorComponent } from '../key-generator/key-generator.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Client, GeneratedKey } from '../../../models/types';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/alert.service';
import { AlertNotificationComponent } from '../alert-notification/alert-notification.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-key-generation-page',
  standalone: true,
  imports: [CommonModule, KeyGeneratorComponent, SidebarComponent, AlertNotificationComponent],
  templateUrl: './key-generation-page.component.html',
  styleUrls: ['./key-generation-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyGenerationPageComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  generatedKeys: GeneratedKey[] = [];
  sidebarOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.loadClients();
    this.dataService.loadGeneratedKeys();

    this.dataService.clients$
      .pipe(takeUntil(this.destroy$))
      .subscribe(clients => {
        this.clients = clients;
        this.cdr.markForCheck();
      });

    this.dataService.generatedKeys$
      .pipe(takeUntil(this.destroy$))
      .subscribe(keys => {
        this.generatedKeys = keys;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleToggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.markForCheck();
  }

  handleLogout(): void {
    localStorage.removeItem('isAdminAuthenticated');
    this.router.navigate(['/logout']);
  }

  handleGenerateKey(keyData: any): void {
    const { clientId, ...displayData } = keyData;
    const backendRequest = {
      clientId,
      modules: keyData.modules,
      expirationDate: keyData.expirationDate
    };

    this.dataService.addGeneratedKey(backendRequest).subscribe({
      next: (response: any) => {
        if (response.alreadyExists) {
          const expiryDate = new Date(response.existingKey.expirationDate).toLocaleDateString();
          this.alertService.warning(`Client already has an active key expiring on ${expiryDate}.`);
        } else {
          this.alertService.success('Access key generated successfully!');
          this.dataService.loadGeneratedKeys(); // Refresh list
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.alertService.error(error.error?.message || 'Failed to generate key');
        this.cdr.markForCheck();
      }
    });
  }
}
