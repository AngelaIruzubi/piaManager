import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-objetivo-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './objetivo-detalle.html',
  styleUrl: './objetivo-detalle.scss'
})
export class ObjetivoDetalle implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost:3000/api';

  objetivoId: number = 0;
  objetivo: any = null;
  cargando = true;
  error = '';

  ngOnInit() {
    this.objetivoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.http.get<any>(`${this.apiUrl}/objetivos/${this.objetivoId}`).subscribe({
      next: (data: any) => {
        this.objetivo = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al cargar el objetivo';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.location.back();
  }

  editar() {
    this.router.navigate(['/objetivos', this.objetivoId, 'editar']);
  }

  addObservacion() {
    this.router.navigate(['/objetivos', this.objetivoId, 'seguimientos', 'nuevo']);
  }

  verPictogramas() {
    this.router.navigate(['/objetivos', this.objetivoId, 'pictogramas']);
  }

  cambiarEstado() {
    const estados = ['pendiente', 'en_proceso', 'conseguido', 'no_trabajado'];
    const actual = estados.indexOf(this.objetivo.estado);
    const siguiente = estados[(actual + 1) % estados.length];

    if (!confirm(`¿Cambiar estado a "${siguiente}"?`)) return;

    this.http.patch(`${this.apiUrl}/objetivos/${this.objetivoId}/estado`, { estado: siguiente }).subscribe({
      next: () => {
        this.objetivo.estado = siguiente;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert(err.error?.mensaje || 'Error al cambiar estado');
      }
    });
  }

  etiquetaEstado(estado: string): string {
    const etiquetas: any = {
      pendiente: 'Pendiente',
      en_proceso: 'En proceso',
      conseguido: 'Conseguido',
      no_trabajado: 'No trabajado'
    };
    return etiquetas[estado] || estado;
  }
}
