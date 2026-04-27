interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: "h-6 w-6", text: "text-base" },
  md: { icon: "h-8 w-8", text: "text-lg" },
  lg: { icon: "h-10 w-10", text: "text-2xl" },
};

/**
 * Zap brand logo — clean lightning bolt icon + gradient wordmark.
 * Cyan → gold gradient, subtle electric glow on dark backgrounds.
 */
export const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${s.icon} shrink-0`}
        style={{
          filter:
            "drop-shadow(0 0 4px hsl(190 100% 50% / 0.7)) drop-shadow(0 0 10px hsl(190 100% 50% / 0.35))",
        }}
        aria-hidden
      >
        <defs>
          <linearGradient id="zap-logo-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(190 100% 50%)" />
            <stop offset="100%" stopColor="hsl(43 87% 52%)" />
          </linearGradient>
        </defs>
        <path
          d="M14.5 2 L4 13.2 h6.2 L9.5 22 L20 10.8 h-6.2 Z"
          fill="url(#zap-logo-grad)"
          stroke="hsl(190 100% 70%)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`font-display font-extrabold tracking-tight ${s.text} text-gradient`}
        style={{
          textShadow:
            "0 0 8px hsl(190 100% 50% / 0.35), 0 0 18px hsl(190 100% 50% / 0.2)",
        }}
      >
        Zap
      </span>
    </span>
  );
};
