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
  // Supabase devuelve code '23505' (PostgreSQL) o status 409 (HTTP) para duplicados
  return error?.code === '23505' || error?.status === 409
}

/**
 * Traduce errores de Supabase a mensajes claros para el usuario.
 */
export function obtenerMensajeError(error) {
  if (error?.code === 'CONFIG') {
    return error.message
  }

  if (esErrorDuplicado(error)) {
    const detalle = error?.details ?? ''
    if (/dni/i.test(detalle))              return 'Ya existe una inscripción con ese DNI.'
    if (/telefono|phone/i.test(detalle))   return 'Ya existe una inscripción con ese teléfono.'
    if (/matricula|codigo/i.test(detalle)) return 'Ya existe una inscripción con ese código de matrícula.'
    return 'Ya existe una inscripción con esos datos. Verifica tu DNI, matrícula o teléfono.'
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
 * Consulta el local y mesa de votación de un estudiante.
 * Consulta directa a mesas_estudiantes — sin RPC, sin cambios en BD.
 * Intenta también obtener datos personales de inscripciones (opcional).
 */
export async function consultarLocalVotacion(codigoMatricula) {
  const { client, configError } = obtenerCliente()

  if (configError) {
    return { data: null, error: { message: configError } }
  }

  const codigo = codigoMatricula.trim()

  try {
    // 1. Buscar mesa asignada en mesas_estudiantes
    const { data: mesaData, error: mesaError } = await client
      .from('mesas_estudiantes')
      .select('mesa, posicion, local_votacion, codigo')
      .eq('codigo', codigo)
      .limit(1)

    if (mesaError) {
      console.error('Error consultando mesas_estudiantes:', mesaError)
      return { data: null, error: mesaError }
    }

    if (!mesaData || mesaData.length === 0) {
      // 1.5. Si no está en mesas_estudiantes, puede ser de Postgrado
      try {
        const campos = 'nro_dni, apellido_paterno, apellido_materno, nombres, programa_academico'
        let { data: estData } = await client
          .from('estudiantes')
          .select(campos)
          .eq('nro_matricula', codigo)
          .limit(1)

        if (!estData || estData.length === 0) {
          ;({ data: estData } = await client
            .from('estudiantes')
            .select(campos)
            .ilike('nro_matricula', `%${codigo}`)
            .limit(1))
        }

        if (!estData || estData.length === 0) {
          ;({ data: estData } = await client
            .from('estudiantes')
            .select(campos)
            .ilike('nro_matricula', `%${codigo}%`)
            .limit(1))
        }

        if (estData && estData.length > 0) {
          const e = estData[0]
          const prog = (e.programa_academico ?? '').toUpperCase()
          
          // Si es estudiante de postgrado (carrera contiene POSTGRADO)
          if (prog.includes('POSTGRADO')) {
            const alumnoNombre  = `${e.apellido_paterno} ${e.apellido_materno}, ${e.nombres}`
            const alumnoDni     = e.nro_dni            ?? null
            const alumnoCarrera = e.programa_academico ?? null

            return {
              data: [{
                alumno_nombre:  alumnoNombre,
                alumno_dni:     alumnoDni,
                alumno_carrera: alumnoCarrera,
                mesa:           'Especial', // Mesa especial para postgrado
                posicion:       '-',
                local_votacion: 'ING ECONOMICA', // Asignado a Ingeniería Económica
              }],
              error: null,
            }
          }
        }
      } catch (err) {
        console.warn('Error buscando fallback de postgrado:', err)
      }

      return { data: [], error: null }
    }

    const fila = mesaData[0]

    // 2. Buscar datos personales en la tabla estudiantes por nro_matricula
    //    El codigo de 6 dígitos puede ser parte del nro_matricula completo,
    //    así que probamos en cascada: exacto → sufijo → contiene
    let alumnoNombre  = null
    let alumnoDni     = null
    let alumnoCarrera = null

    try {
      const campos = 'nro_dni, apellido_paterno, apellido_materno, nombres, programa_academico'

      // Intento 1: coincidencia exacta
      let { data: estData } = await client
        .from('estudiantes')
        .select(campos)
        .eq('nro_matricula', codigo)
        .limit(1)

      // Intento 2: el código es sufijo del nro_matricula (ej: 2021 + 214996)
      if (!estData || estData.length === 0) {
        ;({ data: estData } = await client
          .from('estudiantes')
          .select(campos)
          .ilike('nro_matricula', `%${codigo}`)
          .limit(1))
      }

      // Intento 3: el código aparece en cualquier parte del nro_matricula
      if (!estData || estData.length === 0) {
        ;({ data: estData } = await client
          .from('estudiantes')
          .select(campos)
          .ilike('nro_matricula', `%${codigo}%`)
          .limit(1))
      }

      if (estData && estData.length > 0) {
        const e = estData[0]
        // Nombre completo: APELLIDO PATERNO APELLIDO MATERNO, Nombres
        alumnoNombre  = `${e.apellido_paterno} ${e.apellido_materno}, ${e.nombres}`
        alumnoDni     = e.nro_dni            ?? null
        alumnoCarrera = e.programa_academico ?? null
      }
    } catch (err) {
      console.warn('No se pudo obtener datos de estudiantes:', err)
    }


    // 3. Devolver en el formato que espera el componente
    return {
      data: [{
        alumno_nombre:  alumnoNombre,
        alumno_dni:     alumnoDni,
        alumno_carrera: alumnoCarrera,
        mesa:           fila.mesa,
        posicion:       fila.posicion,
        local_votacion: fila.local_votacion,
      }],
      error: null,
    }
  } catch (err) {
    console.error('Error al consultar local de votación:', err)
    return { data: null, error: { message: 'Error inesperado al consultar.' } }
  }
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
