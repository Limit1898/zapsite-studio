import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const COPY: Record<string, { title: string; subtitle: string }> = {
  tr: {
    title: "🚀 Projelerimiz Yakında",
    subtitle: "Yakında burada en yeni çalışmalarımızı paylaşacağız.",
  },
  en: {
    title: "🚀 Our Work Coming Soon",
    subtitle: "We'll be sharing our latest work here very soon.",
  },
  ar: {
    title: "🚀 أعمالنا قريبًا",
    subtitle: "سنشارك أحدث مشاريعنا هنا قريبًا.",
  },
};

export const Portfolio = () => {
  const { lang } = useI18n();
  const c = COPY[lang] ?? COPY.en;

  return (
    <section id="work" className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16"
        >
          <div className="mx-auto h-16 w-16 rounded-2xl bg-cyan/10 grid place-items-center mb-6">
            <Rocket className="h-8 w-8 text-cyan" />
          </div>
          <h2 className="text-3xl md:text-5xl mb-4 leading-tight">{c.title}</h2>
          <p className="text-muted-foreground text-lg">{c.subtitle}</p>
        </motion.div>
      </div>
    </section>
  );
};
