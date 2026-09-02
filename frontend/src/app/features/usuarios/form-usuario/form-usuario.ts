import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-usuario.html',
  styleUrl: './form-usuario.scss'
})
export class FormUsuario implements OnInit {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  usuarioId: number = 0;
  esEdicion = false;
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

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!idParam;

    if (this.esEdicion) {
      this.usuarioId = Number(idParam);
      this.form.removeControl('password');
      this.form.removeControl('rol');

      this.usuarioService.getById(this.usuarioId).subscribe({
        next: (data: any) => {
          this.form.patchValue({
            nombre: data.nombre,
            apellidos: data.apellidos,
            email: data.email,
          });
          this.cdr.detectChanges();
        },
        error: (_err: any) => {
          this.error = 'Error al cargar el educador';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    const peticion = this.esEdicion
      ? this.usuarioService.actualizar(this.usuarioId, this.form.value)
      : this.usuarioService.crear(this.form.value);

    peticion.subscribe({
      next: () => {
        this.router.navigate(this.esEdicion ? ['/usuarios', this.usuarioId] : ['/usuarios']);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar el educador';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(this.esEdicion ? ['/usuarios', this.usuarioId] : ['/usuarios']);
  }
}
