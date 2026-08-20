import { useEffect, useRef, useState } from "react";

/**
 * ZapBackground
 * Cinematic lightning entry → calm idle loop.
 * - Jagged SVG bolt strikes from top to bottom (~0.3s)
 * - Full-screen flash on impact
 * - Canvas spark explosion at impact point
 * - "ZAP" neon-sign flicker-on
 * - Idle: subtle pulse on ZAP + occasional upward sparks
 */
export const ZapBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"strike" | "idle">("strike");

  // Phase transition: strike (≈1.4s total) → idle
  useEffect(() => {
    const t = window.setTimeout(() => setPhase("idle"), 1400);
    return () => window.clearTimeout(t);
  }, []);

  // Canvas particle system — explosion on strike, gentle floaters in idle
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
      gravity: number;
    };
    const sparks: Spark[] = [];

    const impactPoint = () => ({ x: w * 0.5, y: h * 0.88 });

    const explode = (count = 90) => {
      const { x, y } = impactPoint();
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI + Math.random() * Math.PI; // mostly upward/outward
        const speed = 2 + Math.random() * 7;
        const maxLife = 50 + Math.random() * 60;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          size: 0.8 + Math.random() * 1.8,
          hue: Math.random() < 0.65 ? "cyan" : "gold",
          gravity: 0.05 + Math.random() * 0.04,
        });
      }
    };

    const floater = () => {
      sparks.push({
        x: Math.random() * w,
        y: h + 4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.3 + Math.random() * 0.7),
        life: 120 + Math.random() * 80,
        maxLife: 200,
        size: 0.5 + Math.random() * 1.1,
        hue: Math.random() < 0.6 ? "cyan" : "gold",
        gravity: -0.005, // slight upward drift
      });
    };

    // Schedule the explosion to align with the bolt impact (~0.35s in)
    const explodeTimer = window.setTimeout(() => explode(110), 320);
    // A second smaller burst as the flash decays
    const explodeTimer2 = window.setTimeout(() => explode(40), 520);

    let frame = 0;
    let idle = false;
    const idleSwitch = window.setTimeout(() => {
      idle = true;
    }, 1400);

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      if (idle) {
        // gentle floating sparks rising
        if (Math.random() < 0.18) floater();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= 0.992;
        s.life -= 1;
        if (s.life <= 0 || s.y < -10 || s.y > h + 20) {
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

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 8);
        grad.addColorStop(0, color);
        grad.addColorStop(0.4, glow);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 8, 0, Math.PI * 2);
        ctx.fill();

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
      window.clearTimeout(explodeTimer);
      window.clearTimeout(explodeTimer2);
      window.clearTimeout(idleSwitch);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Jagged lightning bolt — top to bottom, viewBox 200 x 800
  const boltPath =
    "M104 0 L86 110 L116 130 L80 240 L122 260 L74 380 L130 400 L70 520 L128 540 L80 660 L118 700 L96 800";

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
            "radial-gradient(ellipse at 50% 60%, rgba(0,212,255,0.08) 0%, rgba(0,212,255,0) 55%), radial-gradient(ellipse at 50% 80%, rgba(240,180,41,0.06) 0%, rgba(240,180,41,0) 60%)",
        }}
      />

      {/* Cinematic full-hero flash on impact */}
      <div className="absolute inset-0 zap-flash" />

      {/* Lightning bolt — strikes once, then fades to subtle idle ghost */}
      <div className="absolute inset-0 grid place-items-stretch">
        <svg
          viewBox="0 0 200 800"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="zap-bolt-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0 0% 100%)" />
              <stop offset="40%" stopColor="hsl(190 100% 70%)" />
              <stop offset="100%" stopColor="hsl(43 87% 55%)" />
            </linearGradient>

            <filter id="zap-bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b1" />
              <feGaussianBlur stdDeviation="12" in="SourceGraphic" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer halo bolt */}
          <path
            d={boltPath}
            fill="none"
            stroke="hsl(190 100% 60% / 0.5)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#zap-bolt-glow)"
            className="zap-bolt-halo"
          />
          {/* Main bolt */}
          <path
            d={boltPath}
            fill="none"
            stroke="url(#zap-bolt-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#zap-bolt-glow)"
            className="zap-bolt-main"
          />
          {/* Bright core */}
          <path
            d={boltPath}
            fill="none"
            stroke="hsl(0 0% 100%)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="zap-bolt-core"
          />
        </svg>
      </div>

      {/* ZAP neon sign — flickers on after strike */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={`zap-sign ${phase === "idle" ? "zap-sign--idle" : "zap-sign--on"}`}
        >
          ZAP
        </div>
      </div>

      {/* Spark particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <style>{`
        /* ---- BOLT STRIKE ---- */
        @keyframes boltStrike {
          0%   { stroke-dashoffset: 1000; opacity: 0; }
          8%   { opacity: 1; }
          18%  { stroke-dashoffset: 0; opacity: 1; }
          22%  { opacity: 1; }
          40%  { opacity: 0.85; }
          70%  { opacity: 0.15; }
          100% { opacity: 0; }
        }
        @keyframes boltHalo {
          0%   { opacity: 0; }
          12%  { opacity: 1; }
          30%  { opacity: 0.9; }
          80%  { opacity: 0; }
          100% { opacity: 0; }
        }
        .zap-bolt-main, .zap-bolt-core {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: boltStrike 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .zap-bolt-core { animation-delay: 0.02s; }
        .zap-bolt-halo {
          opacity: 0;
          animation: boltHalo 1.3s ease-out forwards;
        }

        /* ---- IMPACT FLASH ---- */
        @keyframes zapFlash {
          0%   { background: rgba(255,255,255,0); }
          22%  { background: rgba(255,255,255,0); }
          26%  { background: rgba(220, 245, 255, 0.85); }
          34%  { background: rgba(120, 220, 255, 0.35); }
          55%  { background: rgba(0, 212, 255, 0.05); }
          100% { background: rgba(0,0,0,0); }
        }
        .zap-flash {
          animation: zapFlash 1.3s ease-out forwards;
          mix-blend-mode: screen;
        }

        /* ---- ZAP NEON SIGN ---- */
        .zap-sign {
          font-family: 'Fraunces', 'Playfair Display', serif;
          font-weight: 800;
          font-style: italic;
          font-size: clamp(8rem, 28vw, 22rem);
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(255,255,255,0.95);
          opacity: 0;
          text-shadow:
            0 0 8px hsl(190 100% 60% / 0.9),
            0 0 18px hsl(190 100% 50% / 0.8),
            0 0 36px hsl(190 100% 50% / 0.6),
            0 0 64px hsl(43 87% 55% / 0.35);
        }
        @keyframes signOn {
          0%   { opacity: 0; }
          24%  { opacity: 0; }
          26%  { opacity: 0.85; } /* first flash with strike */
          28%  { opacity: 0.1; }
          32%  { opacity: 0.9; }
          34%  { opacity: 0.2; }
          38%  { opacity: 0.95; }
          42%  { opacity: 0.4; }
          50%  { opacity: 1; }
          60%  { opacity: 0.85; }
          70%  { opacity: 1; }
          100% { opacity: 0.55; }
        }
        @keyframes signIdlePulse {
          0%, 100% {
            opacity: 0.55;
            text-shadow:
              0 0 8px hsl(190 100% 60% / 0.8),
              0 0 18px hsl(190 100% 50% / 0.6),
              0 0 36px hsl(190 100% 50% / 0.45),
              0 0 64px hsl(43 87% 55% / 0.3);
          }
          50% {
            opacity: 0.75;
            text-shadow:
              0 0 10px hsl(190 100% 65% / 1),
              0 0 24px hsl(190 100% 55% / 0.85),
              0 0 48px hsl(190 100% 50% / 0.6),
              0 0 80px hsl(43 87% 55% / 0.45);
          }
        }
        .zap-sign--on   { animation: signOn 1.4s steps(1, end) forwards; }
        .zap-sign--idle { animation: signIdlePulse 3.2s ease-in-out infinite; opacity: 0.6; }

        @media (prefers-reduced-motion: reduce) {
          .zap-bolt-main, .zap-bolt-core, .zap-bolt-halo,
          .zap-flash, .zap-sign--on, .zap-sign--idle {
            animation: none !important;
          }
          .zap-sign { opacity: 0.6; }
          .zap-bolt-main, .zap-bolt-core { stroke-dashoffset: 0; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
