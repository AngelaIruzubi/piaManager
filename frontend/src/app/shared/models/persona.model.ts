import { Usuario } from './usuario.model';

export interface Persona {
  id: number;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  tutor_legal: string;
  telefono_contacto: string;
  foto_url?: string;
  activo: boolean;
  fecha_alta: string;
  fecha_baja?: string;
  profesional_referencia?: Usuario;
}