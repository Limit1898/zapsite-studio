import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { usePricing } from "@/lib/usePricing";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

type Props = { highlighted: string | null; onContact: () => void };

export const Pricing = forwardRef<HTMLElement, Props>(({ highlighted, onContact }, ref) => {
  const { t } = useI18n();
  const { priceFmt } = usePricing();

  const plans = [
    { id: "starter", name: t.pricing.starter, price: priceFmt("starter"), features: t.pricing.starterFeatures, cta: t.pricing.cta, popular: false },
    { id: "pro", name: t.pricing.pro, price: priceFmt("pro"), features: t.pricing.proFeatures, cta: t.pricing.cta, popular: true },
    { id: "premium", name: t.pricing.premium, price: priceFmt("premium"), features: t.pricing.premiumFeatures, cta: t.pricing.ctaPremium, popular: false },
  ];

  return (
    <section id="pricing" ref={ref} className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4">{t.pricing.title}</h2>
          <p className="text-muted-foreground text-lg">{t.pricing.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((p, i) => {
            const isHi = highlighted === p.id;
            return (
              <motion.div
                key={p.id}
                id={`plan-${p.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 transition-all duration-500 ${
                  p.popular
                    ? "glass-strong border-cyan/40 md:-translate-y-4 glow-cyan"
                    : "glass hover:border-white/20"
                } ${isHi ? "ring-2 ring-gold scale-[1.02]" : ""}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan text-background text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> {t.pricing.popular}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-2xl mb-3">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-display font-bold text-gradient">{p.price}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 h-5 w-5 rounded-full grid place-items-center shrink-0 ${p.popular ? "bg-cyan/20" : "bg-white/5"}`}>
                        <Check className="h-3 w-3 text-cyan" />
                      </span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onContact}
                  className={`w-full rounded-full h-12 font-semibold ${
                    p.popular
                      ? "bg-cyan text-background hover:bg-cyan/90"
                      : "bg-white/5 hover:bg-white/10 text-foreground border border-white/10"
                  }`}
                >
                  {p.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">{t.pricing.note}</p>
      </div>
    </section>
  );
});

Pricing.displayName = "Pricing";
