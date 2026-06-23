/**
 * Funciones para exportar datos a Excel.
 * Requiere la librería 'xlsx'
 */

import * as XLSX from 'xlsx'

/**
 * Exporta inscripciones a Excel (filtrado por fecha)
 */
export async function exportarInscripciones(supabase, usuario, contrasena, fechaInicio, fechaFin) {
  try {
    const { data, error } = await supabase.rpc('obtener_inscripciones_admin', {
      p_usuario: usuario,
      p_contrasena: contrasena,
      p_fecha_inicio: fechaInicio || null,
      p_fecha_fin: fechaFin || null,
    })

    if (error) {
      throw error
    }

    // Formatear datos para Excel
    const datosFormateados = data.map((inscripcion) => ({
      ID: inscripcion.id,
      Nombre: inscripcion.nombre,
      DNI: inscripcion.dni,
      'Código de Matrícula': inscripcion.codigo_matricula,
      Teléfono: inscripcion.telefono,
      Carrera: inscripcion.carrera,
      'Voto Todos Juntos': inscripcion.voto_todos_juntos ? 'Sí' : 'No',
      'Voto Estudiantil': inscripcion.voto_estudiantil ? 'Sí' : 'No',
      'Fecha de Registro': new Date(inscripcion.fecha_registro).toLocaleString('es-PE'),
    }))

    // Crear workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(datosFormateados)

    // Ajustar ancho de columnas
    const maxWidth = 20
    ws['!cols'] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Inscripciones')

    // Generar nombre de archivo con fecha
    const ahora = new Date()
    const nombreArchivo = `inscripciones_${ahora.toISOString().split('T')[0]}.xlsx`

    XLSX.writeFile(wb, nombreArchivo)
    return { success: true, message: `Se exportó ${datosFormateados.length} inscripciones` }
  } catch (err) {
    console.error('Error al exportar inscripciones:', err)
    throw err
  }
}

/**
 * Exporta comentarios a Excel
 */
export async function exportarComentarios(supabase, usuario, contrasena) {
  try {
    const { data, error } = await supabase.rpc('obtener_comentarios_admin', {
      p_usuario: usuario,
      p_contrasena: contrasena,
    })

    if (error) {
      throw error
    }

    // Formatear datos para Excel
    const datosFormateados = data.map((comentario) => ({
      ID: comentario.id,
      'ID Inscripción': comentario.inscripcion_id,
      Usuario: comentario.nombre_inscrito,
      Comentario: comentario.comentario,
      'Fecha': new Date(comentario.fecha_creacion).toLocaleString('es-PE'),
    }))

    // Crear workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(datosFormateados)

    // Ajustar ancho de columnas
    ws['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 50 }, { wch: 20 }]

    XLSX.utils.book_append_sheet(wb, ws, 'Comentarios')

    // Generar nombre de archivo con fecha
    const ahora = new Date()
    const nombreArchivo = `comentarios_${ahora.toISOString().split('T')[0]}.xlsx`

    XLSX.writeFile(wb, nombreArchivo)
    return { success: true, message: `Se exportó ${datosFormateados.length} comentarios` }
  } catch (err) {
    console.error('Error al exportar comentarios:', err)
    throw err
  }
}
