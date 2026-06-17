export type NivelHabilidad = 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';
export type TipoInsignia = 'TOP_10' | 'VERIFICADO' | 'CREATIVIDAD';

export interface HabilidadValidada {
  id: string;
  talentoId: string;
  nombre: string;
  nivel: NivelHabilidad;
  porcentaje: number;
}

export interface Insignia {
  id: string;
  talentoId: string;
  retoId: string;
  empresaId: string;
  titulo: string;
  tipo: TipoInsignia;
  fechaOtorgada: string;
}

export interface Portafolio {
  habilidades: HabilidadValidada[];
  insignias: Insignia[];
}

export interface RegistrarHabilidadRequest {
  nombre: string;
  nivel: NivelHabilidad;
}

export interface OtorgarInsigniaRequest {
  talentoId: string;
  retoId: string;
  titulo: string;
  tipo: TipoInsignia;
}
