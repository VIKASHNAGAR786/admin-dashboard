import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.debug('JWT token added to request for:', req.url);
    } else {
      console.warn('No JWT token found in localStorage for request:', req.url);
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          console.error('Unauthorized request (401). Token may be expired or invalid.', error);
          // Clear token and redirect to login if needed
          localStorage.removeItem('authToken');
        }
        return throwError(() => error);
      })
    );
  }
}
