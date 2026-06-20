import { useState } from 'react'
import Topbar from '../components/landing/Topbar'
import HeroSection from '../components/landing/HeroSection'
import PresentationSection from '../components/landing/PresentationSection'
import PurposeSection from '../components/landing/PurposeSection'
import PillarsSection from '../components/landing/PillarsSection'
import SumateSection from '../components/landing/SumateSection'
import RegisterModal from '../components/landing/RegisterModal'
import LandingFooter from '../components/landing/LandingFooter'

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(true)

  return (
    <div className="landing-page min-h-screen">
      <Topbar onOpenRegister={() => setShowRegisterModal(true)} />
      <main>
        <HeroSection onOpenRegister={() => setShowRegisterModal(true)} />
        <PresentationSection />
        <PurposeSection />
        <PillarsSection />
        <SumateSection onOpenRegister={() => setShowRegisterModal(true)} />
      </main>
      <LandingFooter />
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </div>
  )
}
