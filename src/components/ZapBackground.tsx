import { useEffect, useRef } from "react";

/**
 * ZapBackground
 * Premium animated lightning bolt with the word "ZAP" charged inside it.
 * - SVG bolt + glow + flicker
 * - Canvas spark particles shooting outward
 * - Cyan / gold neon palette
 */
export const ZapBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spark particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    type Spark = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: "cyan" | "gold";
    };
    const sparks: Spark[] = [];

    // Bolt anchor points (relative %), where sparks emit
    const emitters = [
      { x: 0.5, y: 0.32 },
      { x: 0.46, y: 0.5 },
      { x: 0.54, y: 0.68 },
      { x: 0.5, y: 0.5 },
    ];

    const spawn = () => {
      const e = emitters[Math.floor(Math.random() * emitters.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 2.2;
      const maxLife = 40 + Math.random() * 50;
      sparks.push({
        x: e.x * w,
        y: e.y * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: 0.6 + Math.random() * 1.6,
        hue: Math.random() < 0.65 ? "cyan" : "gold",
      });
    };

    let frame = 0;
    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // Emit bursts: most frames small drip, occasional big burst (lightning strike)
      const burst = frame % 90 === 0 ? 14 : 0;
      const drip = Math.random() < 0.5 ? 1 : 0;
      for (let i = 0; i < burst + drip; i++) spawn();

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.012; // very subtle drift
        s.life -= 1;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const alpha = (s.life / s.maxLife) * 0.9;
        const color =
          s.hue === "cyan"
            ? `rgba(0, 212, 255, ${alpha})`
            : `rgba(240, 180, 41, ${alpha})`;
        const glow =
          s.hue === "cyan"
            ? `rgba(0, 212, 255, ${alpha * 0.3})`
            : `rgba(240, 180, 41, ${alpha * 0.3})`;

        // glow halo
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 8);
        grad.addColorStop(0, color);
        grad.addColorStop(0.4, glow);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 8, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // SVG lightning bolt path (stylized, vertical, balanced).
  // viewBox 200x400; bolt path traces the silhouette.
  const boltPath =
    "M118 8 L60 200 L100 200 L78 392 L150 180 L108 180 Z";

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Soft radial backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.08) 0%, rgba(0,212,255,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(240,180,41,0.05) 0%, rgba(240,180,41,0) 60%)",
        }}
      />

      {/* The ZAP bolt — centered, large, behind text */}
      <div className="absolute inset-0 grid place-items-center">
        <svg
          viewBox="0 0 200 400"
          preserveAspectRatio="xMidYMid meet"
          className="zap-bolt h-[80vh] max-h-[760px] w-auto opacity-[0.55]"
        >
          <defs>
            {/* Gradient stroke/fill — cyan to gold */}
            <linearGradient id="zap-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(190 100% 50%)" />
              <stop offset="55%" stopColor="hsl(190 100% 60%)" />
              <stop offset="100%" stopColor="hsl(43 87% 55%)" />
            </linearGradient>

            {/* Outer electric glow */}
            <filter id="zap-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="b1" />
              <feGaussianBlur stdDeviation="14" result="b2" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Tighter inner glow */}
            <filter id="zap-glow-tight" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>

            {/* Path for ZAP letters to ride the bolt */}
            <path
              id="zap-curve"
              d="M 100 30 L 78 200 L 100 200 L 100 380"
            />
          </defs>

          {/* Faint outer halo bolt */}
          <path
            d={boltPath}
            fill="hsl(190 100% 50% / 0.18)"
            filter="url(#zap-glow)"
            className="zap-pulse-slow"
          />

          {/* Main bolt */}
          <path
            d={boltPath}
            fill="url(#zap-grad)"
            stroke="hsl(190 100% 70%)"
            strokeWidth="1.2"
            filter="url(#zap-glow)"
            className="zap-pulse"
          />

          {/* Inner highlight bolt */}
          <path
            d={boltPath}
            fill="hsl(0 0% 100% / 0.08)"
            stroke="hsl(0 0% 100% / 0.7)"
            strokeWidth="0.6"
            filter="url(#zap-glow-tight)"
            className="zap-flicker"
          />

          {/* Z A P letters embedded inside the bolt, vertical */}
          <g
            className="zap-letters"
            fontFamily="'Playfair Display', 'DM Serif Display', serif"
            fontWeight="900"
            textAnchor="middle"
            fill="hsl(0 0% 100% / 0.92)"
            style={{
              filter:
                "drop-shadow(0 0 6px hsl(190 100% 50% / 0.9)) drop-shadow(0 0 14px hsl(190 100% 50% / 0.5))",
            }}
          >
            <text x="100" y="120" fontSize="78" className="zap-letter zap-l1">
              Z
            </text>
            <text x="92" y="220" fontSize="78" className="zap-letter zap-l2">
              A
            </text>
            <text x="108" y="320" fontSize="78" className="zap-letter zap-l3">
              P
            </text>
          </g>
        </svg>
      </div>

      {/* Spark particles canvas — on top of bolt */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <style>{`
        @keyframes zapPulse {
          0%, 100% { opacity: 0.85; filter: url(#zap-glow) brightness(1); }
          50%      { opacity: 1;    filter: url(#zap-glow) brightness(1.35); }
        }
        @keyframes zapPulseSlow {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.6; }
        }
        @keyframes zapFlicker {
          0%, 19%, 21%, 49%, 51%, 100% { opacity: 0.95; }
          20%  { opacity: 0.4; }
          50%  { opacity: 0.55; }
          70%  { opacity: 1; }
          73%  { opacity: 0.6; }
        }
        @keyframes zapLetterCharge {
          0%, 100% {
            opacity: 0.92;
            filter: drop-shadow(0 0 6px hsl(190 100% 50% / 0.9))
                    drop-shadow(0 0 14px hsl(190 100% 50% / 0.5));
          }
          45% {
            opacity: 1;
            filter: drop-shadow(0 0 10px hsl(190 100% 60% / 1))
                    drop-shadow(0 0 24px hsl(190 100% 50% / 0.85))
                    drop-shadow(0 0 36px hsl(43 87% 55% / 0.45));
          }
          70% {
            opacity: 0.78;
            filter: drop-shadow(0 0 4px hsl(190 100% 50% / 0.6));
          }
        }
        .zap-pulse      { animation: zapPulse 2.6s ease-in-out infinite; transform-origin: center; }
        .zap-pulse-slow { animation: zapPulseSlow 3.4s ease-in-out infinite; }
        .zap-flicker    { animation: zapFlicker 3.2s steps(1, end) infinite; }
        .zap-letter     { animation: zapLetterCharge 2.4s ease-in-out infinite; }
        .zap-l1 { animation-delay: 0s; }
        .zap-l2 { animation-delay: 0.35s; }
        .zap-l3 { animation-delay: 0.7s; }

        @media (prefers-reduced-motion: reduce) {
          .zap-pulse, .zap-pulse-slow, .zap-flicker, .zap-letter {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
