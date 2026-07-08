export interface ConsultaRetoResponse {
  respuesta: string;
}

export interface RecomendacionAprendizaje {
  tema: string;
  motivo: string;
  nivelSugerido: string;
}

export interface RecomendacionesResponse {
  recomendaciones: RecomendacionAprendizaje[];
}

export interface FeedbackSolucionResponse {
  feedback: string;
}
