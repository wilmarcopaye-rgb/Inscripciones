// src/lib/validation.js
import { formatInTimeZone } from 'date-fns-tz';

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
};

export const PREFERENCIAS = {
  TODOS_JUNTOS: 'todos_juntos',
  SOMOS_ESTUDIANTIL: 'somos_estudiantil',
};

export const TIPOS_IDENTIFICACION = {
  DNI: 'dni',
  CODIGO_MATRICULA: 'codigoMatricula',
};

const TELEFONO_REGEX = /^\d{9}$/;
const DNI_REGEX = /^\d{8}$/;

export function validarFormulario(values, tipoIdentificacion = TIPOS_IDENTIFICACION.CODIGO_MATRICULA) {
  const errores = {};

  const nombre = values.nombre?.trim() ?? '';
  if (!nombre) {
    errores.nombre = MENSAJES.requerido;
  } else if (nombre.length < 3) {
    errores.nombre = MENSAJES.nombreCorto;
  } else if (nombre.length > 100) {
    errores.nombre = MENSAJES.nombreLargo;
  }

  if (tipoIdentificacion === TIPOS_IDENTIFICACION.DNI) {
    const dni = values.dni?.trim() ?? '';
    if (!dni) {
      errores.dni = MENSAJES.requerido;
    } else if (!DNI_REGEX.test(dni)) {
      errores.dni = MENSAJES.dniInvalido;
    }
  }

  if (tipoIdentificacion === TIPOS_IDENTIFICACION.CODIGO_MATRICULA) {
    const codigoMatricula = values.codigoMatricula?.trim() ?? '';
    if (!codigoMatricula) {
      errores.codigoMatricula = MENSAJES.requerido;
    } else if (codigoMatricula.length < 5) {
      errores.codigoMatricula = MENSAJES.codigoCorto;
    } else if (codigoMatricula.length > 20) {
      errores.codigoMatricula = MENSAJES.codigoLargo;
    }
  }

  const telefono = values.telefono?.trim() ?? '';
  if (!telefono) {
    errores.telefono = MENSAJES.requerido;
  } else if (!TELEFONO_REGEX.test(telefono)) {
    errores.telefono = MENSAJES.telefonoInvalido;
  }

  const carrera = values.carrera?.trim() ?? '';
  if (!carrera) {
    errores.carrera = MENSAJES.carrera;
  }

  if (!values.preferencia) {
    errores.preferencia = MENSAJES.preferencia;
  }

  return errores;
}

export function soloNumeros(value, maxLength) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function construirPayload(values, tipoIdentificacion = TIPOS_IDENTIFICACION.CODIGO_MATRICULA) {
  const esTodosJuntos = values.preferencia === PREFERENCIAS.TODOS_JUNTOS;

  // 📅 Fecha actual en zona horaria de Perú (UTC-5)
  const nowPeru = formatInTimeZone(new Date(), 'America/Lima', "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const payload = {
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    carrera: values.carrera.trim(),
    voto_todos_juntos: esTodosJuntos,
    voto_estudiantil: !esTodosJuntos,
    fecha_registro: nowPeru, // ✅ nombre correcto de la columna
  };

  if (tipoIdentificacion === TIPOS_IDENTIFICACION.DNI) {
    payload.dni = values.dni.trim();
    payload.codigo_matricula = null;
  } else {
    payload.dni = null;
    payload.codigo_matricula = values.codigoMatricula.trim();
  }

  return payload;
}

export const ESTADO_INICIAL = {
  nombre: '',
  dni: '',
  codigoMatricula: '',
  telefono: '',
  carrera: '',
  preferencia: '',
};