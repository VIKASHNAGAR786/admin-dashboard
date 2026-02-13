import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientsPageComponent } from './components/clients-page/clients-page.component';
import { LogoutPageComponent } from './components/logout-page/logout-page.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    component: ClientsPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    component: LogoutPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
