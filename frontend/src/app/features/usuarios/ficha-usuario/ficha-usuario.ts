import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-ficha-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ficha-usuario.html',
  styleUrl: './ficha-usuario.scss'
})
export class FichaUsuario implements OnInit {

  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuario: Usuario | null = null;
  cargando = true;
  error = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.usuarioService.getById(id).subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al cargar el educador';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/usuarios']);
  }

  editar() {
    this.router.navigate(['/usuarios', this.usuario?.id, 'editar']);
  }

  darDeBaja() {
    if (!confirm('¿Estás segura de que quieres dar de baja a este educador?')) return;

    this.usuarioService.darDeBaja(this.usuario!.id).subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert(err?.error?.mensaje || 'Error al dar de baja al educador');
      }
    });
  }
}
