import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const palette = [
  "from-cyan/40 to-cyan/10",
  "from-gold/40 to-gold/10",
  "from-pink-500/40 to-pink-500/10",
  "from-purple-500/40 to-purple-500/10",
  "from-emerald-500/40 to-emerald-500/10",
  "from-orange-500/40 to-orange-500/10",
];

const initials = (name: string) =>
  name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const Testimonials = () => {
  const { t } = useI18n();
  const list = [...t.testimonials.items, ...t.testimonials.items];

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4">{t.testimonials.title}</h2>
          <p className="text-muted-foreground text-lg">{t.testimonials.subtitle}</p>
        </motion.div>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 start-0 w-32 bg-gradient-to-e from-background to-transparent z-10 pointer-events-none" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        <div className="absolute inset-y-0 end-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />
        <div className="flex gap-6 animate-scroll-x group-hover:[animation-play-state:paused] w-max">
          {list.map((it, i) => (
            <div
              key={i}
              className="w-[340px] sm:w-[400px] glass rounded-2xl p-6 shrink-0 hover:border-cyan/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-foreground/90">"{it.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${palette[i % palette.length]} grid place-items-center font-display font-bold border border-white/10`}>
                  {initials(it.name)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          {t.testimonials.badges}
        </motion.p>
      </div>
    </section>
  );
};
