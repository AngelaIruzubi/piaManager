import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-objetivo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-objetivo.html',
  styleUrl: './form-objetivo.scss'
})
export class FormObjetivo implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost:3000/api';

  form: FormGroup;
  areaId: number = 0;
  objetivoId: number = 0;
  esEdicion = false;
  cargando = false;
  error = '';

  plazos = ['corto', 'medio', 'largo'];

  constructor() {
    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      plazo: ['corto', Validators.required],
      fecha_inicio: [''],
      fecha_prevista: [''],
    });
  }

  ngOnInit() {
    this.areaId = Number(this.route.snapshot.paramMap.get('id'));
    this.objetivoId = Number(this.route.snapshot.paramMap.get('id'));
    this.esEdicion = this.router.url.includes('editar');

    if (this.esEdicion) {
      this.http.get<any>(`${this.apiUrl}/objetivos/${this.objetivoId}`).subscribe({
        next: (data: any) => {
          this.form.patchValue({
            descripcion: data.descripcion,
            plazo: data.plazo,
            fecha_inicio: data.fecha_inicio?.split('T')[0],
            fecha_prevista: data.fecha_prevista?.split('T')[0],
          });
          this.areaId = data.area?.id;
          this.cdr.detectChanges();
        },
        error: (_err: any) => {}
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    if (this.esEdicion) {
      this.http.put(`${this.apiUrl}/objetivos/${this.objetivoId}`, this.form.value).subscribe({
        next: () => {
          this.volver();
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'Error al actualizar el objetivo';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.http.post(`${this.apiUrl}/areas/${this.areaId}/objetivos`, this.form.value).subscribe({
        next: () => {
          this.volver();
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'Error al crear el objetivo';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  volver() {
    this.location.back();
  }
}