export default function PresentationSection() {
  const propuestas_principales = [
    {
      numero: '01',
      titulo: 'EDUCACIÓN DE CALIDAD',
      descripcion:
        'Acreditación al 100% de los programas académicos, residencia universitaria, implementación de mobiliario ergonómico.',
    },
    {
      numero: '02',
      titulo: 'BIENESTAR Y SALUD',
      descripcion:
        'Impulsar programas de salud física (Gym), mental y emocional con espacios de acompañamiento estudiantil, comedor universitario con servicio de (desayuno, almuerzo y cena).',
    },
    {
      numero: '03',
      titulo: 'INCLUSIÓN Y RESPETO',
      descripcion:
        'Fomentar un smart campus inclusivo 24/7, seguro y libre de discriminación para todos.',
    },
    {
      numero: '04',
      titulo: 'DEPORTE Y CULTURA',
      descripcion:
        'Apoyar actividades culturales, artísticas y deportivas que fortalezcan la vida universitaria, con espacios adecuados.',
    },
  ]

  const propuestas_areas = [
    {
      area: 'INGENIERÍAS',
      propuestas: [
        'Equipamiento de laboratorios modernos de especialidad.',
        'Hub de infraestructura de innovación para estudio y trabajo colaborativo.',
        'Programa de empleabilidad e inserción laboral efectiva con empresas públicas y privadas.',
      ],
    },
    {
      area: 'BIOMÉDICAS',
      propuestas: [
        'Implementación de laboratorios clínicos y de formación.',
        'Prácticas clínicas en los hospitales universitarios y convenios con clínicas y empresas.',
        'Implementación del programa de bienestar y salud mental estudiantil.',
      ],
    },
    {
      area: 'SOCIALES',
      propuestas: [
        'Implementación de espacios de debate académico y de investigación.',
        'Talleres de liderazgo, oratoria y emprendimiento social.',
        'Implementación del voluntariado universitario con subvenciones para estudiantes.',
      ],
    },
    {
      area: 'EMPRESARIALES',
      propuestas: [
        'Fortalecimiento de la incubadora de empresas y vinculación empresarial.',
        'Capacitación en softskills para estudiantes y por los estudiantes.',
        'Bolsa de empleo estudiantil y ferias laborales de inserción.',
      ],
    },
  ]

  const directivos = [
    {
      nombre: 'Dr. Charles Mendoza',
      cargo: 'RECTOR',
    },
    {
      nombre: 'Dr. Efraín Yupanqui',
      cargo: 'Vicerrector Académico',
    },
    {
      nombre: 'Dr. Bernardo Roque',
      cargo: 'Vicerrector de Investigación',
    },
  ]

  return (
    <section id="propuestas" className="landing-presentation">
      {/* Parte superior: Presentación y Logo */}
      <div className="landing-shell">
        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Columna izquierda: Contenido textual */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <p className="landing-eyebrow mb-6">Movimiento estudiantil</p>
              <h2 className="font-bebas text-4xl md:text-5xl tracking-wider text-white mb-4">
                TODOS JUNTOS
                <br />
                POR LA UNA
              </h2>
              <p className="font-bebas text-lg text-yellow-400 mb-6 tracking-widest">
                Transparencia • Innovación • Honestidad
              </p>
            </div>

            {/* Directivos */}
            <div className="mb-8 space-y-3 border-l-2 border-yellow-400 pl-4">
              {directivos.map((dir, idx) => (
                <div key={idx}>
                  <p className="font-bebas text-lg text-yellow-400">{dir.nombre}</p>
                  <p className="font-poppins text-sm text-white/70">{dir.cargo}</p>
                </div>
              ))}
            </div>

            <p className="font-poppins text-white/80 leading-relaxed mb-6">
              Así como en nuestras comunidades el trabajo se hace con Minka, la universidad debe
              construirse con participación y transparencia.
            </p>

            <div className="inline-flex items-center gap-2 rounded-lg bg-yellow-400/20 px-4 py-2 w-fit border border-yellow-400/40">
              <span className="font-bebas text-lg text-yellow-400">¡LO QUE SE DICE SE CUMPLE!</span>
            </div>
          </div>

          {/* Columna derecha: Imagen/Espacio para foto del partido */}
          <div className="relative">
            <div
              className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-yellow-400/40 flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Aquí irá la foto del partido - placeholder */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-yellow-400/20 p-6 border-2 border-yellow-400/40">
                    <svg
                      className="h-16 w-16 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="font-poppins text-sm text-white/50 mb-2">Espacio para foto</p>
                <p className="font-poppins text-xs text-white/40">del movimiento estudiantil</p>
              </div>

              {/* Elemento decorativo */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background:
                    'radial-gradient(circle at 100% 0%, rgba(234, 179, 8, 0.3) 0%, transparent 70%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Propuestas principales */}
      <div className="landing-shell mb-16">
        <h3 className="font-bebas text-3xl text-white mb-10 tracking-wide">Propuestas principales</h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {propuestas_principales.map((prop, idx) => (
            <div
              key={idx}
              className="rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:bg-white/5"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div className="mb-4">
                <span className="font-bebas text-4xl text-yellow-400 leading-none">
                  {prop.numero}
                </span>
              </div>
              <h4 className="font-bebas text-lg text-white mb-3 tracking-wider leading-tight">
                {prop.titulo}
              </h4>
              <p className="font-poppins text-sm text-white/70 leading-relaxed">
                {prop.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Propuestas por áreas */}
      <div className="landing-shell">
        <h3 className="font-bebas text-3xl text-white mb-10 tracking-wide">Propuestas por áreas</h3>

        <div className="grid gap-8 md:grid-cols-2">
          {propuestas_areas.map((area, idx) => (
            <div
              key={idx}
              className="rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <h4 className="font-bebas text-xl text-yellow-400 mb-4 tracking-wider uppercase">
                {area.area}
              </h4>
              <ul className="space-y-3">
                {area.propuestas.map((prop, pIdx) => (
                  <li key={pIdx} className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    </div>
                    <span className="font-poppins text-sm text-white/80 leading-relaxed">
                      {prop}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer de la sección */}
      <div className="landing-shell mt-16 py-8 border-t border-white/10">
        <div className="text-center space-y-4">
          <p className="font-poppins text-sm text-white/70">
            Por un smart campus y gestión universitaria cero papel.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <p className="font-bebas text-2xl text-white">Este 2 de Julio Vota por:</p>
            <div className="flex items-center gap-4">
              <span className="font-bebas text-sm text-white/70">(Logo "TODOS JUNTOS POR LA UNA")</span>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-yellow-400 bg-yellow-400/10">
                <span className="font-bebas text-2xl text-yellow-400">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .landing-presentation {
          position: relative;
          color: var(--on-navy);
          padding: 80px 0;
          background: radial-gradient(120% 90% at 85% -10%, rgba(159, 211, 242, 0.1), transparent 60%),
                      linear-gradient(165deg, var(--navy) 0%, #0c243f 70%, #081a30 100%);
        }

        @media (max-width: 768px) {
          .landing-presentation {
            padding: 60px 0;
          }
        }
      `}</style>
    </section>
  )
}
