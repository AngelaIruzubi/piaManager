export interface CrearMedioDto {
  tipo: string;
  descripcion: string;
  responsable?: string;
}

export interface ActualizarMedioDto {
  tipo?: string;
  descripcion?: string;
  responsable?: string;
}