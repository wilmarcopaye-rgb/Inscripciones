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

export default function Home() {
  // Cambia a true si quieres que el modal se abra al cargar la página
  const [showRegisterModal, setShowRegisterModal] = useState(true); // 👈 TRUE para que aparezca al inicio

  return (
    <div className="landing-page min-h-screen">
      <SplashScreen />
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
      <WhatsAppFloat />
    </div>
  );
}