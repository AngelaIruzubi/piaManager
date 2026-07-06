export interface CrearPaiDto {
  anio: number;
  fecha_inicio: string;
  fecha_revision?: string;
  observaciones_generales?: string;
}

export interface ActualizarPaiDto {
  fecha_revision?: string;
  observaciones_generales?: string;
}

export interface CambiarEstadoPaiDto {
  estado: string;
}