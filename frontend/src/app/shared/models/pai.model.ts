export interface Pai {
  id: number;
  anio: number;
  estado: string;
  fecha_inicio: string;
  fecha_revision?: string;
  observaciones_generales?: string;
  areas?: Area[];
}

export interface Area {
  id: number;
  tipo: string;
  observaciones?: string;
  objetivos?: Objetivo[];
}

export interface Objetivo {
  id: number;
  descripcion: string;
  plazo: string;
  estado: string;
  fecha_inicio?: string;
  fecha_prevista?: string;
  fecha_consecucion?: string;
  medios?: Medio[];
  seguimientos?: Seguimiento[];
}

export interface Medio {
  id: number;
  tipo: string;
  descripcion: string;
  responsable?: string;
}

export interface Seguimiento {
  id: number;
  fecha: string;
  porcentaje_logro: number;
  observacion: string;
}