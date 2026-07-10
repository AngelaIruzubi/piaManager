import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  private authService = inject(AuthService);
  private router = inject(Router);

  usuario$ = this.authService.usuario$;

  estaAutenticado() {
    return this.authService.estaAutenticado();
  }

  esCoordinador() {
    return this.authService.esCoordinador();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
