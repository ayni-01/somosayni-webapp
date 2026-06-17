export interface Educacion {
  institucion: string;
  titulo: string;
  desde: string;
  hasta: string | null;
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  desde: string;
  hasta: string | null;
  descripcion: string;
}

export interface PerfilTalento {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  bio: string;
  educacion: Educacion[];
  experiencia: Experiencia[];
  portafolioUrl: string | null;
}

export interface Cv {
  talentoId: string;
  contenido: string;
  generadoEn: string;
}
