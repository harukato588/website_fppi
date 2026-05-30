import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import KetuaSection from "@/components/sections/KetuaSection";
import BeritaSection from "@/components/sections/BeritaSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <KetuaSection />
        <BeritaSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
