export type TipoNotificacion = 'APROBADO' | 'RECHAZADO' | 'NUEVO_RETO' | 'POSTULACION' | 'INSIGNIA' | 'SISTEMA';

export interface Notificacion {
  id: string;
  destinatarioId: string;
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
  creadaEn: string;
}

export interface CrearNotificacionRequest {
  destinatarioId: string;
  tipo: TipoNotificacion;
  mensaje: string;
}
