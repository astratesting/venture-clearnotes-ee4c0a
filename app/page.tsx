import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-soft-white">
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
