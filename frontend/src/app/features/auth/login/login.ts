import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  cargando = false;
  // Aviso cuando se llega aquí porque la sesión caducó (lo indican el guard y el interceptor)
  aviso = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    if (route.snapshot.queryParamMap.get('sesion') === 'caducada') {
      this.aviso = 'Tu sesión ha caducado. Vuelve a entrar.';
    }
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = '';

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/personas']);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al iniciar sesión';
        this.cargando = false;
        this.cdr.detectChanges(); // sin Zone.js hay que avisar a Angular para que pinte el error
      },
    });
  }

  get emailControl() {
    return this.form.get('email');
  }
  get passwordControl() {
    return this.form.get('password');
  }
}
