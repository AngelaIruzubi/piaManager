import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValorCatalogo } from '../../shared/models/pai.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Valores activos de un catálogo (por ejemplo TIPO_MEDIO), en orden de alta
  getByTipo(tipo: string) {
    return this.http.get<ValorCatalogo[]>(`${this.apiUrl}/catalogos/${tipo}`);
  }
}
