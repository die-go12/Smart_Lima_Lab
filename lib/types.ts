export type Categoria = "Movilidad" | "Salud" | "Seguridad" | "Medio ambiente";
export type Dificultad = "Básico" | "Intermedio" | "Avanzado";
export type Rol = "estudiante" | "mentor";

export type Challenge = {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string | null;
  dificultad: Dificultad | null;
  habilidades: string[];
  mentor: string | null;
  estado: "abierto" | "en_progreso" | "completado";
  estado_revision: "pendiente" | "aprobado" | "rechazado";
  guia_tecnica: string | null;
  propuesto_por: string | null;
  aprobado_por: string | null;
  creado_en: string;
};

export type Team = {
  id: string;
  challenge_id: string | null;
  nombre: string;
  titulo: string | null;
  descripcion: string | null;
  creado_por: string | null;
  estado: "en_progreso" | "completado";
  repo_url: string | null;
  visibilidad: "publico" | "privado";
  repo_publico: boolean;
  interdisciplinario: boolean;
  especialidades_busca: string | null;
  convocatoria_abierta: boolean;
  origen: "reto" | "proyecto_curso" | "proyecto_libre";
  mentor_id: string | null;
  creado_en: string;
};

export type Profile = {
  id: string;
  nombre: string | null;
  carrera: string | null;
  ciclo: number | null;
  bio: string | null;
  avatar_url: string | null;
  github_username: string | null;
  github_url: string | null;
  especialidad: string | null;
  rol: Rol;
  guia_vista: boolean;
};

export type Badge = {
  id: string;
  profile_id: string;
  nombre: string;
  codigo: string | null;
  challenge_id: string | null;
  fecha: string;
};

export type BadgeDef = {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  requisito: string | null;
  icono: string | null;
  orden: number;
};

export type Task = {
  id: string;
  team_id: string;
  titulo: string;
  estado: "pendiente" | "en_progreso" | "hecho";
  responsable: string | null;
};

export type TeamMember = {
  id: string;
  team_id: string;
  profile_id: string;
  rol: string;
  profiles: {
    nombre: string | null;
    github_username: string | null;
    avatar_url: string | null;
  } | null;
};

export type Aplicacion = {
  id: string;
  team_id: string;
  profile_id: string;
  mensaje: string | null;
  estado: "pendiente" | "aceptada" | "rechazada";
  creado_en: string;
  profiles: {
    nombre: string | null;
    github_username: string | null;
    avatar_url: string | null;
    especialidad: string | null;
  } | null;
};
