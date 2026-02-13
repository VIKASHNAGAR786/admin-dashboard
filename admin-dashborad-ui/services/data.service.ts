import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Client, GeneratedKey } from '../models/types';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  private generatedKeysSubject = new BehaviorSubject<GeneratedKey[]>([]);
  private apiUrl = environment.apiUrl;

  public clients$: Observable<Client[]> = this.clientsSubject.asObservable();
  public generatedKeys$: Observable<GeneratedKey[]> = this.generatedKeysSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadClients();
    this.loadGeneratedKeys();
  }

  /**
   * Load all clients from the backend
   */
  loadClients(): void {
    this.getAllClients().subscribe(
      (response: any) => {
        const clients = response.data || response || [];
        this.clientsSubject.next(clients);
      },
      (error) => {
        console.error('Error loading clients:', error);
        // Fallback to empty array on error
        this.clientsSubject.next([]);
      }
    );
  }

  /**
   * Load all generated keys from the backend
   */
  loadGeneratedKeys(): void {
    this.getAllGeneratedKeys().subscribe(
      (response: any) => {
        const keys = response.data || response || [];
        this.generatedKeysSubject.next(keys);
      },
      (error) => {
        console.error('Error loading generated keys:', error);
        // Fallback to empty array on error
        this.generatedKeysSubject.next([]);
      }
    );
  }

  /**
   * Get all clients with pagination
   */
  getAllClients(page: number = 1, limit: number = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(
      catchError((error) => {
        console.error('Error fetching clients:', error);
        return of({ data: [], total: 0 });
      })
    );
  }

  /**
   * Get client by ID
   */
  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching client:', error);
        throw error;
      })
    );
  }

  /**
   * Get client statistics
   */
  getClientStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients/stats`).pipe(
      catchError((error) => {
        console.error('Error fetching client stats:', error);
        return of({});
      })
    );
  }

  /**
   * Create a new client
   */
  createClient(clientData: any): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, clientData).pipe(
      tap((newClient) => {
        const currentClients = this.clientsSubject.value;
        this.clientsSubject.next([newClient, ...currentClients]);
      }),
      catchError((error) => {
        console.error('Error creating client:', error);
        throw error;
      })
    );
  }

  /**
   * Update an existing client
   */
  updateClient(id: string, clientData: any): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, clientData).pipe(
      tap((updatedClient) => {
        const currentClients = this.clientsSubject.value;
        const index = currentClients.findIndex(c => c.id === id);
        if (index !== -1) {
          currentClients[index] = updatedClient;
          this.clientsSubject.next([...currentClients]);
        }
      }),
      catchError((error) => {
        console.error('Error updating client:', error);
        throw error;
      })
    );
  }

  /**
   * Delete a client
   */
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clients/${id}`).pipe(
      tap(() => {
        const currentClients = this.clientsSubject.value.filter(c => c.id !== id);
        this.clientsSubject.next(currentClients);
      }),
      catchError((error) => {
        console.error('Error deleting client:', error);
        throw error;
      })
    );
  }

  /**
   * Get all generated keys with pagination
   */
  getAllGeneratedKeys(page: number = 1, limit: number = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/access-keys`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(
      catchError((error) => {
        console.error('Error fetching generated keys:', error);
        return of({ data: [], total: 0 });
      })
    );
  }

  /**
   * Get generated key by ID
   */
  getGeneratedKey(id: string): Observable<GeneratedKey> {
    return this.http.get<GeneratedKey>(`${this.apiUrl}/access-keys/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching generated key:', error);
        throw error;
      })
    );
  }

  /**
   * Get keys by client ID
   */
  getKeysByClient(clientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/access-keys/client/${clientId}`).pipe(
      catchError((error) => {
        console.error('Error fetching keys by client:', error);
        return of([]);
      })
    );
  }

  /**
   * Validate an access key
   */
  validateKey(key: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/access-keys/validate/${key}`).pipe(
      catchError((error) => {
        console.error('Error validating key:', error);
        throw error;
      })
    );
  }

  /**
   * Generate a new access key
   */
  addGeneratedKey(keyData: Omit<GeneratedKey, 'id' | 'generatedAt'>): Observable<GeneratedKey> {
    return this.http.post<GeneratedKey>(`${this.apiUrl}/access-keys`, keyData).pipe(
      tap((newKey) => {
        const currentKeys = this.generatedKeysSubject.value;
        this.generatedKeysSubject.next([newKey, ...currentKeys]);
      }),
      catchError((error) => {
        console.error('Error generating key:', error);
        throw error;
      })
    );
  }

  /**
   * Revoke/delete a generated key
   */
  revokeKey(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/access-keys/${id}`).pipe(
      tap(() => {
        const currentKeys = this.generatedKeysSubject.value.filter(k => k.id !== id);
        this.generatedKeysSubject.next(currentKeys);
      }),
      catchError((error) => {
        console.error('Error revoking key:', error);
        throw error;
      })
    );
  }

  getClients(): Client[] {
    return this.clientsSubject.value;
  }

  getGeneratedKeys(): GeneratedKey[] {
    return this.generatedKeysSubject.value;
  }
}
