import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buscador-pictogramas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './buscador-pictogramas.html',
  styleUrl: './buscador-pictogramas.scss'
})
export class BuscadorPictogramas implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private apiUrl = 'http://localhost:3000/api';

  objetivoId: number = 0;
  objetivo: any = null;
  form: FormGroup;

  resultados: any[] = [];
  seleccionados: any[] = [];
  palabrasProbadas: string[] = [];
  buscando = false;
  guardando = false;
  sugerenciaHecha = false;
  error = '';

  constructor() {
    this.form = this.fb.group({
      keyword: ['']
    });
  }

  ngOnInit() {
    this.objetivoId = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar el objetivo
    this.http.get<any>(`${this.apiUrl}/objetivos/${this.objetivoId}`).subscribe({
      next: (data: any) => {
        this.objetivo = data;
        this.cdr.detectChanges();
      }
    });

    // Cargar pictogramas ya seleccionados
    this.cargarSeleccionados();

    // Buscar automáticamente pictogramas a partir del nombre del objetivo
    this.buscarSugerencias();
  }

  buscarSugerencias() {
    this.buscando = true;
    this.error = '';

    this.http.get<any>(`${this.apiUrl}/objetivos/${this.objetivoId}/pictogramas/sugerencias`).subscribe({
      next: (data: any) => {
        this.resultados = data.resultados;
        this.palabrasProbadas = data.palabras_probadas;
        this.sugerenciaHecha = true;
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.sugerenciaHecha = true;
        this.buscando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarSeleccionados() {
    this.http.get<any[]>(`${this.apiUrl}/objetivos/${this.objetivoId}/pictogramas`).subscribe({
      next: (data: any) => {
        this.seleccionados = data;
        this.cdr.detectChanges();
      }
    });
  }

  buscar() {
    const keyword = this.form.get('keyword')?.value?.trim();
    if (!keyword) return;

    this.buscando = true;
    this.resultados = [];
    this.error = '';

    this.http.get<any[]>(`${this.apiUrl}/pictogramas/buscar?keyword=${encodeURIComponent(keyword)}`).subscribe({
      next: (data: any) => {
        this.resultados = data;
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al buscar pictogramas';
        this.buscando = false;
        this.cdr.detectChanges();
      }
    });
  }

  estaSeleccionado(arasaac_id: number): boolean {
    return this.seleccionados.some(s => s.arasaac_id === arasaac_id);
  }

  seleccionar(pictograma: any) {
    if (this.estaSeleccionado(pictograma.arasaac_id)) return;

    this.http.post(`${this.apiUrl}/objetivos/${this.objetivoId}/pictogramas`, {
      arasaac_id: pictograma.arasaac_id,
      keyword: pictograma.keyword
    }).subscribe({
      next: () => {
        this.cargarSeleccionados();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar el pictograma';
        this.cdr.detectChanges();
      }
    });
  }

  eliminarSeleccionado(id: number) {
    this.http.delete(`${this.apiUrl}/pictogramas/${id}`).subscribe({
      next: () => {
        this.seleccionados = this.seleccionados.filter(s => s.id !== id);
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al eliminar el pictograma';
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.location.back();
  }
}