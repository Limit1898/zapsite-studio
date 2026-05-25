import { Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { scrollToSection } from "@/lib/scrollToSection";

export const Footer = () => {
  const { t, lang } = useI18n();
  const links = [
    { id: "work", label: t.nav.work },
    { id: "pricing", label: t.nav.pricing },
    { id: "process", label: t.nav.process },
    { id: "contact", label: t.nav.contact },
  ];

  const contactTitle =
    lang === "tr" ? "İletişime Geçin" : lang === "ar" ? "تواصل معنا" : "Get In Touch";
  const location =
    lang === "tr" ? "İstanbul, Türkiye" : lang === "ar" ? "إسطنبول، تركيا" : "Istanbul, Turkey";

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container-x px-6 md:px-10 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.links}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(l.id)}
                    className="text-sm hover:text-cyan transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{contactTitle}</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:zap.site.studio@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span dir="ltr">zap.site.studio@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+905068901616" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span dir="ltr">+90 506 890 16 16</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © 2026 Zap — {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};
