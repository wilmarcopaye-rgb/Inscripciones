import Topbar from '../components/landing/Topbar'
import HeroSection from '../components/landing/HeroSection'
import PurposeSection from '../components/landing/PurposeSection'
import PillarsSection from '../components/landing/PillarsSection'
import SumateSection from '../components/landing/SumateSection'
import LandingFooter from '../components/landing/LandingFooter'

export default function Home() {
  return (
    <div className="landing-page min-h-screen">
      <Topbar />
      <main>
        <HeroSection />
        <PurposeSection />
        <PillarsSection />
        <SumateSection />
      </main>
      <LandingFooter />
    </div>
  )
}
