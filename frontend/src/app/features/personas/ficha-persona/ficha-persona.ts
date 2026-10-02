import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonasService } from '../../../core/services/persona.service';
import { Persona } from '../../../shared/models/persona.model';
import { AuthService } from '../../../core/services/auth.service';



@Component({
  selector: 'app-ficha-persona',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ficha-persona.html',
  styleUrl: './ficha-persona.scss'
})
export class FichaPersona implements OnInit {

  private personasService = inject(PersonasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  esCoordinador = this.authService.esCoordinador();

  persona: Persona | null = null;
  cargando = true;
  error = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.personasService.getById(id).subscribe({
      next: (data: any) => {
        this.persona = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al cargar la persona';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  iniciales(): string {
    if (!this.persona) return '';
    const apellido = this.persona.apellidos?.charAt(0) ?? '';
    return `${this.persona.nombre.charAt(0)}${apellido}`.toUpperCase();
  }

  verPai() {
    this.router.navigate(['/personas', this.persona?.id, 'pai']);
  }

  volver() {
    this.router.navigate(['/personas']);
  }
  editar() {
  this.router.navigate(['/personas', this.persona?.id, 'editar']);
  }
  darDeBaja() {
    if (!confirm('¿Estás segura de que quieres dar de baja a esta persona?')) return;

    this.personasService.darDeBaja(this.persona!.id).subscribe({
      next: (data: any) => {
        this.persona = data;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        alert('Error al dar de baja a la persona');
      }
    });
  }
}