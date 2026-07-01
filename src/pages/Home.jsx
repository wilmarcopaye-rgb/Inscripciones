import { useState } from 'react';
import Topbar from '../components/landing/Topbar';
import HeroSection from '../components/landing/HeroSection';
import PresentationSection from '../components/landing/PresentationSection';
import PurposeSection from '../components/landing/PurposeSection';
import PillarsSection from '../components/landing/PillarsSection';
import SumateSection from '../components/landing/SumateSection';
import RegisterModal from '../components/landing/RegisterModal';
import LandingFooter from '../components/landing/LandingFooter';
import WhatsAppFloat from '../components/landing/WhatsAppFloat';
import SplashScreen from '../components/landing/SplashScreen';
import WalkingPenguin from '../components/landing/WalkingPenguin';
import VotacionFloat from '../components/landing/VotacionFloat';

export default function Home() {
  const [showVotacionModal, setShowVotacionModal] = useState(true); // 👈 Abre consulta de votación al inicio
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="landing-page min-h-screen">
      <SplashScreen />
      {/* El botón del Topbar abre la consulta de votación */}
      <Topbar onOpenRegister={() => setShowVotacionModal(true)} />
      <main>
        {/* Los botones debajo del Topbar (Hero y Súmate) abren la inscripción */}
        <HeroSection onOpenRegister={() => setShowRegisterModal(true)} />
        <PresentationSection />
        <PurposeSection />
        <PillarsSection />
        <SumateSection onOpenRegister={() => setShowRegisterModal(true)} />
      </main>
      <LandingFooter />
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <WhatsAppFloat />
      <VotacionFloat isOpen={showVotacionModal} onClose={() => setShowVotacionModal(false)} />
      <WalkingPenguin />
    </div>
  );
}