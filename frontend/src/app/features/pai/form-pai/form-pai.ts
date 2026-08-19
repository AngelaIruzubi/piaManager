import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaiService } from '../../../core/services/pai.service';

@Component({
  selector: 'app-form-pai',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-pai.html',
  styleUrl: './form-pai.scss'
})
export class FormPai implements OnInit {

  private fb = inject(FormBuilder);
  private paiService = inject(PaiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  personaId: number = 0;
  cargando = false;
  error = '';

  constructor() {
    this.form = this.fb.group({
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      fecha_inicio: ['', Validators.required],
      fecha_revision: [''],
      observaciones_generales: [''],
    });
  }

  ngOnInit() {
    this.personaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    this.paiService.crear(this.personaId, this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/personas', this.personaId, 'pai']);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al crear el PAI';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/personas', this.personaId, 'pai']);
  }
}