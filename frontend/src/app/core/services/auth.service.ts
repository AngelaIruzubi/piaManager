import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginResponse } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' }) //Servicio de Angular, clase reutilizable con lógica
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'pia_token';

  private usuarioActual = new BehaviorSubject<LoginResponse | null>(null); //Variable reactiva que almacena el usuario actual
  usuario$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const datos = this.decodificarToken(token);
      this.usuarioActual.next(datos);
    }
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }) //llama al backend para autenticar al usuario y obtener el token y el rol. Devuelve un observable que emite la respuesta del backend. El tipo de la respuesta es LoginResponse, que contiene el token y el rol del usuario.
      .pipe( // funciona encadenando operadores
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this.usuarioActual.next(response); //Modifica el valor de la variable reactiva usuarioActual con los datos del usuario autenticado. Esto permite que otros componentes que estén suscritos a usuario$ reciban la actualización.
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.usuarioActual.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  getRol(): string | null {
    return this.usuarioActual.value?.rol ?? null;
  }

  esCoordinador(): boolean {
    return this.getRol() === 'coordinador';
  }

  private decodificarToken(token: string): LoginResponse {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { token, rol: payload.rol, nombre: payload.nombre ?? '' };
  }
}