// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginDTO {
  idPersonnel: string;
  dep: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  login(credentials: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap(() => {
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.isAuthenticated.set(false);
      })
    );
  }
}