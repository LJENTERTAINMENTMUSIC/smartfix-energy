interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 36, showWordmark = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo mark */}
      <div
        className="relative flex items-center justify-center rounded-2xl"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #00d97f 0%, #00a8ff 100%)",
          boxShadow: "0 0 20px rgba(0, 217, 127, 0.35), 0 0 40px rgba(0, 168, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lightning bolt — custom geometric path */}
          <path
            d="M18.5 2L7 18h6.5L11 30l14-18h-7l3.5-10z"
            fill="#08090a"
            stroke="#08090a"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display font-bold tracking-tight text-[var(--electric)]"
            style={{ fontSize: size * 0.36 }}
          >
            SMARTFIX
          </span>
          <span
            className="font-medium tracking-[0.2em] text-[var(--energy-green)]"
            style={{ fontSize: size * 0.26 }}
          >
            ENERGY
          </span>
        </div>
      )}
    </div>
  );
}
