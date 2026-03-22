interface CurrencyCardProps {
  name: string;        // "FC POINTS", "V-BUCKS"
  game: string;        // "EA SPORTS FC 26", "FORTNITE"
  nominal: string;     // "12 000"
  gradient: string;    // CSS gradient
  accent: string;      // accent color
  icon?: string;       // image path (optional)
  hit?: boolean;
}

export default function CurrencyCard({ name, game, nominal, gradient, accent, icon, hit }: CurrencyCardProps) {
  return (
    <div
      className="w-[250px] h-[180px] flex flex-col items-center relative transition-transform duration-300 ease-in-out hover:scale-[1.03] overflow-hidden shrink-0"
      style={{
        background: gradient,
        borderRadius: '12px',
        border: `1px solid ${accent}25`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Hit badge */}
      {hit && (
        <span className="absolute z-10" style={{ top: 34, right: 8, background: 'linear-gradient(135deg, #FF6B00, #FF3D00)', color: '#fff', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 5, letterSpacing: 1, boxShadow: '0 2px 6px rgba(255,61,0,0.25)' }}>Хит</span>
      )}

      {/* Top bar */}
      <div className="w-full shrink-0 flex items-center justify-center relative z-10" style={{ height: '28px', background: 'rgba(255,255,255,0.9)', borderRadius: '12px 12px 0 0' }}>
        <span className="font-bold uppercase whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '1px', color: '#000' }}>{name}</span>
      </div>

      {/* Content body — icon + divider + nominal, vertically & horizontally centered */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10 w-full" style={{ padding: '4px 20px' }}>
        {/* Icon — fixed 70×70 box, image centered inside */}
        {icon ? (
          <div className="flex items-center justify-center" style={{ width: '70px', height: '70px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon} alt={name} className="block" style={{ maxWidth: '70px', maxHeight: '70px', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${accent}50)` }} />
          </div>
        ) : (
          <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-xl font-bold" style={{ background: `${accent}30`, color: accent, border: `2px solid ${accent}50` }}>
            {name.charAt(0)}
          </div>
        )}

        {/* Divider */}
        <div style={{ width: '40px', height: '1px', background: `${accent}40`, margin: '4px auto', boxShadow: `0 0 8px ${accent}15` }} />

        {/* Nominal */}
        <span className="font-display text-center" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1, background: 'linear-gradient(180deg, #FFFFFF 0%, #90CAF9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {nominal}
        </span>
      </div>

      {/* Game name */}
      <span className="text-white uppercase shrink-0 relative z-10 text-center" style={{ fontSize: '8px', letterSpacing: '3px', opacity: 0.5, marginBottom: '8px' }}>
        {game}
      </span>
    </div>
  );
}
