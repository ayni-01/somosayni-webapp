export type EstadoReto = 'BORRADOR' | 'ACTIVO' | 'CERRADO' | 'ARCHIVADO';
export type NivelDificultad = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';

export interface Reto {
  id: string;
  empresaId: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: NivelDificultad;
  estado: EstadoReto;
  cuposTotal: number;
  cuposDisponibles: number;
  creadoEn: string;
}

export interface PublicarRetoRequest {
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: NivelDificultad;
  cuposTotal: number;
}

export interface FiltroRetos {
  categoria?: string;
  nivel?: NivelDificultad;
  estado?: EstadoReto;
  texto?: string;
  page?: number;
  size?: number;
}
