import { useEffect, useState } from "react";

export default function CinematicBackground() {
  const [particles, setParticles] = useState<
    { left: string; size: string; duration: string; delay: string; color: string }[]
  >([]);

  useEffect(() => {
    const colors = ["var(--energy-green)", "var(--cng-blue)", "rgba(245,245,247,0.3)"];
    const arr = Array.from({ length: 18 }, () => ({
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 3}px`,
      duration: `${15 + Math.random() * 20}s`,
      delay: `${Math.random() * 10}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(arr);
  }, []);

  return (
    <>
      <div className="cinematic-bg" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
        {/* Energy flow lines */}
        <div className="energy-line" style={{ top: "15%", width: "100%", animationDuration: "6s" }} />
        <div className="energy-line" style={{ top: "55%", width: "100%", animationDuration: "8s", animationDelay: "2s" }} />
        <div className="energy-line" style={{ top: "85%", width: "100%", animationDuration: "7s", animationDelay: "4s" }} />
      </div>
    </>
  );
}
