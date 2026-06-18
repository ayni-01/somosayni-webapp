export interface MetricasEmpresa {
  empresaId: string;
  retosActivos: number;
  nuevasPostulaciones: number;
  talentosEvaluados: number;
  talentosAprobados: number;
}

export interface EmbudoReto {
  retoId: string;
  tituloReto: string;
  postulados: number;
  evaluados: number;
  aprobados: number;
  tasaConversion: number;
}
