import { Component, input } from '@angular/core';

// Etiqueta "Activo" / "Baja" con su icono. Se usa en las listas y fichas de personas y de educadores:
// el icono y el texto acompañan al color, así el estado no se distingue solo por el color
@Component({
  selector: 'app-estado-activo',
  standalone: true,
  templateUrl: './estado-activo.html',
  styleUrl: './estado-activo.scss',
})
export class EstadoActivo {
  activo = input.required<boolean>();
}
