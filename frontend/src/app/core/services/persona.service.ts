import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../../shared/models/persona.model';

@Injectable({ providedIn: 'root' })
export class PersonasService {

  private apiUrl = 'http://localhost:3000/api/personas';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }

  crear(data: Partial<Persona>) {
    return this.http.post<Persona>(this.apiUrl, data);
  }

  actualizar(id: number, data: Partial<Persona>) {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, data);
  }

  darDeBaja(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/baja`, {});
  }
}