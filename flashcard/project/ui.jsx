// ui.jsx — FlashcardMobile tokens + shared components
// Exports to window. CSS vars are injected per-frame so light/dark coexist.

const DARK_VARS = {
  '--bg-base': '#0A1019', '--bg-elevated': '#0E1726', '--bg-surface': '#14202E',
  '--accent-primary': '#B4FF4F', '--accent-glow': 'rgba(180,255,79,0.18)',
  '--accent-secondary': '#5B7FFF', '--accent-blue-glow': 'rgba(91,127,255,0.16)',
  '--success': '#4ADE80', '--warning': '#FFB84D', '--error': '#FF6B6B', '--info': '#4DC9FF',
  '--text-primary': '#F1F5F9', '--text-secondary': '#8899AB', '--text-muted': '#4A5C6E',
  '--text-on-accent': '#0A1019',
  '--border': 'rgba(255,255,255,0.06)', '--border-accent': 'rgba(180,255,79,0.20)',
  '--divider': 'rgba(255,255,255,0.05)',
};
const LIGHT_VARS = {
  '--bg-base': '#FAFBFC', '--bg-elevated': '#FFFFFF', '--bg-surface': '#F1F4F8',
  '--accent-primary': '#4A8E1F', '--accent-glow': 'rgba(74,142,31,0.12)',
  '--accent-secondary': '#3B5BDB', '--accent-blue-glow': 'rgba(59,91,219,0.10)',
  '--success': '#15803D', '--warning': '#B45309', '--error': '#B91C1C', '--info': '#0284C7',
  '--text-primary': '#0F1925', '--text-secondary': '#4A5C6E', '--text-muted': '#8899AB',
  '--text-on-accent': '#FFFFFF',
  '--border': 'rgba(15,25,37,0.08)', '--border-accent': 'rgba(74,142,31,0.28)',
  '--divider': 'rgba(15,25,37,0.05)',
};
const getVars = (dark) => (dark ? DARK_VARS : LIGHT_VARS);

// ── Screen shell: sets data-theme + base bg, clears status bar ──
function Screen({ dark, children, pad = 0, style = {} }) {
  return (
    <div className="fm-screen" data-theme={dark ? 'dark' : 'light'} style={style}>
      <div className="fm-scroll fm-noscroll" style={{ overflowY: 'auto' }}>
        <div style={{ paddingTop: 58, padding: pad ? `58px ${pad}px 0` : '58px 0 0' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Icons (outline / filled) ──
const Icon = ({ d, size = 24, stroke = 'currentColor', fill = 'none', sw = 1.8, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
    <path d={d} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  books: 'M4 5a1 1 0 0 1 1-1h4v16H5a1 1 0 0 1-1-1V5Zm6-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4V4Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  sound: 'M11 5 6 9H3v6h3l5 4V5Zm4 3a5 5 0 0 1 0 8m2.5-11a8 8 0 0 1 0 14',
  flame: 'M12 3c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.3-2-.8-2.7C16.5 9 18 11 18 14a6 6 0 1 1-12 0c0-4 4-6 6-11Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 13l4 4L19 7',
  x: 'M6 6l12 12M18 6 6 18',
  star: 'M12 3l2.6 5.6L21 9.3l-4.5 4.3 1.1 6.4L12 17l-5.6 3 1.1-6.4L3 9.3l6.4-.7L12 3Z',
};

// ── Floating glass tab bar ──
function TabBar({ dark, active = 'home' }) {
  const tabs = [
    { k: 'home', label: 'Ana Sayfa', d: ICONS.home },
    { k: 'study', label: 'Çalış', d: ICONS.bolt },
    { k: 'library', label: 'Kütüphane', d: ICONS.books },
    { k: 'profile', label: 'Profil', d: ICONS.user },
  ];
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 26, height: 64,
      borderRadius: 22, display: 'flex', alignItems: 'center',
      background: dark ? 'rgba(14,23,38,0.72)' : 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid var(--border)',
      boxShadow: dark ? '0 12px 32px rgba(0,0,0,0.45)' : '0 12px 32px rgba(15,25,37,0.10)',
      zIndex: 30,
    }}>
      {tabs.map((t) => {
        const on = t.k === active;
        return (
          <div key={t.k} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            position: 'relative', color: on ? 'var(--accent-primary)' : 'var(--text-muted)',
          }}>
            {on && <div style={{ position: 'absolute', top: -10, width: 24, height: 4, borderRadius: 99, background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-glow)' }} />}
            <Icon d={t.d} size={23} fill={on ? 'var(--accent-glow)' : 'none'} stroke="currentColor" sw={on ? 1.6 : 1.7} />
            <span className="fm-label" style={{ fontSize: 10.5 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Segmented control (interactive) ──
function Segmented({ items, value, onChange }) {
  const i = Math.max(0, items.indexOf(value));
  const w = 100 / items.length;
  return (
    <div className="fm-seg">
      <div className="fm-seg-ind" style={{ left: `calc(${i * w}% + 4px)`, width: `calc(${w}% - 8px)` }} />
      {items.map((it) => (
        <div key={it} className={'fm-seg-btn' + (it === value ? ' on' : '')} onClick={() => onChange(it)}>{it}</div>
      ))}
    </div>
  );
}

// ── Abstract geometric illustrations (NO mascot, simple shapes only) ──
function Illu({ kind, dark }) {
  const lime = dark ? '#B4FF4F' : '#4A8E1F';
  const blue = dark ? '#5B7FFF' : '#3B5BDB';
  const dim = dark ? 'rgba(180,255,79,0.10)' : 'rgba(74,142,31,0.08)';
  const wrap = (children) => (
    <div style={{ width: 200, height: 200, position: 'relative', margin: '0 auto', animation: 'fm-blob 6s ease-in-out infinite' }}>
      <div style={{ position: 'absolute', inset: '8%', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${dim}, transparent 70%)`, filter: 'blur(8px)' }} />
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'relative' }}>{children}</svg>
    </div>
  );
  if (kind === 'network') {
    const nodes = [[100, 40], [50, 90], [150, 85], [70, 150], [140, 150], [100, 105]];
    const edges = [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [0, 1], [0, 2], [3, 4]];
    return wrap(<g>
      {edges.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={lime} strokeWidth="1.5" strokeOpacity="0.35" />)}
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 5 ? 11 : 7} fill={i === 5 ? lime : (i % 2 ? blue : lime)} opacity={i === 5 ? 1 : 0.85} />)}
    </g>);
  }
  if (kind === 'stack') {
    return wrap(<g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={45 + i * 3} y={120 - i * 26} width={110 - i * 6} height={50} rx={14}
          fill={i === 3 ? lime : 'none'} stroke={i === 3 ? 'none' : (i % 2 ? blue : lime)} strokeWidth="2" opacity={0.4 + i * 0.2} />
      ))}
    </g>);
  }
  // rising graph / flame
  return wrap(<g>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={36 + i * 28} y={150 - i * 22} width={18} height={20 + i * 22} rx={8}
        fill={i === 4 ? lime : dim} stroke={i === 4 ? 'none' : (i % 2 ? blue : lime)} strokeWidth="1.5" opacity={i === 4 ? 1 : 0.6} />
    ))}
    <path d="M40 150 L68 128 L96 106 L124 84 L152 62" stroke={lime} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeOpacity="0.9" />
  </g>);
}

// ── Semantic category palette (brand-aligned, saturated → muted) ──
const CATS = {
  daily:    { name: 'Günlük Hayat', stops: ['#6FCB3E', '#3E8F1E', '#2C6614'] },
  business: { name: 'İş',           stops: ['#6E8CFF', '#3B5BDB', '#27408F'] },
  travel:   { name: 'Seyahat',      stops: ['#FFC861', '#F59E0B', '#B45309'] },
  academic: { name: 'Akademik',     stops: ['#B07BEA', '#8B5CF6', '#5B2E94'] },
  popular:  { name: 'Popüler',      stops: ['#FF8B73', '#F4674E', '#B23A2E'] },
  other:    { name: 'Diğer',        stops: ['#94A2B2', '#6B7785', '#48535F'] },
};
const catBg = (cat) => {
  const s = (CATS[cat] || CATS.other).stops;
  return `linear-gradient(135deg, ${s[0]}, ${s[1]} 52%, ${s[2]})`;
};
// small pill naming the category, placed over a gradient band
function catChip(cat) {
  const c = CATS[cat] || CATS.other;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 600,
      fontSize: 10.5, letterSpacing: '0.04em', textTransform: 'uppercase',
      padding: '4px 9px', borderRadius: 999, color: '#fff',
      background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.22)',
    }}>{c.name}</span>
  );
}

Object.assign(window, { DARK_VARS, LIGHT_VARS, getVars, Screen, Icon, ICONS, TabBar, Segmented, Illu, CATS, catBg, catChip });
