export interface Pai {
  id: number;
  anio: number;
  estado: string;
  fecha_inicio: string;
  fecha_revision?: string;
  observaciones_generales?: string;
  areas?: Area[];
  persona?: { id: number; nombre: string; apellidos: string };
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
  pictogramas?: Pictograma[];
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

export interface Pictograma {
  id: number;
  arasaac_id: number;
  keyword: string;
  imagen_url: string;
}