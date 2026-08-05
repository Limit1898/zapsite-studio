import { motion } from "framer-motion";
import { Monitor, Building2, ShoppingBag, Newspaper, Palette } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { usePricing, PriceKey } from "@/lib/usePricing";

const icons = [Monitor, Building2, ShoppingBag, Newspaper, Palette];
const priceKeys: PriceKey[] = ["landing", "business", "ecom", "blog", "portfolio"];
const planTargets = ["starter", "pro", "premium", "pro", "pro"]; // which pricing plan to scroll to
// display order (cheapest → most expensive): landing, blog, portfolio, business, ecom
const order = [0, 3, 4, 1, 2];

export const WebsiteTypes = ({ onSelect }: { onSelect: (plan: string) => void }) => {
  const { t } = useI18n();
  const { priceFmt } = usePricing();

  return (
    <section id="types" className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4">{t.types.title}</h2>
          <p className="text-muted-foreground text-lg">{t.types.subtitle}</p>
          <p className="mt-4 text-xs text-cyan/80">{t.types.live}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {order.map((idx, pos) => {
            const item = t.types.items[idx];
            const Icon = icons[idx];
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pos * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => onSelect(planTargets[idx])}
                className="text-start glass rounded-2xl p-6 hover:border-cyan/40 transition-all group relative overflow-hidden"
              >
                <div className="absolute -top-12 -end-12 h-32 w-32 rounded-full bg-cyan/0 group-hover:bg-cyan/10 blur-2xl transition-all" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan/20 to-gold/10 grid place-items-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-cyan" />
                  </div>
                  <h3 className="font-display text-xl mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{item.desc}</p>
                  <div className="flex items-baseline gap-1.5 pt-4 border-t border-white/10">
                    <span className="text-2xl font-display font-bold text-gradient">{priceFmt(priceKeys[idx])}</span>
                    <span className="text-xs text-muted-foreground">+</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
