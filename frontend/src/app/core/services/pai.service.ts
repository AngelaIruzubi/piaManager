import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pai } from '../../shared/models/pai.model';

@Injectable({ providedIn: 'root' })
export class PaiService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getByPersona(personaId: number) {
    return this.http.get<Pai[]>(`${this.apiUrl}/personas/${personaId}/pai`);
  }

  getById(id: number) {
    return this.http.get<Pai>(`${this.apiUrl}/pai/${id}`);
  }

  crear(personaId: number, data: Partial<Pai>) {
    return this.http.post<Pai>(`${this.apiUrl}/personas/${personaId}/pai`, data);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch(`${this.apiUrl}/pai/${id}/estado`, { estado });
  }
}