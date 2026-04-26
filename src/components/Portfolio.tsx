import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import restaurant from "@/assets/proj-restaurant.jpg";
import fashion from "@/assets/proj-fashion.jpg";
import realestate from "@/assets/proj-realestate.jpg";
import law from "@/assets/proj-law.jpg";
import blog from "@/assets/proj-blog.jpg";
import saas from "@/assets/proj-saas.jpg";

const images = [restaurant, fashion, realestate, law, blog, saas];

export const Portfolio = () => {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>("all");

  const filters = [
    { id: "all", label: t.portfolio.filters.all },
    { id: "landing", label: t.portfolio.filters.landing },
    { id: "ecom", label: t.portfolio.filters.ecom },
    { id: "blog", label: t.portfolio.filters.blog },
    { id: "portfolio", label: t.portfolio.filters.portfolio },
    { id: "business", label: t.portfolio.filters.business },
  ];

  const projects = t.portfolio.projects.map((p, i) => ({ ...p, img: images[i] }));
  const visible = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  return (
    <section id="work" className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4">{t.portfolio.title}</h2>
          <p className="text-muted-foreground text-lg">{t.portfolio.subtitle}</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all border ${
                filter === f.id
                  ? "bg-cyan text-background border-cyan font-semibold"
                  : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.a
                layout
                key={p.name}
                href="#contact"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group glass rounded-2xl overflow-hidden hover:border-cyan/30 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-60" />
                  <span className="absolute top-4 start-4 px-3 py-1 rounded-full bg-background/70 backdrop-blur text-xs uppercase tracking-wide text-cyan">
                    {t.portfolio.filters[p.type as keyof typeof t.portfolio.filters]}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-xl">{p.name}</h3>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-cyan group-hover:rotate-12 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                  <span className="text-xs font-semibold text-cyan group-hover:underline">
                    {t.portfolio.view} →
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
