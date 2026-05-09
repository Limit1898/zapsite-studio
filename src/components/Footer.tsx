import { useI18n } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

export const Footer = () => {
  const { t } = useI18n();
  const links = [
    { href: "#work", label: t.nav.work },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#process", label: t.nav.process },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container-x px-6 md:px-10 py-14">
        <div className="grid md:grid-cols-2 gap-10 mb-10 items-start">
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">{t.footer.tagline}</p>
          </div>

          <div className="md:justify-self-end">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.links}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-cyan transition-colors">{l.label}</a>
                </li>
              ))}
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
