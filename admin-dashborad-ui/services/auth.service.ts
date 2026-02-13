import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  // Mock admin credentials (In production, this would be handled by backend)
  private ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  constructor() {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(authStatus);
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        if (
          username === this.ADMIN_CREDENTIALS.username &&
          password === this.ADMIN_CREDENTIALS.password
        ) {
          localStorage.setItem('isAdminAuthenticated', 'true');
          this.isAuthenticatedSubject.next(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('isAdminAuthenticated');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
