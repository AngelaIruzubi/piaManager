import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PersonasService } from '../../../core/services/persona.service';
import { Persona } from '../../../shared/models/persona.model';

@Component({
  selector: 'app-lista-personas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-personas.html',
  styleUrl: './lista-personas.scss'
})
export class ListaPersonas implements OnInit {

  private personasService = inject(PersonasService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  personas: Persona[] = [];
  cargando = true;
  error = '';

  ngOnInit() {
    this.personasService.getAll().subscribe({
      next: (data: Persona[]) => {
        this.personas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Error al cargar las personas';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  verFicha(id: number) {
    this.router.navigate(['/personas', id]);
  }

  nombreCompleto(persona: Persona): string {
    return `${persona.nombre} ${persona.apellidos}`;
  }
}