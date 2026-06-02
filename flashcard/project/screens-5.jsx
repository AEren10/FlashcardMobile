// screens-5.jsx — App Icon concepts (abstract, no mascot/letters-as-logo)
// 1024×1024 art, brand palette (amber on deep navy), shown with iOS squircle + home-screen mockup.

const ICON_BG = 'linear-gradient(160deg, #0E1B2E 0%, #0A1019 60%, #0B1422 100%)';

// Each concept returns a 1024-viewBox SVG (fills its square container)
function IconArt({ concept }) {
  if (concept === 'layers') {
    return (
      <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1B2E" /><stop offset="1" stopColor="#0A1019" /></linearGradient>
          <linearGradient id="lg-amb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD089" /><stop offset="1" stopColor="#FF9E2C" /></linearGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#lg-bg)" />
        <g transform="rotate(-14 512 540)">
          <rect x="300" y="300" width="430" height="300" rx="64" fill="#243B5A" opacity="0.55" transform="translate(-58 96)" />
          <rect x="300" y="300" width="430" height="300" rx="64" fill="#3B5BDB" opacity="0.7" transform="translate(-26 44)" />
          <rect x="300" y="300" width="430" height="300" rx="64" fill="url(#lg-amb)" />
          <rect x="356" y="372" width="220" height="34" rx="17" fill="#0A1019" opacity="0.32" />
          <rect x="356" y="430" width="150" height="34" rx="17" fill="#0A1019" opacity="0.22" />
        </g>
      </svg>
    );
  }
  if (concept === 'wave') {
    return (
      <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="wv-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1B2E" /><stop offset="1" stopColor="#0A1019" /></linearGradient>
          <linearGradient id="wv-amb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FF9E2C" /><stop offset="1" stopColor="#FFD089" /></linearGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#wv-bg)" />
        <rect x="246" y="306" width="532" height="412" rx="92" fill="none" stroke="#3B5BDB" strokeWidth="18" opacity="0.5" />
        <path d="M300 512q70 -150 130 0t130 0t130 0" fill="none" stroke="url(#wv-amb)" strokeWidth="40" strokeLinecap="round" />
        <circle cx="300" cy="512" r="30" fill="#FFD089" />
        <circle cx="560" cy="512" r="22" fill="#3B5BDB" />
        <circle cx="690" cy="512" r="22" fill="#FFB84D" />
      </svg>
    );
  }
  if (concept === 'mark') {
    // abstract glyph: stacked bars suggesting cards + a forward spark (not a literal letter)
    return (
      <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="mk-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1B2E" /><stop offset="1" stopColor="#0A1019" /></linearGradient>
          <linearGradient id="mk-amb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD089" /><stop offset="1" stopColor="#FF9E2C" /></linearGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#mk-bg)" />
        <rect x="318" y="312" width="388" height="80" rx="40" fill="url(#mk-amb)" />
        <rect x="318" y="472" width="284" height="80" rx="40" fill="#3B5BDB" />
        <rect x="318" y="632" width="180" height="80" rx="40" fill="#FFB84D" opacity="0.85" />
        <circle cx="690" cy="672" r="52" fill="url(#mk-amb)" />
      </svg>
    );
  }
  // flip — folded-corner card
  return (
    <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="fp-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E1B2E" /><stop offset="1" stopColor="#0A1019" /></linearGradient>
        <linearGradient id="fp-amb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD089" /><stop offset="1" stopColor="#FF9E2C" /></linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#fp-bg)" />
      <path d="M296 300h332l100 100v324a32 32 0 0 1-32 32H296a32 32 0 0 1-32-32V332a32 32 0 0 1 32-32Z" fill="#1B2C44" stroke="#3B5BDB" strokeWidth="14" strokeOpacity="0.6" />
      <path d="M628 300l100 100H660a32 32 0 0 1-32-32Z" fill="url(#fp-amb)" />
      <rect x="338" y="468" width="300" height="40" rx="20" fill="#FFB84D" opacity="0.85" />
      <rect x="338" y="548" width="200" height="40" rx="20" fill="#5B7FFF" opacity="0.7" />
    </svg>
  );
}

function Squircle({ size, concept }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.225, overflow: 'hidden', background: ICON_BG, boxShadow: '0 18px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
      <IconArt concept={concept} />
    </div>
  );
}

function HomeMock({ concept, dark }) {
  return (
    <div style={{ width: 132, borderRadius: 20, padding: 16, background: dark ? 'linear-gradient(160deg,#1a2740,#0f1726)' : 'linear-gradient(160deg,#dbe6f5,#c3d2ea)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <Squircle size={62} concept={concept} />
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: dark ? '#E8EEF6' : '#1B2740' }}>Flashcard</div>
    </div>
  );
}

function AppIconBoard({ dark }) {
  const concepts = [
    { k: 'layers', name: 'Katmanlı Kart', desc: 'Üst üste binen kartlar — deste & SRS katmanları.' },
    { k: 'wave', name: 'Akıllı Dalga', desc: 'Aralıklı tekrar ritmi; node\'lar hatırlama anları.' },
    { k: 'mark', name: 'Soyut İşaret', desc: 'Azalan kart çubukları + ileri kıvılcımı (harf değil).' },
    { k: 'flip', name: 'Çevrilen Kart', desc: 'Kıvrık köşe — dokun & çevir jesti.' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: dark ? '#0A1019' : '#FAFBFC', borderRadius: 20, padding: '40px 44px', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, letterSpacing: '0.12em', color: '#FFB84D', textTransform: 'uppercase' }}>App Icon · 1024×1024</div>
      <div className="fm-display" style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 40, color: dark ? '#F1F5F9' : '#0F1925', margin: '8px 0 4px' }}>4 soyut konsept</div>
      <p style={{ color: dark ? '#8899AB' : '#4A5C6E', fontSize: 14.5, maxWidth: 640, lineHeight: 1.5, margin: 0 }}>Hepsi amber accent + deep navy zemin. Maskot yok, okunur harf yok. Beğendiğini seç, finalize edelim.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 36 }}>
        {concepts.map((c) => (
          <div key={c.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Squircle size={184} concept={c.k} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: dark ? '#F1F5F9' : '#0F1925' }}>{c.name}</div>
              <div style={{ color: dark ? '#8899AB' : '#4A5C6E', fontSize: 12.5, lineHeight: 1.45, marginTop: 4, maxWidth: 200 }}>{c.desc}</div>
            </div>
            <HomeMock concept={c.k} dark={dark} />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { AppIconBoard, IconArt, Squircle });
