export type NivelHabilidad = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
export type TipoInsignia = 'VERIFICADO';

export interface HabilidadValidada {
  id: string;
  talentoId: string;
  nombre: string;
  nivel: NivelHabilidad;
  actualizadaEn: string;
}

export interface Insignia {
  id: string;
  talentoId: string;
  retoId: string;
  titulo: string;
  tipo: TipoInsignia;
  otorgadaEn: string;
}

export interface Portafolio {
  talentoId: string;
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
