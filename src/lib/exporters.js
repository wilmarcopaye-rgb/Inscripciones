/**
 * Funciones para exportar datos a Excel.
 * Requiere la librería 'xlsx'
 */

import * as XLSX from 'xlsx'

/**
 * Exporta inscripciones a Excel (filtrado por fecha)
 */
export async function exportarInscripciones(supabase, fechaInicio, fechaFin) {
  try {
    let query = supabase.from('inscripciones').select('*')

    // Aplicar filtros de fecha si se proporcionan
    if (fechaInicio) {
      query = query.gte('fecha_registro', fechaInicio)
    }
    if (fechaFin) {
      // Agregar 1 día para incluir todo el día final
      const fechaFinAdjustada = new Date(fechaFin)
      fechaFinAdjustada.setDate(fechaFinAdjustada.getDate() + 1)
      query = query.lt('fecha_registro', fechaFinAdjustada.toISOString())
    }

    const { data, error } = await query.order('fecha_registro', { ascending: false })

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
export async function exportarComentarios(supabase) {
  try {
    const { data, error } = await supabase
      .from('comentarios')
      .select('*')
      .order('fecha_creacion', { ascending: false })

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
