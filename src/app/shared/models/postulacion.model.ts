export type EstadoPostulacion = 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';
export type ResultadoEvaluacion = 'APROBADO' | 'RECHAZADO';

export interface Postulacion {
  id: string;
  talentoId: string;
  retoId: string;
  urlSolucion: string;
  estado: EstadoPostulacion;
  fechaEnvio: string;
}

export interface PostularRequest {
  retoId: string;
  urlSolucion: string;
}

export interface Evaluacion {
  id: string;
  postulacionId: string;
  reclutadorId: string;
  puntuacion: number;
  resultado: ResultadoEvaluacion;
  feedback: string;
}

export interface EvaluarRequest {
  puntuacion: number;
  feedback: string;
  resultado: ResultadoEvaluacion;
}
