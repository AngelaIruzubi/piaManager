import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getEducadores() {
    return this.http.get<Pick<Usuario, 'id' | 'nombre' | 'apellidos'>[]>(`${this.apiUrl}/educadores`);
  }

  getById(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(data: Partial<Usuario> & { password: string }) {
    return this.http.post<Usuario>(this.apiUrl, data);
  }

  actualizar(id: number, data: Partial<Usuario>) {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, data);
  }

  darDeBaja(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/baja`, {});
  }
}