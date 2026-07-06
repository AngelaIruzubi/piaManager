export interface CrearObjetivoDto {
  descripcion: string;
  plazo: string;
  fecha_inicio?: string;
  fecha_prevista?: string;
}

export interface ActualizarObjetivoDto {
  descripcion?: string;
  plazo?: string;
  fecha_inicio?: string;
  fecha_prevista?: string;
}

export interface CambiarEstadoObjetivoDto {
  estado: string;
  fecha_consecucion?: string;
}