import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.scss'
})
export class ListaUsuarios implements OnInit {

  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  usuarios: Usuario[] = [];
  cargando = true;
  error = '';

  ngOnInit() {
    this.usuarioService.getAll().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al cargar los usuarios';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  darDeBaja(id: number, event: Event) {
    event.stopPropagation();
    if (!confirm('¿Estás segura de que quieres dar de baja a este usuario?')) return;

    this.usuarioService.darDeBaja(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.map(u =>
          u.id === id ? { ...u, activo: false } : u
        );
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert(err?.error?.mensaje || 'Error al dar de baja al usuario');
      }
    });
  }

  verFicha(id: number) {
    this.router.navigate(['/usuarios', id]);
  }
}