import { Component, computed, input } from '@angular/core';

const ETIQUETAS: Record<string, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  conseguido: 'Conseguido',
  no_trabajado: 'No trabajado',
};

// Píldora con el icono y el texto del estado de un objetivo. Se usa en la vista del PAI y en el detalle
// del objetivo: así el diseño de cada estado se define en un solo sitio
@Component({
  selector: 'app-estado-objetivo',
  standalone: true,
  templateUrl: './estado-objetivo.html',
  styleUrl: './estado-objetivo.scss',
})
export class EstadoObjetivo {
  estado = input.required<string>();
  tamano = input<'normal' | 'grande'>('normal');

  etiqueta = computed(() => ETIQUETAS[this.estado()] ?? this.estado());
}
