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

  getColorEstado(estado: string): string {
    const colores: any = {
      pendiente: '#E2E8F0',
      en_proceso: '#BEE3F8',
      conseguido: '#C6F6D5',
      no_trabajado: '#FED7D7'
    };
    return colores[estado] || '#E2E8F0';
  }

  getColorEstadoPai(estado: string): string {
    const colores: any = {
      borrador: '#FEF3C7',
      activo: '#C6F6D5',
      cerrado: '#E2E8F0'
    };
    return colores[estado] || '#E2E8F0';
  }

  calcularProgreso(area: any): number {
    if (!area.objetivos || area.objetivos.length === 0) return 0;
    const conseguidos = area.objetivos.filter((o: any) => o.estado === 'conseguido').length;
    return Math.round((conseguidos / area.objetivos.length) * 100);
  }
  crearPai() {
  this.router.navigate(['/personas', this.personaId, 'pai', 'nuevo']);
}
}