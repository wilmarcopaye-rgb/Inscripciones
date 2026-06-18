/**
 * Validaciones del formulario de inscripción.
 * Mensajes amigables en español para el usuario.
 */

const MENSAJES = {
  requerido: 'Este campo es obligatorio.',
  nombreCorto: 'Ingresa tu nombre completo (mínimo 3 caracteres).',
  nombreLargo: 'El nombre no puede superar 100 caracteres.',
  dniInvalido: 'El DNI debe tener exactamente 8 dígitos numéricos.',
  matriculaCorta: 'El código de matrícula debe tener al menos 5 caracteres.',
  matriculaLarga: 'El código de matrícula no puede superar 20 caracteres.',
  telefonoInvalido: 'El celular debe tener 9 dígitos numéricos.',
  carreraCorta: 'Indica tu carrera (mínimo 2 caracteres).',
  carreraLarga: 'La carrera no puede superar 100 caracteres.',
  preferencia: 'Selecciona una preferencia de lista.',
}

export const PREFERENCIAS = {
  TODOS_JUNTOS: 'todos_juntos',
  SOMOS_ESTUDIANTIL: 'somos_estudiantil',
}

export const CARRERAS_SUGERIDAS = [
  'Administración',
  'Contabilidad',
  'Derecho',
  'Educación',
  'Enfermería',
  'Ingeniería Civil',
  'Ingeniería de Sistemas',
  'Medicina',
  'Psicología',
  'Otra',
]

const DNI_REGEX = /^\d{8}$/
const TELEFONO_REGEX = /^\d{9}$/

export function validarFormulario(values) {
  const errores = {}

  const nombre = values.nombre?.trim() ?? ''
  if (!nombre) {
    errores.nombre = MENSAJES.requerido
  } else if (nombre.length < 3) {
    errores.nombre = MENSAJES.nombreCorto
  } else if (nombre.length > 100) {
    errores.nombre = MENSAJES.nombreLargo
  }

  const dni = values.dni?.trim() ?? ''
  if (!dni) {
    errores.dni = MENSAJES.requerido
  } else if (!DNI_REGEX.test(dni)) {
    errores.dni = MENSAJES.dniInvalido
  }

  const codigoMatricula = values.codigo_matricula?.trim() ?? ''
  if (!codigoMatricula) {
    errores.codigo_matricula = MENSAJES.requerido
  } else if (codigoMatricula.length < 5) {
    errores.codigo_matricula = MENSAJES.matriculaCorta
  } else if (codigoMatricula.length > 20) {
    errores.codigo_matricula = MENSAJES.matriculaLarga
  }

  const telefono = values.telefono?.trim() ?? ''
  if (!telefono) {
    errores.telefono = MENSAJES.requerido
  } else if (!TELEFONO_REGEX.test(telefono)) {
    errores.telefono = MENSAJES.telefonoInvalido
  }

  const carrera = values.carrera?.trim() ?? ''
  if (!carrera) {
    errores.carrera = MENSAJES.requerido
  } else if (carrera.length < 2) {
    errores.carrera = MENSAJES.carreraCorta
  } else if (carrera.length > 100) {
    errores.carrera = MENSAJES.carreraLarga
  }

  if (!values.preferencia) {
    errores.preferencia = MENSAJES.preferencia
  }

  return errores
}

/**
 * Filtra entrada numérica en tiempo real.
 */
export function soloNumeros(value, maxLength) {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

/**
 * Construye el payload para Supabase a partir del formulario.
 */
export function construirPayload(values) {
  const esTodosJuntos = values.preferencia === PREFERENCIAS.TODOS_JUNTOS

  return {
    nombre: values.nombre.trim(),
    dni: values.dni.trim(),
    codigo_matricula: values.codigo_matricula.trim(),
    telefono: values.telefono.trim(),
    carrera: values.carrera.trim(),
    voto_todos_juntos: esTodosJuntos,
    voto_estudiantil: !esTodosJuntos,
  }
}

export const ESTADO_INICIAL = {
  nombre: '',
  dni: '',
  codigo_matricula: '',
  telefono: '',
  carrera: '',
  preferencia: '',
}
