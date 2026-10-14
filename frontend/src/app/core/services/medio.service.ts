import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medio } from '../../shared/models/pai.model';

export type DatosMedio = Pick<Medio, 'tipo' | 'descripcion' | 'responsable'>;

@Injectable({ providedIn: 'root' })
export class MedioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crear(objetivoId: number, datos: DatosMedio) {
    return this.http.post<Medio>(`${this.apiUrl}/objetivos/${objetivoId}/medios`, datos);
  }

  actualizar(id: number, datos: DatosMedio) {
    return this.http.put<Medio>(`${this.apiUrl}/medios/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/medios/${id}`);
  }
}
