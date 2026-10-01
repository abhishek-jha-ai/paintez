import { About } from "@/components/About";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { Process } from "@/components/Process";
import { ProjectGallery } from "@/components/ProjectGallery";
import { QuoteSection } from "@/components/QuoteSection";
import { Services } from "@/components/Services";
import { StructuredData } from "@/components/StructuredData";
import { TrustBar } from "@/components/TrustBar";
import { TrustFeatures } from "@/components/TrustFeatures";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-navy-950 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <Services />
        <BeforeAfter />
        <QuoteSection />
        <TrustFeatures />
        <ProjectGallery />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
      <MobileStickyCTA />
      <StructuredData />
    </>
  );
}
