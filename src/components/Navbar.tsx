import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/translations";
import { Button } from "@/components/ui/button";

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#work", label: t.nav.work },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#process", label: t.nav.process },
    { href: "#contact", label: t.nav.contact },
  ];

  const goTo = (href: string) => {
    setMobile(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-3" : "py-5"
      }`}
    >
      <nav className="container-x flex items-center justify-between px-6 md:px-10">
        <a href="#" className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan to-gold grid place-items-center font-display font-bold text-background">
            Z
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Zap<span className="text-cyan">.</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => goTo(l.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-cyan transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="h-10 w-10 grid place-items-center rounded-full glass hover:border-cyan/40 transition-all"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute end-0 mt-2 w-44 glass-strong rounded-xl overflow-hidden"
                >
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        lang === l.code ? "text-cyan" : "text-foreground"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-cyan" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={() => goTo("#contact")}
            className="hidden md:inline-flex bg-cyan text-background hover:bg-cyan/90 font-semibold rounded-full px-5"
          >
            {t.nav.quote}
          </Button>

          <button
            className="md:hidden h-10 w-10 grid place-items-center rounded-full glass"
            onClick={() => setMobile((v) => !v)}
            aria-label="Menu"
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => goTo(l.href)}
                  className="text-start text-sm text-foreground py-2 border-b border-white/5"
                >
                  {l.label}
                </button>
              ))}
              <Button
                onClick={() => goTo("#contact")}
                className="bg-cyan text-background hover:bg-cyan/90 rounded-full mt-2"
              >
                {t.nav.quote}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
