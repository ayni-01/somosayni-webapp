export type TipoNotificacion = 'NUEVA_POSTULACION' | 'APROBADO' | 'RECHAZADO' | 'RETO_CERRADO';

export interface Notificacion {
  id: string;
  destinatarioId: string;
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
  fechaCreacion: string;
}

export interface CrearNotificacionRequest {
  destinatarioId: string;
  tipo: TipoNotificacion;
  mensaje: string;
}
