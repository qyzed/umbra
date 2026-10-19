import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { WebAppPreview } from "@/components/WebAppPreview";
import { Creator } from "@/components/Creator";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <WebAppPreview />
      <Creator />
      <Faq />
      <Footer />
    </main>
  );
}
