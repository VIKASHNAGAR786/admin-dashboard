# Frontend-Backend Integration Guide

This guide explains how to connect your Angular frontend to the NestJS backend API.

---

## Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [API Service Setup](#api-service-setup)
3. [HTTP Client Configuration](#http-client-configuration)
4. [Authentication Integration](#authentication-integration)
5. [Component Integration Examples](#component-integration-examples)
6. [Testing Integration](#testing-integration)
7. [Troubleshooting](#troubleshooting)

---

## Environment Configuration

### Step 1: Update Environment Files

**File:** `environment.ts` (Development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000 // 30 seconds
};
```

**File:** `environment.prod.ts` (Production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api', // Update with your production URL
  apiTimeout: 30000
};
```

---

## API Service Setup

### Step 2: Create API Service

Create a new service file: `src/app/services/api.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  
  // Observable for authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  /**
   * Check if user has valid token
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Check token validity on service initialization
   */
  private checkTokenValidity(): void {
    if (this.hasToken()) {
      this.http.get<any>(`${this.apiUrl}/auth/profile`, {
        headers: this.getAuthHeaders()
      }).pipe(
        retry(1),
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Token invalid'));
        })
      ).subscribe();
    }
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // ============ AUTH ENDPOINTS ============

  /**
   * Register new user
   */
  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.id) {
          // User created successfully
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Login user
   */
  login(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/auth/profile`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    const result = this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );

    // Clear local storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);

    return result;
  }

  // ============ CLIENTS ENDPOINTS ============

  /**
   * Get all clients with pagination
   */
  getClients(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(
      `${this.apiUrl}/clients`,
      {
        headers: this.getAuthHeaders(),
        params: params
      }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get single client by ID
   */
  getClient(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/clients/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Create new client
   */
  createClient(clientData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/clients`,
      clientData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        // Client created successfully
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Update client
   */
  updateClient(id: string, clientData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/clients/${id}`,
      clientData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Delete client
   */
  deleteClient(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/clients/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get client statistics
   */
  getClientStats(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/clients/stats`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  // ============ ACCESS KEYS ENDPOINTS ============

  /**
   * Generate new access key
   */
  generateAccessKey(keyData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/access-keys`,
      keyData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        // Key generated successfully
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get all access keys
   */
  getAccessKeys(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(
      `${this.apiUrl}/access-keys`,
      {
        headers: this.getAuthHeaders(),
        params: params
      }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get keys for specific client
   */
  getClientAccessKeys(clientId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/access-keys/client/${clientId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Validate access key (public endpoint)
   */
  validateAccessKey(key: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/access-keys/validate/${key}`
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Revoke access key
   */
  revokeAccessKey(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/access-keys/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ============ DASHBOARD ENDPOINTS ============

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard/stats`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get dashboard summary
   */
  getDashboardSummary(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard/summary`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get recent activity
   */
  getRecentActivity(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard/activity`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      retry(1),
      catchError(error => this.handleError(error))
    );
  }

  // ============ ERROR HANDLING ============

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        // Unauthorized - clear auth
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.isAuthenticatedSubject.next(false);
        errorMessage = 'Session expired. Please login again.';
      } else if (error.status === 400) {
        errorMessage = error.error.message || 'Invalid request';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Server returned code: ${error.status}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // ============ HELPER METHODS ============

  /**
   * Get stored user info
   */
  getStoredUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
```

---

## HTTP Client Configuration

### Step 3: Add HttpClientModule to App Config

**File:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
};
```

OR if using `main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(HttpClientModule)
  ]
});
```

---

## Authentication Integration

### Step 4: Update Login Page Component

**File:** `src/app/components/login-page/login-page.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.apiService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Login successful', response.user);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Step 5: Create Auth Guard

**File:** `src/app/guards/auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.apiService.isAuthenticated()) {
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
```

### Step 6: Update Routes

**File:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
```

---

## Component Integration Examples

### Example 1: Dashboard Component

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: any = null;
  clients: any[] = [];
  isLoading = false;
  
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadClients();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.apiService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading stats:', error);
          this.isLoading = false;
        }
      });
  }

  loadClients(): void {
    this.apiService.getClients(1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.clients = data.data;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Example 2: Clients Table Component

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.css']
})
export class ClientsTableComponent implements OnInit, OnDestroy {
  clients: any[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.apiService.getClients(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.clients = data.data;
          this.totalItems = data.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.isLoading = false;
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  deleteClient(clientId: string): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.apiService.deleteClient(clientId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.clients = this.clients.filter(c => c.id !== clientId);
          },
          error: (error) => {
            console.error('Error deleting client:', error);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Example 3: Key Generator Component

```typescript
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-key-generator',
  templateUrl: './key-generator.component.html',
  styleUrls: ['./key-generator.component.css']
})
export class KeyGeneratorComponent implements OnDestroy {
  keyForm!: FormGroup;
  isLoading = false;
  generatedKey: any = null;
  successMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.keyForm = this.fb.group({
      clientId: ['', Validators.required],
      expirationDate: ['', Validators.required],
      modules: [['API', 'Analytics'], Validators.required]
    });
  }

  onGenerateKey(): void {
    if (this.keyForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';

    const keyData = {
      clientId: this.keyForm.value.clientId,
      expirationDate: this.keyForm.value.expirationDate,
      modules: this.keyForm.value.modules
    };

    this.apiService.generateAccessKey(keyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.generatedKey = response;
          this.successMessage = 'API key generated successfully!';
          this.keyForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error generating key:', error);
          this.isLoading = false;
        }
      });
  }

  copyToClipboard(): void {
    if (this.generatedKey?.key) {
      navigator.clipboard.writeText(this.generatedKey.key).then(() => {
        alert('API key copied to clipboard!');
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Testing Integration

### Manual Testing Checklist

1. **Backend Running**
   ```bash
   cd admin-dashboard-api
   npm run start:dev
   # Should see: ✅ Application is running on http://localhost:3000
   ```

2. **Angular Running**
   ```bash
   cd src
   ng serve
   # Should see: ✅ Angular Live Development Server running on localhost:4200
   ```

3. **Test Login Flow**
   - Navigate to http://localhost:4200/login
   - Use credentials from backend registration
   - Should redirect to dashboard

4. **Test Data Loading**
   - Check browser console (F12) for any errors
   - Verify Network tab shows API calls to localhost:3000
   - Check dat is loading in components

5. **Test Protected Routes**
   - Try accessing /dashboard without login
   - Should redirect to /login

---

## Troubleshooting

### Issue: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:3000/api/...' from origin 
'http://localhost:4200' has been blocked by CORS policy
```

**Solution:**
- Ensure backend CORS config includes `http://localhost:4200`
- In `admin-dashboard-api/src/config/database.config.ts`:
  ```typescript
  origin: ['http://localhost:4200']
  ```
- Restart backend after changes

### Issue: 401 Unauthorized
```
Error: {"statusCode":401,"message":"Unauthorized"}
```

**Solution:**
- Token may be expired
- Check `localStorage` in browser DevTools (Application tab)
- Re-login to get fresh token
- Ensure Bearer token is in Authorization header

### Issue: CORS Preflight Failing
```
Response to preflight request doesn't pass access control check
```

**Solution:**
- Ensure backend has proper CORS configuration
- Check OPTIONS method is allowed
- Verify Content-Type header is included

### Issue: Credentials Not Persisting
```
Session lost after page refresh
```

**Solution:**
- Token should persist in `localStorage`
- Check if browser allows local storage
- Ensure `localStorage.setItem()` is called on login

### API Call Returns 404
```
Error: 404 Not Found
```

**Solution:**
- Verify backend is running (`npm run start:dev`)
- Check API endpoint path in service matches backend routes
- Verify URL doesn't have trailing slashes
- Check network tab in DevTools

### Token Not Being Sent in Headers
```
Authorization header missing in request
```

**Solution:**
- Ensure `getAuthHeaders()` is called
- Verify token exists in localStorage
- Check interceptor is properly configured
- Console.log token to verify it exists

---

## Best Practices

1. **Always use `takeUntil()` in subscriptions** to prevent memory leaks
2. **Handle errors gracefully** with user-friendly messages
3. **Use async pipe** when displaying observables in templates
4. **Store sensitive data** only in secure HttpOnly cookies in production
5. **Implement request/response interceptors** for common operations
6. **Validate all user input** before sending to API
7. **Use strongly typed models** instead of `any` type

---

**Last Updated:** February 12, 2026  
**Angular Version:** 18+  
**NestJS Version:** 10.3.3+
