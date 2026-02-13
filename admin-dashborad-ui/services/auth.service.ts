import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environment';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    const token = localStorage.getItem('authToken');
    const authStatus = !!token;
    this.isAuthenticatedSubject.next(authStatus);
  }

  login(loginDto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginDto).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error.error?.message || 'Login failed');
      })
    );
  }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, registerDto).pipe(
      catchError((error) => {
        console.error('Register error:', error);
        return throwError(() => error.error?.message || 'Registration failed');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdminAuthenticated');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`).pipe(
      catchError((error) => {
        console.error('Profile fetch error:', error);
        return throwError(() => error.error?.message || 'Failed to fetch profile');
      })
    );
  }
}
