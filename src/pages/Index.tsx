import { useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WebsiteTypes } from "@/components/WebsiteTypes";
import { Pricing } from "@/components/Pricing";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { I18nProvider, useI18n } from "@/lib/i18n";

const Page = () => {
  const { dir } = useI18n();
  const pricingRef = useRef<HTMLElement>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const selectPlan = (plan: string) => {
    setHighlight(plan);
    setTimeout(() => {
      document.getElementById(`plan-${plan}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    window.setTimeout(() => setHighlight(null), 2500);
  };

  const scrollContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <WebsiteTypes onSelect={selectPlan} />
        <Pricing ref={pricingRef} highlighted={highlight} onContact={scrollContact} />
        <Portfolio />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const Index = () => (
  <I18nProvider>
    <Page />
  </I18nProvider>
);

export default Index;
