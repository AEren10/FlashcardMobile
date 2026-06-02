// screens-7.jsx — Animation System spec / showcase board (implementation reference)
// Storyboards + property tables + usage. Dark documentation surface.

// ── mini storyboard frame ──
function MF({ children, label, w = 58 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ width: w, height: 76, borderRadius: 10, background: '#0E1726', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <span style={{ fontFamily: 'Space Grotesk', fontSize: 9.5, color: '#4A5C6E' }}>{label}</span>
    </div>
  );
}
const miniCard = (extra) => ({ width: 30, height: 40, borderRadius: 7, background: 'linear-gradient(165deg,#16263a,#0f1726)', border: '1px solid rgba(180,255,79,0.25)', ...extra });

function Story({ kind }) {
  const row = { display: 'flex', gap: 8, flexWrap: 'wrap' };
  if (kind === 'flip') {
    return (
      <div style={{ ...row, perspective: 360 }}>
        {[0, 45, 90, 135, 180].map((deg) => (
          <MF key={deg} label={deg + '%'.replace('%', '°')}>
            <div style={{ ...miniCard({ transform: `rotateY(${deg}deg) scale(${deg === 90 ? 1.04 : 1})`, transformStyle: 'preserve-3d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4FF4F', fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 11 }) }}>{deg < 90 ? 'EN' : deg > 90 ? 'TR' : ''}</div>
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'swipe') {
    return (
      <div style={row}>
        {[{ x: 0, r: 0, t: null, l: 'idle' }, { x: 10, r: 7, t: 'g', l: '+60pt' }, { x: 22, r: 13, t: 'g', l: 'commit →' }].map((f, i) => (
          <MF key={i} label={f.l}>
            <div style={{ ...miniCard({ transform: `translateX(${f.x}px) rotate(${f.r}deg)`, boxShadow: f.t === 'g' ? 'inset 0 0 0 1.5px #4ADE80' : 'none' }) }} />
            {f.t === 'g' && <div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06210f', fontSize: 9 }}>✓</div>}
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'stack') {
    return (
      <div style={row}>
        {[0, 1, 2].map((i) => (
          <MF key={i} label={['t=0', '150ms', '300ms'][i]}>
            <div style={{ ...miniCard({ position: 'absolute', transform: 'scale(0.7) translateY(8px)', opacity: 0.4 }) }} />
            <div style={{ ...miniCard({ position: 'absolute', transform: `scale(${0.82 + i * 0.04}) translateY(${4 - i * 2}px)`, opacity: 0.7 }) }} />
            <div style={{ ...miniCard({ position: 'absolute', transform: `translateX(${i * 14}px) rotate(${i * 8}deg)`, opacity: 1 - i * 0.3 }) }} />
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'correct') {
    return (
      <div style={row}>
        {[{ s: 1, g: 0, l: '0' }, { s: 0.97, g: 0, l: '120' }, { s: 1.06, g: 0.5, l: '240' }, { s: 1, g: 0.3, l: '400 ✓' }].map((f, i) => (
          <MF key={i} label={f.l}>
            <div style={{ width: 34, height: 26, borderRadius: 7, background: '#4ADE80', transform: `scale(${f.s})`, boxShadow: f.g ? `0 0 ${14 * f.g}px rgba(74,222,128,${f.g})` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06210f', fontSize: 12 }}>{i === 3 ? '✓' : ''}</div>
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'wrong') {
    return (
      <div style={row}>
        {[{ x: 0, l: '0' }, { x: 8, l: '50' }, { x: -8, l: '100' }, { x: 4, l: '150' }, { x: 0, l: 'reveal' }].map((f, i) => (
          <MF key={i} label={f.l}>
            <div style={{ width: 34, height: 26, borderRadius: 7, background: i === 4 ? '#4ADE80' : '#FF6B6B', transform: `translateX(${f.x}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>{i === 4 ? '✓' : '✗'}</div>
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'flame') {
    return (
      <div style={row}>
        <MF label="loop" w={120}>
          <div style={{ fontSize: 34, animation: 'fm-float 1.6s ease-in-out infinite', filter: 'drop-shadow(0 0 12px #FFB84D)' }}>🔥</div>
        </MF>
      </div>
    );
  }
  if (kind === 'counter') {
    return (
      <div style={row}>
        {['6', '6→7', '7'].map((v, i) => (
          <MF key={i} label={['eski', 'tick', 'yeni'][i]}>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24, color: '#F1F5F9', transform: i === 1 ? 'translateY(-6px) scale(1.1)' : 'none', opacity: i === 1 ? 0.6 : 1 }}>{v}</span>
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'progress') {
    return (
      <div style={row}>
        <MF label="fill + shimmer" w={160}>
          <div className="fm-track" style={{ width: 130 }}><div className="fm-fill fm-shimmer" style={{ width: '70%' }} /></div>
        </MF>
      </div>
    );
  }
  if (kind === 'stagger') {
    return (
      <div style={row}>
        {[0, 1, 2].map((i) => (
          <MF key={i} label={(i * 60) + 'ms'}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{ position: 'absolute', left: 8, right: 8, top: 14 + j * 18, height: 11, borderRadius: 4, background: '#16263a', border: '1px solid rgba(180,255,79,0.2)', opacity: j <= i ? 1 : 0.15, transform: j <= i ? 'none' : 'translateY(6px)' }} />
            ))}
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'tab') {
    return (
      <div style={row}>
        {[0, 1].map((i) => (
          <MF key={i} label={['Ana → Çalış', 'spring'][i]} w={92}>
            <div style={{ position: 'absolute', top: 10, left: 10 + i * 40, width: 22, height: 4, borderRadius: 9, background: '#B4FF4F', boxShadow: '0 0 8px rgba(180,255,79,0.5)', transition: 'left .28s' }} />
            <div style={{ display: 'flex', gap: 16, color: '#4A5C6E', fontSize: 14 }}><span style={{ color: i === 0 ? '#B4FF4F' : '#4A5C6E' }}>●</span><span style={{ color: i === 1 ? '#B4FF4F' : '#4A5C6E' }}>●</span></div>
          </MF>
        ))}
      </div>
    );
  }
  if (kind === 'press') {
    return (
      <div style={row}>
        {[{ s: 1, l: 'idle' }, { s: 0.95, l: 'press' }, { s: 1.02, l: 'spring' }, { s: 1, l: 'rest' }].map((f, i) => (
          <MF key={i} label={f.l}>
            <div style={{ width: 38, height: 22, borderRadius: 8, background: '#B4FF4F', transform: `scale(${f.s})`, filter: i === 1 ? 'brightness(0.9)' : 'none' }} />
          </MF>
        ))}
      </div>
    );
  }
  // sheet
  return (
    <div style={row}>
      {[100, 50, 0].map((y, i) => (
        <MF key={i} label={['100%', '50%', '0'][i]}>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.5 * (1 - y / 100)})` }} />
          <div style={{ position: 'absolute', left: 6, right: 6, bottom: 0, height: 40, borderRadius: '8px 8px 0 0', background: '#16263a', border: '1px solid rgba(255,255,255,0.1)', transform: `translateY(${y}%)` }}>
            <div style={{ width: 16, height: 3, borderRadius: 9, background: '#4A5C6E', margin: '5px auto' }} />
          </div>
        </MF>
      ))}
    </div>
  );
}

const SPECS = [
  { k: 'flip', name: 'Kart Flip', use: 'Flashcard · dokun', dur: '600ms (2 faz)', ease: 'cubic-bezier(.4,0,.2,1) + scale overshoot 1.03', props: 'rotateY · scale · opacity · glint' },
  { k: 'swipe', name: 'Swipe Gesture', use: 'Flashcard', dur: 'realtime 1:1 · release 250ms', ease: 'cubic-bezier(.4,0,1,1) · cancel: spring 280/24', props: 'translateX · rotate(±15°) · tint · ✓/✗' },
  { k: 'stack', name: 'Stack Geçişi', use: 'Flashcard', dur: '300ms · 80ms delay', ease: 'ease-out', props: 'scale 0.84→0.92→1 · translateY · opacity' },
  { k: 'correct', name: 'Doğru Feedback', use: 'Quiz · Flashcard', dur: '0/120/240/400/600ms', ease: 'spring overshoot 1.06', props: 'scale · box-shadow glow · ✓ pop' },
  { k: 'wrong', name: 'Yanlış Feedback', use: 'Quiz · Flashcard', dur: 'shake 300ms · 1200ms hold', ease: 'ease-in-out', props: 'translateX 8→-8→4→0 · color · reveal' },
  { k: 'flame', name: 'Streak Alev (ambient)', use: 'Stats · Home', dur: 'scale 1600ms · rot 2400ms · glow 1200ms', ease: 'cubic-bezier(.4,0,.6,1) loop', props: 'scale 1.08 · rotate ±2° · glow (≥30: amber→red)' },
  { k: 'counter', name: 'Sayaç Tick', use: 'Stats · streak', dur: 'out 200ms · in 250ms · 50ms delay', ease: 'spring 400/18', props: 'translateY ±100% · opacity · scale punch 1.15' },
  { k: 'progress', name: 'Progress + Shimmer', use: 'Çalış · Quiz', dur: 'fill 400ms · shimmer 2000ms loop', ease: 'cubic-bezier(.2,.8,.2,1)', props: 'width · shimmer band x' },
  { k: 'stagger', name: 'Liste Entrance', use: 'Kütüphane · Home', dur: '400ms/item · 60ms stagger', ease: 'cubic-bezier(.2,.8,.2,1)', props: 'translateY 24→0 · opacity' },
  { k: 'tab', name: 'Tab Indicator', use: 'Tab bar', dur: '280ms', ease: 'spring 280/22', props: 'indicator left · icon fill · label color' },
  { k: 'press', name: 'Buton Press', use: 'Tüm butonlar', dur: '120ms + spring', ease: 'spring 280/24', props: 'scale 0.95→1.02→1 · brightness · haptic' },
  { k: 'sheet', name: 'Bottom Sheet', use: 'Modallar', dur: '320ms · backdrop 200ms', ease: 'cubic-bezier(.2,.8,.2,1)', props: 'translateY 100%→0 · backdrop opacity' },
];

function SpecCard({ s }) {
  return (
    <div style={{ background: '#0C1422', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, color: '#F1F5F9' }}>{s.name}</span>
        <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#FFB84D' }}>{s.use}</span>
      </div>
      <Story kind={s.k} />
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '64px 1fr', gap: '6px 12px', fontFamily: 'Inter', fontSize: 11.5 }}>
        {[['Süre', s.dur], ['Easing', s.ease], ['Property', s.props]].map(([h, v]) => (
          <React.Fragment key={h}>
            <span style={{ color: '#4A5C6E', fontWeight: 600 }}>{h}</span>
            <span style={{ color: '#8899AB', fontFamily: 'Space Grotesk' }}>{v}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function AnimationSpec() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0A1019', borderRadius: 20, padding: '40px 44px', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, letterSpacing: '0.12em', color: '#FFB84D', textTransform: 'uppercase' }}>Motion System · Implementation Reference</div>
      <div style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 42, color: '#F1F5F9', margin: '8px 0 6px' }}>Animasyon spec'i</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {['iOS spring feel', 'damping 24–28', 'stagger entrance', 'haptic + visual', 'Apple-akıcı'].map((t) => (
          <span key={t} style={{ fontSize: 11.5, fontWeight: 500, padding: '5px 11px', borderRadius: 999, background: 'rgba(180,255,79,0.10)', color: '#B4FF4F', border: '1px solid rgba(180,255,79,0.2)' }}>{t}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 22 }}>
        {SPECS.map((s) => <SpecCard key={s.k} s={s} />)}
      </div>

      {/* reduced motion */}
      <div style={{ marginTop: 18, background: 'linear-gradient(150deg,#0E1726,#0C1422)', border: '1px solid rgba(180,255,79,0.18)', borderRadius: 16, padding: '18px 22px', display: 'flex', gap: 28, alignItems: 'center' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: '#B4FF4F' }}>Reduced Motion</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#4A5C6E', marginTop: 2 }}>prefers-reduced-motion</div>
        </div>
        <div style={{ display: 'flex', gap: 26, flex: 1, flexWrap: 'wrap' }}>
          {[['Transition', '→ 100ms\'e iner'], ['Spring', '→ düz cubic-bezier'], ['Confetti / ambient loop', '→ tamamen kapanır'], ['Kalan', 'yalnızca opacity + color']].map(([h, v]) => (
            <div key={h} style={{ minWidth: 150 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: '#F1F5F9' }}>{h}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#8899AB', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AnimationSpec });
