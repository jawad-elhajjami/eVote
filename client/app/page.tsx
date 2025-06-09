import Features from "@/components/LandingPage/Features"
import Header from "@/components/LandingPage/Header"
import TechStack from "@/components/LandingPage/TechStack"
import AcademicContext from "@/components/LandingPage/AcademicContext"
import CallToAction from "@/components/LandingPage/CallToAction"
import Footer from "@/components/LandingPage/Footer"
import HowItWorks from "@/components/LandingPage/HowItWorks"
import HeroSection from "@/components/LandingPage/HeroSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* How it Works Section */}
      <HowItWorks />

      {/* Technology Stack */}
      <TechStack />

      {/* Academic Context */}
      <AcademicContext />

      {/* CTA Section */}
      <CallToAction />

      {/* Footer */}
      <Footer />
      
    </div>
  )
}
