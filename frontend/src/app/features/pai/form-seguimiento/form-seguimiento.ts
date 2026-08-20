import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-seguimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-seguimiento.html',
  styleUrl: './form-seguimiento.scss'
})
export class FormSeguimiento implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost:3000/api';

  form: FormGroup;
  objetivoId: number = 0;
  objetivo: any = null;
  cargando = false;
  error = '';

  constructor() {
    this.form = this.fb.group({
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      porcentaje_logro: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      observacion: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.objetivoId = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar el objetivo para mostrar contexto
    this.http.get<any>(`${this.apiUrl}/objetivos/${this.objetivoId}`).subscribe({
      next: (data: any) => {
        this.objetivo = data;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {}
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    this.http.post(
      `${this.apiUrl}/objetivos/${this.objetivoId}/seguimientos`,
      this.form.value
    ).subscribe({
      next: () => {
        this.volver();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar la observación';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.location.back();
  }
  
  getColorEstado(estado: string): string {
  const colores: any = {
    pendiente: '#E2E8F0',
    en_proceso: '#BEE3F8',
    conseguido: '#C6F6D5',
    no_trabajado: '#FED7D7'
  };
  return colores[estado] || '#E2E8F0';
}
}