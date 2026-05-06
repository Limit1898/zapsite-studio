import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { ZapBackground } from "./ZapBackground";
import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  const { t, lang } = useI18n();
  const isArabic = lang === "ar";

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <ZapBackground />
        <div className="absolute inset-0 bg-background/30 pointer-events-none" />
      </div>

      <div className="container-x relative z-10 px-6 md:px-10 pt-32 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-cyan mb-8">
            <Sparkles className="h-3.5 w-3.5" /> {t.hero.tagline}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-6">
            {t.hero.title.split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.6 }}
                className="inline-block me-3"
              >
                {i === 2 || i === 3 ? <span className="text-gradient italic">{w}</span> : w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              onClick={() => scrollTo("#work")}
              className="bg-cyan text-background hover:bg-cyan/90 font-semibold rounded-full px-7 h-12 text-base group glow-cyan"
            >
              {t.hero.cta1}
              <ArrowRight className="ms-2 h-4 w-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </Button>
            <Button
              onClick={() => scrollTo("#contact")}
              variant="outline"
              className="border-white/20 bg-transparent hover:bg-white/5 rounded-full px-7 h-12 text-base"
            >
              {t.hero.cta2}
            </Button>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={() => scrollTo("#types")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-cyan transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">{t.hero.scroll}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};
