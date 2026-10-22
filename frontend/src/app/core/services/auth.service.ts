import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginResponse } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' }) //Servicio de Angular, clase reutilizable con lógica
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'pia_token';

  private usuarioActual = new BehaviorSubject<LoginResponse | null>(null); //Variable reactiva que almacena el usuario actual
  usuario$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {
    // Al recargar la página se recupera la sesión, pero solo si el token sigue siendo válido
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.tokenVigente(token)) {
      this.usuarioActual.next(this.decodificarToken(token));
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }) //llama al backend para autenticar al usuario y obtener el token y el rol. Devuelve un observable que emite la respuesta del backend. El tipo de la respuesta es LoginResponse, que contiene el token y el rol del usuario.
      .pipe(
        // funciona encadenando operadores
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          this.usuarioActual.next(response); //Modifica el valor de la variable reactiva usuarioActual con los datos del usuario autenticado. Esto permite que otros componentes que estén suscritos a usuario$ reciban la actualización.
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.usuarioActual.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Hay sesión si hay token y no ha caducado (el backend lo rechazaría con un 401)
  estaAutenticado(): boolean {
    const token = this.getToken();
    return !!token && this.tokenVigente(token);
  }

  getRol(): string | null {
    return this.usuarioActual.value?.rol ?? null;
  }

  esCoordinador(): boolean {
    return this.getRol() === 'coordinador';
  }

  private tokenVigente(token: string): boolean {
    const payload = this.leerPayload(token);
    if (!payload) return false;
    // exp viene en segundos desde 1970; Date.now() en milisegundos
    return payload.exp === undefined || payload.exp * 1000 > Date.now();
  }

  // El payload del JWT va en base64url y en UTF-8: hay que descodificarlo así para que
  // los nombres con tilde (Lucía) no salgan mal. Si el token está mal formado, devuelve null
  private leerPayload(
    token: string,
  ): { rol: string; nombre?: string; apellidos?: string; exp?: number } | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  }

  private decodificarToken(token: string): LoginResponse {
    const payload = this.leerPayload(token);
    return {
      token,
      rol: payload?.rol ?? '',
      nombre: payload?.nombre ?? '',
      apellidos: payload?.apellidos ?? '',
    };
  }
}
