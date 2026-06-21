/**
 * Validaciones del formulario de inscripción.
 */

const MENSAJES = {
  requerido: 'Este campo es obligatorio.',
  nombreCorto: 'Ingresa tu nombre completo (mínimo 3 caracteres).',
  nombreLargo: 'El nombre no puede superar 100 caracteres.',
  dniInvalido: 'El DNI debe tener exactamente 8 dígitos.',
  codigoCorto: 'El código debe tener al menos 5 caracteres.',
  codigoLargo: 'El código no puede superar 20 caracteres.',
  telefonoInvalido: 'El celular debe tener 9 dígitos numéricos.',
  carrera: 'Selecciona tu escuela profesional.',
  preferencia: 'Selecciona una opción de votación.',
}

export const PREFERENCIAS = {
  TODOS_JUNTOS: 'todos_juntos',
  SOMOS_ESTUDIANTIL: 'somos_estudiantil',
}

export const TIPOS_IDENTIFICACION = {
  DNI: 'dni',
  CODIGO_MATRICULA: 'codigoMatricula',
}

const TELEFONO_REGEX = /^\d{9}$/
const DNI_REGEX = /^\d{8}$/

export function validarFormulario(values, tipoIdentificacion = TIPOS_IDENTIFICACION.CODIGO_MATRICULA) {
  const errores = {}

  const nombre = values.nombre?.trim() ?? ''
  if (!nombre) {
    errores.nombre = MENSAJES.requerido
  } else if (nombre.length < 3) {
    errores.nombre = MENSAJES.nombreCorto
  } else if (nombre.length > 100) {
    errores.nombre = MENSAJES.nombreLargo
  }

  // Validar DNI solo si está seleccionado
  if (tipoIdentificacion === TIPOS_IDENTIFICACION.DNI) {
    const dni = values.dni?.trim() ?? ''
    if (!dni) {
      errores.dni = MENSAJES.requerido
    } else if (!DNI_REGEX.test(dni)) {
      errores.dni = MENSAJES.dniInvalido
    }
  }

  // Validar Código de Matrícula solo si está seleccionado
  if (tipoIdentificacion === TIPOS_IDENTIFICACION.CODIGO_MATRICULA) {
    const codigoMatricula = values.codigoMatricula?.trim() ?? ''
    if (!codigoMatricula) {
      errores.codigoMatricula = MENSAJES.requerido
    } else if (codigoMatricula.length < 5) {
      errores.codigoMatricula = MENSAJES.codigoCorto
    } else if (codigoMatricula.length > 20) {
      errores.codigoMatricula = MENSAJES.codigoLargo
    }
  }

  const telefono = values.telefono?.trim() ?? ''
  if (!telefono) {
    errores.telefono = MENSAJES.requerido
  } else if (!TELEFONO_REGEX.test(telefono)) {
    errores.telefono = MENSAJES.telefonoInvalido
  }

  const carrera = values.carrera?.trim() ?? ''
  if (!carrera) {
    errores.carrera = MENSAJES.carrera
  }

  if (!values.preferencia) {
    errores.preferencia = MENSAJES.preferencia
  }

  return errores
}

export function soloNumeros(value, maxLength) {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

function extraerDni(codigo) {
  const numeros = codigo.replace(/\D/g, '')
  if (numeros.length >= 8) return numeros.slice(0, 8)
  if (numeros.length > 0) return numeros.padStart(8, '0')
  return codigo.slice(0, 8).toUpperCase()
}

export function construirPayload(values, tipoIdentificacion = TIPOS_IDENTIFICACION.CODIGO_MATRICULA) {
  const esTodosJuntos = values.preferencia === PREFERENCIAS.TODOS_JUNTOS
  
  const payload = {
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    carrera: values.carrera.trim(),
    voto_todos_juntos: esTodosJuntos,
    voto_estudiantil: !esTodosJuntos,
  }
  
  // Incluir solo el tipo de identificación seleccionado
  if (tipoIdentificacion === TIPOS_IDENTIFICACION.DNI) {
    payload.dni = values.dni.trim()
    payload.codigo_matricula = '' // Enviar vacío
  } else {
    payload.dni = '' // Enviar vacío
    payload.codigo_matricula = values.codigoMatricula.trim()
  }

  return payload
}

export const ESTADO_INICIAL = {
  nombre: '',
  dni: '',
  codigoMatricula: '',
  telefono: '',
  carrera: '',
  preferencia: '',
}

