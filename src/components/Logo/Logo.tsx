interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={`flex items-center gap-2${className ? ` ${className}` : ''}`}>
      {/* 4 ascending bars — same proportions as favicon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="1"  y="22" width="6" height="8"  rx="1.5" fill="var(--color-accent)"/>
        <rect x="9"  y="16" width="6" height="14" rx="1.5" fill="var(--color-accent)"/>
        <rect x="17" y="10" width="6" height="20" rx="1.5" fill="var(--color-accent)"/>
        <rect x="25" y="2"  width="6" height="28" rx="1.5" fill="var(--color-accent)"/>
      </svg>
      <span className="font-semibold tracking-tight">Sort Algorithms</span>
    </span>
  )
}
