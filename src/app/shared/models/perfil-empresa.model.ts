export type EstadoValidacion = 'PENDIENTE' | 'VALIDADA' | 'RECHAZADA';

export interface PerfilEmpresa {
  id: string;
  usuarioId: string;
  razonSocial: string;
  ruc: string;
  sector: string;
  estado: EstadoValidacion;
}

export interface CrearEmpresaRequest {
  razonSocial: string;
  ruc: string;
  sector: string;
}
