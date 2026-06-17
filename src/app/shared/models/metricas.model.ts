export interface MetricasEmpresa {
  empresaId: string;
  retosActivos: number;
  postulacionesRecibidas: number;
  talentosAprobados: number;
  tasaConversion: number;
}

export interface EmbudoReto {
  retoId: string;
  titulo: string;
  postulacionesTotal: number;
  aprobadas: number;
  rechazadas: number;
}
