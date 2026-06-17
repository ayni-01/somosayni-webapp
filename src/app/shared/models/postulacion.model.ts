export type EstadoPostulacion = 'ENVIADA' | 'EN_REVISION' | 'APROBADA' | 'RECHAZADA' | 'FINALIZADA';
export type ResultadoEvaluacion = 'APROBADO' | 'RECHAZADO';

export interface Postulacion {
  id: string;
  talentoId: string;
  retoId: string;
  urlSolucion: string;
  estado: EstadoPostulacion;
  creadaEn: string;
}

export interface PostularRequest {
  retoId: string;
  urlSolucion: string;
}

export interface Evaluacion {
  id: string;
  postulacionId: string;
  puntuacion: number;
  resultado: ResultadoEvaluacion;
  feedback: string;
  evaluadaEn: string;
}

export interface EvaluarRequest {
  puntuacion: number;
  feedback: string;
  resultado: ResultadoEvaluacion;
}
