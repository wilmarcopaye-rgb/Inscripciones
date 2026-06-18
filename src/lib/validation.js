/**
 * Validaciones del formulario de inscripción.
 */

const MENSAJES = {
  requerido: 'Este campo es obligatorio.',
  nombreCorto: 'Ingresa tu nombre completo (mínimo 3 caracteres).',
  nombreLargo: 'El nombre no puede superar 100 caracteres.',
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

  const codigo = values.codigo?.trim() ?? ''
  if (!codigo) {
    errores.codigo = MENSAJES.requerido
  } else if (codigo.length < 5) {
    errores.codigo = MENSAJES.codigoCorto
  } else if (codigo.length > 20) {
    errores.codigo = MENSAJES.codigoLargo
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

export function construirPayload(values) {
  const codigo = values.codigo.trim()
  const esTodosJuntos = values.preferencia === PREFERENCIAS.TODOS_JUNTOS

  return {
    nombre: values.nombre.trim(),
    dni: extraerDni(codigo),
    codigo_matricula: codigo,
    telefono: values.telefono.trim(),
    carrera: values.carrera.trim(),
    voto_todos_juntos: esTodosJuntos,
    voto_estudiantil: !esTodosJuntos,
  }
}

export const ESTADO_INICIAL = {
  nombre: '',
  codigo: '',
  telefono: '',
  carrera: '',
  preferencia: '',
}
