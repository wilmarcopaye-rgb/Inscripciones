import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Proposals from './components/Proposals'
import RegistrationForm from './components/RegistrationForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Proposals />

        <section id="inscripcion" className="py-20 sm:py-28">
          <div className="section-container">
            <div className="mx-auto max-w-2xl">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                  Inscripción
                </p>
                <h2 className="section-title mt-2">Únete al movimiento</h2>
                <p className="section-subtitle mx-auto">
                  Completa el formulario con tus datos. El proceso es rápido, seguro y toma
                  menos de un minuto.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
