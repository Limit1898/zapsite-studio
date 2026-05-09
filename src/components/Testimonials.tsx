import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const COPY: Record<string, { title: string; subtitle: string; cta: string }> = {
  tr: {
    title: "⚡ Sınırlı Süre Teklifi",
    subtitle:
      "Her ölçekteki işletme için hızlı, uygun fiyatlı ve profesyonel web siteleri üretiyoruz. Sınırlı kontenjan — hemen yerinizi ayırtın!",
    cta: "Teklif Al",
  },
  en: {
    title: "⚡ Limited Time Offer",
    subtitle:
      "We build fast, affordable and professional websites for businesses of all sizes. Get your website today at an unbeatable price — limited spots available!",
    cta: "Get a Quote",
  },
  ar: {
    title: "⚡ عرض لفترة محدودة",
    subtitle:
      "نبني مواقع إلكترونية سريعة واحترافية وبأسعار مناسبة لجميع الأعمال. أماكن محدودة — احجز موقعك الآن!",
    cta: "اطلب عرض السعر",
  },
};

export const Testimonials = () => {
  const { lang } = useI18n();
  const c = COPY[lang] ?? COPY.en;

  const scrollContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16"
        >
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gold/10 grid place-items-center mb-6">
            <Star className="h-8 w-8 text-gold fill-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl mb-5 leading-tight">{c.title}</h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
            {c.subtitle}
          </p>
          <Button
            onClick={scrollContact}
            className="bg-cyan text-background hover:bg-cyan/90 rounded-full h-12 px-8 font-semibold glow-cyan"
          >
            {c.cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
