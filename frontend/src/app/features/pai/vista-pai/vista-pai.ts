import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaiService } from '../../../core/services/pai.service';
import { Pai } from '../../../shared/models/pai.model';


@Component({
  selector: 'app-vista-pai',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vista-pai.html',
  styleUrl: './vista-pai.scss'
})
export class VistaPai implements OnInit {

  private paiService = inject(PaiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  pai: Pai | null = null;
  personaId: number = 0;
  cargando = true;
  error = '';

  ngOnInit() {
    this.personaId = Number(this.route.snapshot.paramMap.get('id'));

    this.paiService.getByPersona(this.personaId).subscribe({
      next: (data: any) => {
        // Cogemos el PAI activo o el más reciente
        const pais = data as Pai[];
        this.pai = pais.find(p => p.estado === 'activo') || pais[0] || null;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (_err: any) => {
        this.error = 'Error al cargar el PAI';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/personas', this.personaId]);
  }

  iniciales(nombre: string): string {
    return nombre?.charAt(0).toUpperCase() ?? '';
  }

  calcularProgreso(area: any): number {
    if (!area.objetivos || area.objetivos.length === 0) return 0;
    const conseguidos = area.objetivos.filter((o: any) => o.estado === 'conseguido').length;
    return Math.round((conseguidos / area.objetivos.length) * 100);
  }

  crearPai() {
    this.router.navigate(['/personas', this.personaId, 'pai', 'nuevo']);
  }

  descargarPdf() {
    if (!this.pai) return;

    const nombre = `${this.pai.persona?.nombre ?? ''} ${this.pai.persona?.apellidos ?? ''}`.trim();
    const tituloOriginal = document.title;
    document.title = `PAI ${this.pai.anio} - ${nombre}`;

    const restaurar = () => {
      document.title = tituloOriginal;
      window.removeEventListener('afterprint', restaurar);
    };
    window.addEventListener('afterprint', restaurar);

    window.print();
  }

  verDetalle(objetivoId: number) {
    this.router.navigate(['/objetivos', objetivoId]);
  }

  addObjetivo(areaId: number) {
    this.router.navigate(['/areas', areaId, 'objetivos', 'nuevo']);
  }

  verPictogramas(objetivoId: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/objetivos', objetivoId, 'pictogramas']);
  }

  addSeguimiento(objetivoId: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/objetivos', objetivoId, 'seguimientos', 'nuevo']);
  }
}
