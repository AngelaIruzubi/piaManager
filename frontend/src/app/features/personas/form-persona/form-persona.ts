import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonasService } from '../../../core/services/persona.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-form-persona',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-persona.html',
  styleUrl: './form-persona.scss'
})
export class FormPersona implements OnInit {

  private fb = inject(FormBuilder);
  private personasService = inject(PersonasService);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  educadores: Usuario[] = [];
  esEdicion = false;
  personaId: number = 0;
  cargando = false;
  error = '';

  constructor() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      tutor_legal: ['', Validators.required],
      telefono_contacto: ['', Validators.required],
      profesional_referencia_id: ['', Validators.required],
      fecha_alta: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.personaId = Number(this.route.snapshot.paramMap.get('id'));
    this.esEdicion = !!this.personaId;

    // Cargar educadores para el selector
    this.usuarioService.getEducadores().subscribe({
      next: (data: any) => {
        this.educadores = data as Usuario[];
        this.cdr.detectChanges();
      },
      error: (_err: any) => {}
    });

    // Si es edición cargamos los datos
    if (this.esEdicion) {
      this.personasService.getById(this.personaId).subscribe({
        next: (data: any) => {
          this.form.patchValue({
            nombre: data.nombre,
            apellidos: data.apellidos,
            fecha_nacimiento: data.fecha_nacimiento?.split('T')[0],
            tutor_legal: data.tutor_legal,
            telefono_contacto: data.telefono_contacto,
            profesional_referencia_id: data.profesional_referencia?.id,
            fecha_alta: data.fecha_alta?.split('T')[0],
          });
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

    const datos = this.form.value;

    if (this.esEdicion) {
      this.personasService.actualizar(this.personaId, datos).subscribe({
        next: () => {
          this.router.navigate(['/personas', this.personaId]);
        },
        error: (_err: any) => {
          this.error = 'Error al actualizar la persona';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.personasService.crear(datos).subscribe({
        next: (nueva: any) => {
          this.router.navigate(['/personas', nueva.id]);
        },
        error: (_err: any) => {
          this.error = 'Error al crear la persona';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  volver() {
    if (this.esEdicion) {
      this.router.navigate(['/personas', this.personaId]);
    } else {
      this.router.navigate(['/personas']);
    }
  }
}
