import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const COPY: Record<string, { title: string; subtitle: string; cta: string }> = {
  tr: {
    title: "⭐ İlk Müşterimiz Siz Olun / Be Our First Client",
    subtitle:
      "Yeni başlayan bir freelancer olarak ilk müşterilerime özel indirimli fiyatlar sunuyorum. Siz de bu fırsattan yararlanın! / As a new freelancer I am offering special discounted prices for my first clients. Take advantage of this opportunity!",
    cta: "Teklif Al / Get a Quote",
  },
  en: {
    title: "⭐ İlk Müşterimiz Siz Olun / Be Our First Client",
    subtitle:
      "Yeni başlayan bir freelancer olarak ilk müşterilerime özel indirimli fiyatlar sunuyorum. Siz de bu fırsattan yararlanın! / As a new freelancer I am offering special discounted prices for my first clients. Take advantage of this opportunity!",
    cta: "Teklif Al / Get a Quote",
  },
  ar: {
    title: "⭐ كن عميلنا الأول / Be Our First Client",
    subtitle:
      "بصفتي مستقلًا في بداية مشواري، أقدّم أسعارًا خاصة ومخفّضة لأوائل عملائي. اغتنم هذه الفرصة!",
    cta: "اطلب عرض السعر / Get a Quote",
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
