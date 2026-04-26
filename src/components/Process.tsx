import { motion } from "framer-motion";
import { Search, Palette, Code2, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Search, Palette, Code2, Rocket];

export const Process = () => {
  const { t } = useI18n();
  return (
    <section id="process" className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4">{t.process.title}</h2>
          <p className="text-muted-foreground text-lg">{t.process.subtitle}</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 start-[12.5%] end-[12.5%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {t.process.steps.map((s, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="relative mx-auto mb-6 h-24 w-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/30 to-gold/20 blur-xl" />
                    <div className="relative h-24 w-24 rounded-full glass-strong grid place-items-center border-2 border-cyan/30">
                      <Icon className="h-8 w-8 text-cyan" />
                    </div>
                    <span className="absolute -top-2 -end-2 h-8 w-8 rounded-full bg-gold text-background grid place-items-center font-display font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
