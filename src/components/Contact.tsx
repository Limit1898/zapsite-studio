import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Globe2, Send } from "lucide-react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";
import { usePricing } from "@/lib/usePricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EMAIL = "zap.site.studio@gmail.com";

export const Contact = () => {
  const { t } = useI18n();
  const { priceFmt } = usePricing();

  const schema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(5).max(40),
    type: z.string().min(1),
    budget: z.string().min(1),
    desc: z.string().trim().min(10).max(2000),
  });

  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", budget: "", desc: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);

  const onChange = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, boolean> = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as string] = true));
      setErrors(errs);
      toast.error(t.contact.error);
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-quote-request", {
        body: {
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          website_type: form.type,
          budget_range: form.budget,
          project_description: form.desc,
        },
      });
      if (error || (data as any)?.error) throw error || new Error((data as any).error);
      toast.success(t.contact.success, { duration: 6000 });
      setForm({ name: "", email: "", phone: "", type: "", budget: "", desc: "" });
    } catch (err) {
      console.error("Quote submission failed:", err);
      toast.error(t.contact.error, { duration: 6000 });
    } finally {
      setSending(false);
    }
  };

  const types = [
    t.portfolio.filters.landing,
    t.portfolio.filters.business,
    t.portfolio.filters.ecom,
    t.portfolio.filters.blog,
    t.portfolio.filters.portfolio,
  ];

  const budgets = [
    `${priceFmt("starter")} ⬇`,
    `${priceFmt("starter")} – ${priceFmt("pro")}`,
    `${priceFmt("pro")} – ${priceFmt("premium")}`,
    `${priceFmt("premium")} +`,
  ];

  const fieldClass = (k: string) =>
    `bg-white/5 border-white/10 h-12 rounded-xl ${errors[k] ? "border-destructive ring-1 ring-destructive" : ""}`;

  return (
    <section id="contact" className="section-pad relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4">{t.contact.title}</h2>
          <p className="text-muted-foreground text-lg">{t.contact.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 glass rounded-2xl p-8 space-y-6 h-fit"
          >
            <a href={`mailto:${EMAIL}`} className="flex items-start gap-4 group">
              <div className="h-10 w-10 rounded-xl bg-cyan/10 grid place-items-center shrink-0 group-hover:bg-cyan/20 transition-colors">
                <Mail className="h-4 w-4 text-cyan" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</div>
                <div className="text-sm font-medium break-all">{EMAIL}</div>
              </div>
            </a>
            <a href="tel:+905068901616" className="flex items-start gap-4 group">
              <div className="h-10 w-10 rounded-xl bg-gold/10 grid place-items-center shrink-0 group-hover:bg-gold/20 transition-colors">
                <Phone className="h-4 w-4 text-gold" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Phone</div>
                <div className="text-sm font-medium">+90 506 890 16 16</div>
              </div>
            </a>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-cyan/10 grid place-items-center shrink-0">
                <Clock className="h-4 w-4 text-cyan" />
              </div>
              <p className="text-sm text-muted-foreground">{t.contact.sidePanel.respond}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-gold/10 grid place-items-center shrink-0">
                <Globe2 className="h-4 w-4 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">{t.contact.sidePanel.location}</p>
            </div>
          </motion.aside>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={submit}
            className="lg:col-span-2 glass rounded-2xl p-8 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">{t.contact.name} *</label>
                <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} className={fieldClass("name")} maxLength={100} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">{t.contact.email} *</label>
                <Input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} className={fieldClass("email")} maxLength={255} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">{t.contact.phone} *</label>
                <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className={fieldClass("phone")} maxLength={40} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">{t.contact.type} *</label>
                <select
                  value={form.type}
                  onChange={(e) => onChange("type", e.target.value)}
                  className={`w-full h-12 rounded-xl bg-white/5 border border-white/10 px-3 text-sm ${errors.type ? "border-destructive ring-1 ring-destructive" : ""}`}
                >
                  <option value="">{t.contact.typePlaceholder}</option>
                  {types.map((tp) => (
                    <option key={tp} value={tp} className="bg-card">{tp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">{t.contact.budget} *</label>
              <select
                value={form.budget}
                onChange={(e) => onChange("budget", e.target.value)}
                className={`w-full h-12 rounded-xl bg-white/5 border border-white/10 px-3 text-sm ${errors.budget ? "border-destructive ring-1 ring-destructive" : ""}`}
              >
                <option value="">{t.contact.budgetPlaceholder}</option>
                {budgets.map((b) => (
                  <option key={b} value={b} className="bg-card">{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">{t.contact.desc} *</label>
              <Textarea
                rows={5}
                value={form.desc}
                onChange={(e) => onChange("desc", e.target.value)}
                className={`bg-white/5 border-white/10 rounded-xl resize-none ${errors.desc ? "border-destructive ring-1 ring-destructive" : ""}`}
                maxLength={2000}
              />
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-cyan text-background hover:bg-cyan/90 rounded-full h-12 font-semibold glow-cyan"
            >
              {sending ? t.contact.sending : (
                <>
                  {t.contact.submit}
                  <Send className="ms-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
