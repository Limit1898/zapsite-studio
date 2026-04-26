import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Footer = () => {
  const { t } = useI18n();
  const links = [
    { href: "#work", label: t.nav.work },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#process", label: t.nav.process },
    { href: "#contact", label: t.nav.contact },
  ];
  const socials = [
    { Icon: Linkedin, href: "#", label: "LinkedIn" },
    { Icon: Github, href: "#", label: "GitHub" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container-x px-6 md:px-10 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan to-gold grid place-items-center font-display font-bold text-background">Z</span>
              <span className="font-display text-lg font-bold">Zap<span className="text-cyan">.</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.links}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-cyan transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.social}</h4>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="h-10 w-10 rounded-full glass grid place-items-center hover:border-cyan/40 hover:text-cyan transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © 2026 Zap — {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};
