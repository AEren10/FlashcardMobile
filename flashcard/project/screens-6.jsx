// screens-6.jsx — Component Library reference board (dark + light parity)
// Wraps content in .fm-screen[data-theme] so design tokens resolve.

function LibSection({ title, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div className="fm-label" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function btnStateStyle(state) {
  switch (state) {
    case 'hover': return { filter: 'brightness(1.08)', boxShadow: '0 8px 20px var(--accent-glow)' };
    case 'pressed': return { transform: 'scale(0.95)', filter: 'brightness(0.9)' };
    case 'disabled': return { opacity: 0.38, filter: 'grayscale(0.3)' };
    case 'focus': return { boxShadow: '0 0 0 3px var(--accent-glow)' };
    default: return {};
  }
}
function LibBtn({ variant, state, children }) {
  const cls = 'fm-btn ' + (variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : variant === 'ghost' ? 'ghost' : '');
  const extra = variant === 'destructive' ? { background: 'var(--error)', color: '#fff' } : {};
  return <button className={cls} style={{ ...extra, ...btnStateStyle(state), pointerEvents: 'none', fontSize: 14, padding: '11px 16px' }}>{children}</button>;
}

function CircleProg({ pct }) {
  const r = 26, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--bg-surface)" strokeWidth="6" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--accent-primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 32 32)" style={{ filter: 'drop-shadow(0 0 4px var(--accent-glow))' }} />
      <text x="32" y="37" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="15" fill="var(--text-primary)">{pct}</text>
    </svg>
  );
}

function Toast({ kind, msg }) {
  const c = kind === 'success' ? 'var(--success)' : kind === 'error' ? 'var(--error)' : 'var(--info)';
  const d = kind === 'success' ? ICONS.check : kind === 'error' ? ICONS.x : ICONS.bolt;
  return (
    <div className="fm-card" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderLeft: `3px solid ${c}` }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: c + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c, flexShrink: 0 }}>
        <Icon d={d} size={16} stroke="currentColor" sw={2.4} />
      </div>
      <span className="fm-body" style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{msg}</span>
    </div>
  );
}

function Avatar({ size, ring, photo }) {
  const inner = (
    <div style={{ width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: photo ? 'linear-gradient(135deg,#5B7FFF,#B4FF4F)' : 'var(--bg-surface)', border: photo ? 'none' : '1px solid var(--border)' }}>
      {photo
        ? <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 6px, transparent 6px 12px), linear-gradient(135deg,#5B7FFF,#B4FF4F)' }} />
        : <span className="fm-num" style={{ fontSize: size * 0.36, color: 'var(--text-primary)' }}>AE</span>}
    </div>
  );
  if (!ring) return inner;
  return <div style={{ padding: 3, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))' }}>{inner}</div>;
}

function ComponentLibrary({ dark }) {
  const [seg, setSeg] = React.useState('Bugün');
  const [on, setOn] = React.useState(true);
  const states = ['default', 'hover', 'pressed', 'disabled', 'focus'];
  const variants = [['primary', 'Primary'], ['secondary', 'Secondary'], ['ghost', 'Ghost'], ['destructive', 'Destructive']];
  return (
    <div className="fm-screen" data-theme={dark ? 'dark' : 'light'} style={{ borderRadius: 20 }}>
      <div style={{ height: '100%', overflow: 'hidden', padding: '34px 38px', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, letterSpacing: '0.12em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Component Library</div>
        <div className="fm-display" style={{ fontSize: 34, color: 'var(--text-primary)', margin: '6px 0 26px' }}>{dark ? 'Dark' : 'Light'} · referans</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '0 48px' }}>
          {/* LEFT COLUMN */}
          <div>
            <LibSection title="Buttons — 4 variant × 5 state">
              <div style={{ display: 'grid', gridTemplateColumns: '78px repeat(5, 1fr)', gap: 9, alignItems: 'center' }}>
                <div />
                {states.map((s) => <div key={s} className="fm-cap" style={{ fontSize: 9.5, textAlign: 'center', textTransform: 'capitalize' }}>{s}</div>)}
                {variants.map(([v, label]) => (
                  <React.Fragment key={v}>
                    <div className="fm-cap" style={{ fontSize: 10 }}>{label}</div>
                    {states.map((s) => <div key={s} style={{ display: 'flex', justifyContent: 'center' }}><LibBtn variant={v} state={s}>Bas</LibBtn></div>)}
                  </React.Fragment>
                ))}
              </div>
            </LibSection>

            <LibSection title="Inputs — default · focus · password">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="fm-input">
                  <Icon d={ICONS.user} size={17} stroke="var(--text-muted)" />
                  <span style={{ color: 'var(--text-muted)' }}>Ad Soyad</span>
                </div>
                <div className="fm-input focus">
                  <Icon d={ICONS.home} size={17} stroke="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>ahmet@gmail.com</span>
                  <span style={{ marginLeft: 'auto', width: 2, height: 18, background: 'var(--accent-primary)', borderRadius: 2, animation: 'fm-caret 1s steps(1) infinite' }} />
                </div>
                <div className="fm-input">
                  <Icon d={ICONS.user} size={17} stroke="var(--text-muted)" />
                  <span style={{ letterSpacing: 4, color: 'var(--text-primary)' }}>••••••••</span>
                  <Icon d={ICONS.sound} size={16} stroke="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            </LibSection>

            <LibSection title="Chips & Badges — 5 variant">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="fm-chip">Neutral</span>
                <span className="fm-chip accent">Accent</span>
                <span className="fm-chip" style={{ background: 'color-mix(in srgb, var(--success) 16%, transparent)', color: 'var(--success)', borderColor: 'transparent' }}>Success</span>
                <span className="fm-chip" style={{ background: 'color-mix(in srgb, var(--warning) 18%, transparent)', color: 'var(--warning)', borderColor: 'transparent' }}>Warning</span>
                <span className="fm-chip" style={{ background: 'color-mix(in srgb, var(--error) 16%, transparent)', color: 'var(--error)', borderColor: 'transparent' }}>Error</span>
              </div>
            </LibSection>

            <LibSection title="Segmented · Switch · Progress">
              <Segmented items={['Bugün', 'Zor', 'Quiz']} value={seg} onChange={setSeg} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 16 }}>
                <div onClick={() => setOn(!on)} style={{ width: 50, height: 30, borderRadius: 99, padding: 3, cursor: 'pointer', background: on ? 'var(--accent-primary)' : 'var(--bg-surface)', border: '1px solid var(--border)', transition: 'background .2s', display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: on ? 'var(--text-on-accent)' : 'var(--text-muted)', transition: 'all .2s', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
                </div>
                <CircleProg pct={68} />
                <div style={{ flex: 1 }}>
                  <div className="fm-track"><div className="fm-fill fm-shimmer" style={{ width: '68%' }} /></div>
                  <div className="fm-cap" style={{ marginTop: 6 }}>Linear · %68</div>
                </div>
              </div>
            </LibSection>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <LibSection title="Cards — default · feature · flashcard mini">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="fm-card" style={{ padding: 16 }}>
                  <div className="fm-title" style={{ fontSize: 14, color: 'var(--text-primary)' }}>Default card</div>
                  <div className="fm-cap" style={{ marginTop: 3 }}>Nötr yüzey · ince kenarlık</div>
                </div>
                <div style={{ borderRadius: 16, padding: 16, border: '1px solid var(--border-accent)', background: 'linear-gradient(150deg, var(--bg-elevated), var(--bg-surface))', boxShadow: '0 0 30px var(--accent-glow)' }}>
                  <span className="fm-chip accent" style={{ fontSize: 10 }}>FEATURE</span>
                  <div className="fm-head" style={{ fontSize: 16, color: 'var(--text-primary)', marginTop: 8 }}>Öne çıkan kart</div>
                </div>
                <div style={{ width: 132, borderRadius: 14, padding: '14px 16px', background: 'linear-gradient(165deg, var(--bg-elevated), var(--bg-surface))', border: '1px solid var(--border-accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
                  <span className="fm-chip accent" style={{ fontSize: 9, padding: '3px 8px' }}>İng</span>
                  <div className="fm-display" style={{ fontSize: 24, color: 'var(--text-primary)', marginTop: 8 }}>Healthy</div>
                  <div className="fm-cap" style={{ fontSize: 10 }}>/ˈhelθi/</div>
                </div>
              </div>
            </LibSection>

            <LibSection title="List row · Toast">
              <div className="fm-card" style={{ overflow: 'hidden', marginBottom: 12 }}>
                {['Günlük Hatırlatma', 'Görünüm'].map((l, i) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderBottom: i === 0 ? '1px solid var(--divider)' : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}><Icon d={ICONS.flame} size={16} stroke="currentColor" /></div>
                    <span className="fm-body" style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{l}</span>
                    <Icon d={ICONS.arrow} size={15} stroke="var(--text-muted)" sw={2} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Toast kind="success" msg="Liste kaydedildi" />
                <Toast kind="error" msg="Bağlantı başarısız" />
                <Toast kind="info" msg="3 yeni kelime hazır" />
              </div>
            </LibSection>

            <LibSection title="Avatar — 24 / 32 / 48 / 64 · FAB">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                <Avatar size={24} /><Avatar size={32} photo /><Avatar size={48} /><Avatar size={64} ring photo />
                <div style={{ flex: 1 }} />
                <button className="fm-btn primary" style={{ width: 50, height: 50, borderRadius: 16, padding: 0, pointerEvents: 'none' }}><Icon d={ICONS.plus} size={24} stroke="currentColor" sw={2.4} /></button>
                <button className="fm-btn primary" style={{ borderRadius: 16, pointerEvents: 'none', fontSize: 14 }}><Icon d={ICONS.plus} size={18} stroke="currentColor" sw={2.4} /> Yeni Liste</button>
              </div>
            </LibSection>

            <LibSection title="Bottom sheet">
              <div style={{ borderRadius: '18px 18px 0 0', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderBottom: 'none', padding: '12px 18px 20px' }}>
                <div style={{ width: 40, height: 5, borderRadius: 99, background: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 14px' }} />
                <div className="fm-head" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Listeyi paylaş</div>
                <div className="fm-cap" style={{ marginTop: 3 }}>Sürükle tutamacı ile kapat</div>
              </div>
            </LibSection>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ComponentLibrary });
