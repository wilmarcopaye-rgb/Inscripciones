import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

let supabaseClient = null

/**
 * Acepta clave anon legacy (JWT eyJ...) y clave publishable nueva (sb_publishable_...).
 */
function esClavePublicaValida(key) {
  if (key.startsWith('eyJ')) {
    return key.length > 100
  }

  if (key.startsWith('sb_publishable_')) {
    return key.length > 20
  }

  return false
}

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

  if (!esClavePublicaValida(supabaseAnonKey)) {
    return (
      'VITE_SUPABASE_ANON_KEY no es válida. Usa la clave "anon public" o "publishable" ' +
      'desde Supabase → Project Settings → API. No uses el ID del proyecto.'
    )
  }

  return null
}

export function estaSupabaseConfigurado() {
  return !validarConfiguracionSupabase()
}

/** Alias de compatibilidad (evita errores con HMR/caché antigua). */
export const supabaseConfigurado = estaSupabaseConfigurado

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
 * Inserta una nueva inscripción y devuelve el id.
 */
export async function registrarInscripcion(payload) {
  const { client, configError } = obtenerCliente()

  if (configError) {
    return { data: null, error: { message: configError, code: 'CONFIG' }, id: null }
  }

  const { data, error } = await client
    .from('inscripciones')
    .insert([payload])
    .select('id')

  console.log('supabase.insert response:', { data, error })

  if (error) {
    console.error('Error en insert:', error)
    return { data, error, id: null }
  }

  // Extraer el id del primer registro insertado
  const id = data && data.length > 0 ? data[0].id : null
  console.log('ID extraído de data:', id)

  return { data, error: null, id }
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
      'y reinicia npm run dev.'
    )
  }

  return null
}

/**
 * Obtiene el cliente de Supabase para operaciones directas.
 */
export function obtenerSupabase() {
  const { client } = obtenerCliente()
  return client
}

/**
 * Valida credenciales del admin contra la base de datos.
 */
export async function validarAdminCredenciales(usuario, contrasena) {
  const { client, configError } = obtenerCliente()

  if (configError) {
    return { valido: false, error: 'Error de configuración de Supabase' }
  }

  try {
    const { data: valido, error } = await client
      .rpc('verificar_admin', {
        p_usuario: usuario,
        p_contrasena: contrasena,
      })

    if (error) {
      console.error('Error rpc verificar_admin:', error)
      return { valido: false, error: 'Usuario o contraseña incorrectos' }
    }

    if (valido) {
      return { valido: true, usuario }
    } else {
      return { valido: false, error: 'Usuario o contraseña incorrectos' }
    }
  } catch (err) {
    console.error('Error al validar credenciales:', err)
    return { valido: false, error: 'Error al validar credenciales' }
  }
}
