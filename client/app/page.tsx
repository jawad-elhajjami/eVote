import Features from "@/components/Features"
import Header from "@/components/Header"
import TechStack from "@/components/TechStack"
import AcademicContext from "@/components/AcademicContext"
import CallToAction from "@/components/CallToAction"
import Footer from "@/components/Footer"
import HowItWorks from "@/components/HowItWorks"
import HeroSection from "@/components/HeroSection"

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
