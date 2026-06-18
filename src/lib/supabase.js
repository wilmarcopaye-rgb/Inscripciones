import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

let supabaseClient = null

/**
 * Valida que las credenciales de Supabase estén configuradas correctamente.
 */
export function validarConfiguracionSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      'Faltan credenciales de Supabase. En el archivo .env completa ' +
      'VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY, luego reinicia npm run dev.'
    )
  }

  if (!supabaseUrl.includes('supabase.co')) {
    return 'VITE_SUPABASE_URL no parece válida. Debe ser https://tu-proyecto.supabase.co'
  }

  if (!supabaseAnonKey.startsWith('eyJ')) {
    return (
      'VITE_SUPABASE_ANON_KEY no es válida. Usa la clave "anon public" (JWT) desde ' +
      'Supabase → Project Settings → API. No uses el ID del proyecto.'
    )
  }

  return null
}

function obtenerCliente() {
  const configError = validarConfiguracionSupabase()
  if (configError) {
    return { client: null, configError }
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return { client: supabaseClient, configError: null }
}

/**
 * Inserta una nueva inscripción sin devolver filas (evita SELECT implícito con RLS).
 */
export async function registrarInscripcion(payload) {
  const { client, configError } = obtenerCliente()

  if (configError) {
    return { data: null, error: { message: configError, code: 'CONFIG' } }
  }

  return client.from('inscripciones').insert([payload], { returning: 'minimal' })
}

/**
 * Detecta violación de unicidad (dni, matrícula o teléfono duplicado).
 */
export function esErrorDuplicado(error) {
  return error?.code === '23505'
}

/**
 * Traduce errores de Supabase a mensajes claros para el usuario.
 */
export function obtenerMensajeError(error) {
  if (error?.code === 'CONFIG') {
    return error.message
  }

  if (esErrorDuplicado(error)) {
    return 'Ya existe una inscripción con esos datos.'
  }

  if (error?.code === '42501') {
    return (
      'No se pudo guardar por permisos en la base de datos. ' +
      'Ejecuta supabase/migrations/002_grants_and_insert_policy.sql en Supabase.'
    )
  }

  const esNoAutorizado =
    error?.status === 401 ||
    error?.code === 'PGRST301' ||
    /jwt|invalid api key|unauthorized/i.test(error?.message ?? '')

  if (esNoAutorizado) {
    return (
      'Error de autenticación con Supabase. Revisa VITE_SUPABASE_ANON_KEY en .env ' +
      '(clave anon public que empieza con eyJ...) y reinicia npm run dev.'
    )
  }

  return null
}

export const supabaseConfigurado = !validarConfiguracionSupabase()
