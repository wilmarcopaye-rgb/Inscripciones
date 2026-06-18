import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env y configura tus credenciales.',
  )
}

/**
 * Cliente Supabase con clave anon (pública).
 * RLS protege los datos; nunca uses service_role en el frontend.
 */
export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
)

/**
 * Inserta una nueva inscripción.
 * @returns {{ data, error }} resultado de Supabase
 */
export async function registrarInscripcion(payload) {
  // Sin .select(): RLS bloquea lectura pública; el panel admin la habilitará después.
  return supabase.from('inscripciones').insert([payload])
}

/**
 * Detecta violación de unicidad (dni, matrícula o teléfono duplicado).
 */
export function esErrorDuplicado(error) {
  return error?.code === '23505'
}
