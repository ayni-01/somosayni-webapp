export type EstadoReto = 'BORRADOR' | 'ACTIVO' | 'CERRADO' | 'ARCHIVADO';
export type NivelDificultad = 'JUNIOR' | 'TRAINEE' | 'SENIOR';
export type Categoria = 'FRONTEND' | 'BACKEND' | 'FULLSTACK' | 'DATA' | 'DEVOPS' | 'UX_UI' | 'QA' | 'MOBILE';
export type TipoRecompensa = 'MONETARIA' | 'CONTRATACION' | 'DIPLOMA';

export interface Recompensa {
  tipo: TipoRecompensa;
  monto: number;
  descripcion: string;
}

export interface ItemDescripcion {
  descripcion: string;
}

export interface Reto {
  id: string;
  empresaId: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  requisitos: ItemDescripcion[];
  entregables: ItemDescripcion[];
  recompensa: Recompensa | null;
  fechaLimite: string | null;
  nivelDificultad: NivelDificultad;
  estado: EstadoReto;
  cuposDisponibles: number;
}

export interface PublicarRetoRequest {
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  requisitos: string[];
  entregables: string[];
  tipoRecompensa: TipoRecompensa;
  montoRecompensa: number;
  fechaLimite: string | null;
  nivelDificultad: NivelDificultad;
  cuposDisponibles: number;
}

export interface FiltroRetos {
  categoria?: Categoria;
  nivelDificultad?: NivelDificultad;
  estado?: EstadoReto;
  empresaId?: string;
}
