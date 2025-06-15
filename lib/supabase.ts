import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface Usuario {
  id: number
  nome: string
  email: string
  data_cadastro: string
}

export interface Filme {
  id: number
  titulo: string
  diretor: string
  ano_lancamento: string
  genero: string
  sinopse: string
  created_at: string
}

export interface Avaliacao {
  id: number
  filme_id: number
  usuario_id: number
  nota: number
  comentario: string
  data_avaliacao: string
  filmes?: Filme
  usuarios?: Usuario
}

export interface WatchlistItem {
  id: number
  filme_id: number
  usuario_id: number
  status: "Para Assistir" | "Assistindo" | "Assistido"
  prioridade: "Baixa" | "Média" | "Alta"
  notas?: string
  data_adicionado: string
  data_assistido?: string
  filmes?: Filme
  usuarios?: Usuario
}
