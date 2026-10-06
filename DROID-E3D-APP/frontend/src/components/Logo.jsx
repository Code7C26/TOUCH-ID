// Logo provisorio de DROID-E3D (un escudo con la "cara" del robot), hasta el manual de marca (E.4).
// conTexto = muestra también "DROID-E3D by SMAT" al lado.
export default function Logo({ conTexto = true, className = 'size-9' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        {/* escudo amarillo = protección */}
        <path d="M20 2l15 5.5v11c0 9.5-6.5 16-15 19.5C11.5 34.5 5 28 5 18.5v-11z" fill="#f5b800" />
        {/* visor del robot */}
        <rect x="11" y="13" width="18" height="11" rx="5.5" fill="#1f2328" />
        {/* ojos: el izquierdo "escanea" */}
        <circle cx="16.5" cy="18.5" r="2.4" fill="#f5b800" />
        <circle cx="23.5" cy="18.5" r="1.6" fill="#f97316" />
        {/* antena */}
        <path d="M20 13V9" stroke="#1f2328" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {conTexto && (
        <span className="leading-none">
          <span className="block text-base font-extrabold tracking-tight">DROID-E3D</span>
          <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">by SMAT</span>
        </span>
      )}
    </span>
  )
}
