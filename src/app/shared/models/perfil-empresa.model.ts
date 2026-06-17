export type EstadoValidacion = 'PENDIENTE' | 'VALIDADO' | 'RECHAZADO';

export interface PerfilEmpresa {
  id: string;
  usuarioId: string;
  razonSocial: string;
  ruc: string;
  logo: string | null;
  descripcion: string | null;
  sector: string;
  estadoValidacion: EstadoValidacion;
}

export interface CrearEmpresaRequest {
  razonSocial: string;
  ruc: string;
  sector: string;
}
