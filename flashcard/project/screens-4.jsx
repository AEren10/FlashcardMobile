// screens-4.jsx — Empty states (3) + Quiz mode
// Abstract geometric illustrations only (no mascot). Exports EmptyState, QuizMode.

// ── Abstract empty-state illustrations (simple shapes, gentle ambient motion) ──
function EmptyIllu({ kind, dark }) {
  const lime = dark ? '#B4FF4F' : '#4A8E1F';
  const blue = dark ? '#5B7FFF' : '#3B5BDB';
  const warn = dark ? '#FFB84D' : '#B45309';
  const dim = dark ? 'rgba(180,255,79,0.10)' : 'rgba(74,142,31,0.07)';
  const line = dark ? 'rgba(255,255,255,0.14)' : 'rgba(15,25,37,0.12)';
  const W = (children, anim) => (
    <div style={{ width: 188, height: 188, position: 'relative', margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: '12%', borderRadius: '50%', background: `radial-gradient(circle at 40% 30%, ${dim}, transparent 70%)`, filter: 'blur(10px)' }} />
      <svg width="188" height="188" viewBox="0 0 188 188" style={{ position: 'relative', overflow: 'visible' }}>{children}</svg>
    </div>
  );
  if (kind === 'list') {
    // empty stacked cards, top one floating
    return W(
      <g>
        <rect x="44" y="118" width="100" height="34" rx="12" fill="none" stroke={line} strokeWidth="2" />
        <rect x="50" y="96" width="88" height="32" rx="12" fill="none" stroke={line} strokeWidth="2" />
        <g style={{ animation: 'fm-float 2.4s ease-in-out infinite', transformOrigin: 'center' }}>
          <rect x="54" y="58" width="80" height="40" rx="13" fill="none" stroke={lime} strokeWidth="2.4" />
          <line x1="68" y1="74" x2="104" y2="74" stroke={lime} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.55" />
          <line x1="68" y1="84" x2="92" y2="84" stroke={lime} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.3" />
          <circle cx="120" cy="50" r="11" fill={lime} fillOpacity="0.18" stroke={lime} strokeWidth="2" />
          <path d="M116 50h8M120 46v8" stroke={lime} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </g>
    );
  }
  if (kind === 'offline') {
    // broken cloud (two halves drifting) + lost signal arcs
    return W(
      <g>
        <g style={{ animation: 'fm-drift-l 3s ease-in-out infinite' }}>
          <path d="M58 110a20 20 0 0 1 4-39 26 26 0 0 1 24-14" fill="none" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M58 110h26" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <g style={{ animation: 'fm-drift-r 3s ease-in-out infinite' }}>
          <path d="M132 110a18 18 0 0 0-2-37 26 26 0 0 0-22-16" fill="none" stroke={blue} strokeWidth="2.6" strokeLinecap="round" strokeOpacity="0.9" />
          <path d="M132 110h-30" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <path d="M78 132q16-14 32 0" fill="none" stroke={warn} strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M70 146q24-20 48 0" fill="none" stroke={warn} strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.3" />
        <circle cx="94" cy="156" r="3.2" fill={warn} />
      </g>
    );
  }
  // search — magnifier + question mark, gentle sway
  return W(
    <g style={{ animation: 'fm-sway 2.6s ease-in-out infinite', transformOrigin: '94px 94px' }}>
      <circle cx="86" cy="84" r="34" fill="none" stroke={lime} strokeWidth="3" />
      <line x1="110" y1="108" x2="134" y2="132" stroke={lime} strokeWidth="5" strokeLinecap="round" />
      <text x="86" y="96" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="34" fill={blue}>?</text>
    </g>
  );
}

function EmptyState({ dark, kind = 'list' }) {
  const cfg = {
    list:    { title: 'Henüz liste yok', body: 'Kendi kelime listeni oluştur, çalışmaya hemen başla.', cta: 'İlk Listeni Oluştur', primary: true },
    offline: { title: 'Bağlantı yok', body: 'İnternet bağlantını kontrol et ve tekrar dene.', cta: 'Tekrar Dene', primary: false },
    search:  { title: 'Sonuç bulunamadı', body: '“academik” için eşleşme yok. Belki şunları denersin:', cta: null, primary: false },
  }[kind];
  return (
    <Screen dark={dark}>
      <div style={{ minHeight: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <EmptyIllu kind={kind} dark={dark} />
        <div className="fm-display" style={{ fontSize: 30, color: 'var(--text-primary)', marginTop: 26 }}>{cfg.title}</div>
        <p className="fm-body" style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 280, marginTop: 10 }}>{cfg.body}</p>
        {cfg.cta && (
          <button className={'fm-btn ' + (cfg.primary ? 'primary' : 'secondary')} style={{ marginTop: 24, minWidth: 200 }}>
            {cfg.primary && <Icon d={ICONS.plus} size={18} stroke="currentColor" sw={2.4} />}{cfg.cta}
          </button>
        )}
        {kind === 'search' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 22 }}>
            {['Akademik İngilizce', 'TOEFL', 'İş İngilizcesi'].map((s) => (
              <span key={s} className="fm-chip accent">{s}</span>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}

// ── Quiz mode ────────────────────────────────────────────────────────────────
const QUIZ = [
  { q: 'Difficult', sub: 'Bu kelimenin anlamı?', opts: ['Kolay', 'Zor', 'Hızlı', 'Güzel'], a: 1 },
  { q: 'Healthy',   sub: 'Bu kelimenin anlamı?', opts: ['Hasta', 'Zengin', 'Sağlıklı', 'Yorgun'], a: 2 },
  { q: 'Famous',    sub: 'Bu kelimenin anlamı?', opts: ['Ünlü', 'Gizli', 'Yavaş', 'Ucuz'], a: 0 },
];

function QuizMode({ dark, start = 0, frozenPick = null }) {
  const TOTAL = 12;
  const [n, setN] = React.useState(2);                 // question number (0-based) → shows n+1/12
  const [picked, setPicked] = React.useState(frozenPick); // index user tapped
  const Q = QUIZ[n % QUIZ.length];
  const locked = picked != null;
  const correct = locked && picked === Q.a;

  const pick = (i) => {
    if (locked) return;
    setPicked(i);
    const right = i === Q.a;
    setTimeout(() => { setPicked(null); setN((p) => Math.min(TOTAL - 1, p + 1)); }, right ? 650 : 1250);
  };

  // button visual state
  const btnState = (i) => {
    if (!locked) return 'idle';
    if (i === Q.a) return 'right';          // always reveal the correct one
    if (i === picked) return 'wrong';       // the wrong pick
    return 'dim';
  };

  return (
    <Screen dark={dark}>
      {/* header: progress + counter */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon d={ICONS.x} size={22} stroke="var(--text-secondary)" />
          <div className="fm-track" style={{ flex: 1 }}>
            <div className="fm-fill fm-shimmer" style={{ width: `${((n + 1) / TOTAL) * 100}%` }} />
          </div>
          <span className="fm-num" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{n + 1}/{TOTAL}</span>
        </div>
      </div>

      {/* prompt */}
      <div style={{ textAlign: 'center', padding: '46px 24px 0' }}>
        <span className="fm-chip accent">Quiz · Çoktan seçmeli</span>
        <div className="fm-display" style={{ fontSize: 52, color: 'var(--text-primary)', marginTop: 22 }}>{Q.q}</div>
        <div className="fm-cap" style={{ marginTop: 8 }}>{Q.sub}</div>
      </div>

      {/* 2×2 options */}
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {Q.opts.map((opt, i) => {
          const st = btnState(i);
          const bg = st === 'right' ? 'var(--success)' : st === 'wrong' ? 'var(--error)' : 'var(--bg-elevated)';
          const fg = st === 'right' || st === 'wrong' ? '#fff' : 'var(--text-primary)';
          const bd = st === 'right' ? 'var(--success)' : st === 'wrong' ? 'var(--error)' : 'var(--border)';
          return (
            <button key={opt} onClick={() => pick(i)}
              className={st === 'right' ? 'qz-pop' : st === 'wrong' ? 'fc-shake' : ''}
              style={{
                position: 'relative', padding: '20px 14px', borderRadius: 16, cursor: locked ? 'default' : 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 17,
                background: bg, color: fg, border: `1.5px solid ${bd}`,
                opacity: st === 'dim' ? 0.45 : 1,
                boxShadow: st === 'right' ? '0 0 24px rgba(74,222,128,0.5)' : 'none',
                transition: 'background .18s, color .18s, border-color .18s, opacity .18s',
              }}>
              {opt}
              {st === 'right' && <span style={{ position: 'absolute', top: 8, right: 10 }}><Icon d={ICONS.check} size={18} stroke="#fff" sw={2.8} /></span>}
              {st === 'wrong' && <span style={{ position: 'absolute', top: 8, right: 10 }}><Icon d={ICONS.x} size={18} stroke="#fff" sw={2.8} /></span>}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}

Object.assign(window, { EmptyState, QuizMode, EmptyIllu, QUIZ });
