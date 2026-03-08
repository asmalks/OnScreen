import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const Landing = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <Pricing />
    <Footer />
  </div>
);

export default Landing;
