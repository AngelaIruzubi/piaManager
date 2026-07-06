export interface CrearPersonaDto {
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  tutor_legal: string;
  telefono_contacto: string;
  foto_url?: string;
  profesional_referencia_id: number;
  fecha_alta: string;
}

export interface ActualizarPersonaDto {
  nombre?: string;
  apellidos?: string;
  tutor_legal?: string;
  telefono_contacto?: string;
  foto_url?: string;
  profesional_referencia_id?: number;
}