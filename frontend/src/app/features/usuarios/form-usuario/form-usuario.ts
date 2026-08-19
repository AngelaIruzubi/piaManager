import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-usuario.html',
  styleUrl: './form-usuario.scss'
})
export class FormUsuario {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  cargando = false;
  error = '';

  constructor() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['educador', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    this.usuarioService.crear(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al crear el usuario';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/usuarios']);
  }
}