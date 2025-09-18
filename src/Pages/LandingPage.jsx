import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import About from "@/components/ui/About";
import Programs from "@/components/ui/Programs";
import FAQ from "@/components/ui/FAQ";
import Contact from "@/components/ui/Contact";
import Mitra from "@/Components/ui/Mitra";
import Footer from "@/components/ui/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Programs />
      <FAQ />
      <Contact />
      <Mitra /> 
      <Footer />
    </>
  );
}
