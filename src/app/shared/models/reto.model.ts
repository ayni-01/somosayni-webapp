export type EstadoReto = 'BORRADOR' | 'ACTIVO' | 'CERRADO' | 'ARCHIVADO';
export type Modalidad = 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';

export interface Reto {
  id: string;
  empresaId: string;
  titulo: string;
  descripcion: string;
  modalidad: Modalidad;
  duracionDias: number;
  estado: EstadoReto;
  creadoEn: string;
}

export interface PublicarRetoRequest {
  titulo: string;
  descripcion: string;
  empresaId: string;
  modalidad: Modalidad;
  duracionDias: number;
}

export interface FiltroRetos {
  texto?: string;
  estado?: EstadoReto;
  modalidad?: Modalidad;
  empresaId?: string;
}
