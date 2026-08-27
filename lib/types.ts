export type Rol = "adoptante" | "refugio";

export interface Perfil {
  id: string;
  nombre: string;
  rol: Rol;
  created_at: string;
}

export interface Mascota {
  id: string;
  refugio_id: string;
  nombre: string;
  especie: "perro" | "gato" | "otro";
  raza: string | null;
  edad_meses: number | null;
  descripcion: string;
  imagen_url: string | null;
  estado: "disponible" | "en_proceso" | "adoptado";
  created_at: string;
}

export interface SolicitudAdopcion {
  id: string;
  mascota_id: string;
  adoptante_id: string;
  mensaje: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  created_at: string;
}

// Tipos para las razas que trae la API externa (Dog CEO API)
export interface RazaPerro {
  raza: string;
  imagen: string;
}
