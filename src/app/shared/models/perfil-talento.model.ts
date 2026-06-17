export interface PerfilTalento {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  ubicacion: string | null;
  sobreMi: string | null;
}

export interface CrearTalentoRequest {
  nombreCompleto: string;
}

export interface EditarTalentoRequest {
  nombreCompleto: string;
  ubicacion: string | null;
  sobreMi: string | null;
}

export interface Cv {
  talentoId: string;
  contenido: string;
  generadoEn: string;
}
