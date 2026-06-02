// screens-3.jsx — Stats (Streak / İstatistik) + Profile

function StatTile({ value, label, trend, accent }) {
  return (
    <div className="fm-card" style={{ flex: 1, padding: '16px 10px 14px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: `2px solid ${accent}` }}>
      <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', width: 90, height: 46, background: `radial-gradient(circle, color-mix(in srgb, ${accent} 28%, transparent), transparent 70%)`, pointerEvents: 'none' }} />
      <div className="fm-num" style={{ fontSize: 30, color: 'var(--text-primary)', position: 'relative' }}>{value}</div>
      <div className="fm-cap" style={{ marginTop: 2 }}>{label}</div>
      <div style={{ marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'Space Grotesk, sans-serif', fontSize: 10.5, fontWeight: 600, color: 'var(--success)', background: 'color-mix(in srgb, var(--success) 14%, transparent)', padding: '3px 8px', borderRadius: 99 }}>↑ {trend}</div>
    </div>
  );
}

function Stats({ dark }) {
  // 5 weeks x 7 days intensity (0..4)
  const levels = [
    'var(--bg-surface)',
    'color-mix(in srgb, var(--accent-primary) 30%, var(--bg-surface))',
    'color-mix(in srgb, var(--accent-primary) 55%, var(--bg-surface))',
    'color-mix(in srgb, var(--accent-primary) 78%, var(--bg-surface))',
    'var(--accent-primary)',
  ];
  const seed = [0,1,0,2,3,1,0, 1,2,3,2,0,1,0, 2,3,4,3,2,1,0, 0,1,3,4,3,2,1, 2,3,4,4,3,4,4];
  const badges = [
    { e: '🌱', on: true, l: 'İlk Adım' }, { e: '🔥', on: true, l: '7 Gün' },
    { e: '⚡', on: true, l: '100 Kelime' }, { e: '⭐', on: false, l: '30 Gün' },
    { e: '💎', on: false, l: 'Usta' },
  ];
  return (
    <Screen dark={dark}>
      <div style={{ padding: '4px 20px 60px' }}>
        <div className="fm-title" style={{ fontSize: 16, color: 'var(--text-secondary)' }}>İstatistikler</div>

        {/* hero streak */}
        <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
          <div style={{ fontSize: 64, animation: 'fm-float 3s ease-in-out infinite', filter: 'drop-shadow(0 0 24px var(--warning))' }}>🔥</div>
          <div className="fm-num" style={{ fontSize: 64, color: 'var(--text-primary)', lineHeight: 1 }}>7</div>
          <div className="fm-cap" style={{ marginTop: 4 }}>gün üst üste</div>
        </div>

        {/* stat tiles */}
        <div style={{ display: 'flex', gap: 12 }}>
          <StatTile value="312" label="Kelime" trend="12% bu hafta" accent="var(--warning)" />
          <StatTile value="48" label="Seans" trend="8 bu hafta" accent="var(--accent-secondary)" />
          <StatTile value="%87" label="Doğruluk" trend="%3" accent="var(--success)" />
        </div>

        {/* contribution grid */}
        <div className="fm-card" style={{ padding: 18, marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="fm-title" style={{ fontSize: 15, color: 'var(--text-primary)' }}>Son 35 Gün</span>
            <span className="fm-cap">Pzt – Paz</span>
          </div>
          <div className="fm-grid">
            {seed.map((v, i) => (
              <div key={i} className="fm-cell" style={{ background: levels[v], border: v === 0 ? '1px solid var(--border)' : 'none', boxShadow: v === 4 ? '0 0 8px var(--accent-glow)' : 'none' }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 14 }}>
            <span className="fm-cap">Az</span>
            {levels.map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: i === 0 ? '1px solid var(--border)' : 'none' }} />)}
            <span className="fm-cap">Çok</span>
          </div>
        </div>

        {/* badges */}
        <div className="fm-head" style={{ fontSize: 18, color: 'var(--text-primary)', margin: '24px 0 14px' }}>Rozetler</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          {badges.map((b) => (
            <div key={b.l} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, background: b.on ? 'var(--accent-glow)' : 'var(--bg-surface)',
                border: '1px solid ' + (b.on ? 'var(--border-accent)' : 'var(--border)'),
                filter: b.on ? 'none' : 'grayscale(1)', opacity: b.on ? 1 : 0.4,
              }}>{b.e}</div>
              <div className="fm-cap" style={{ marginTop: 6, fontSize: 10 }}>{b.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

function SettRow({ icon, label, detail, danger, muted, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px', borderBottom: last ? 'none' : '1px solid var(--divider)' }}>
      {icon && <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{icon}</span>}
      <span className="fm-body" style={{ flex: 1, fontSize: 15, color: danger ? 'var(--error)' : muted ? 'var(--text-muted)' : 'var(--text-primary)' }}>{label}</span>
      {detail && <span className="fm-cap" style={{ color: 'var(--text-secondary)' }}>{detail}</span>}
      {!danger && !muted && <Icon d={ICONS.arrow} size={16} stroke="var(--text-muted)" sw={2} />}
    </div>
  );
}

function Profile({ dark }) {
  return (
    <Screen dark={dark}>
      <div style={{ padding: '4px 20px 120px' }}>
        {/* avatar */}
        <div style={{ textAlign: 'center', padding: '14px 0 16px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))', boxShadow: '0 0 30px var(--accent-glow)' }}>
            <span className="fm-num" style={{ fontSize: 30, color: '#fff' }}>AE</span>
          </div>
          <div className="fm-head" style={{ fontSize: 22, color: 'var(--text-primary)' }}>Ahmet Eren</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '5px 12px', borderRadius: 999, background: 'var(--accent-glow)', border: '1px solid var(--border-accent)' }}>
            <span className="fm-num" style={{ fontSize: 11, color: 'var(--accent-primary)', letterSpacing: '0.03em' }}>SEVİYE · B1 INTERMEDIATE</span>
          </div>
        </div>

        {/* motivation layer */}
        <div style={{ borderRadius: 18, padding: '16px 18px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-accent)', background: 'linear-gradient(150deg, var(--bg-elevated), var(--bg-surface))', boxShadow: '0 0 34px var(--accent-glow)' }}>
          <div style={{ position: 'absolute', top: -34, right: -24, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)', pointerEvents: 'none' }} />
          <div className="fm-head" style={{ fontSize: 17, color: 'var(--text-primary)', position: 'relative' }}>Bu hafta 42 kelime öğrendin 🎉</div>
          <div className="fm-cap" style={{ marginTop: 3, position: 'relative' }}>Harika gidiyorsun — hedefin %84'ü tamam.</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, position: 'relative' }}>
            {[{ e: '🌱', l: 'İlk Adım' }, { e: '🔥', l: '7 Gün' }, { e: '⚡', l: '100 Kelime' }].map((b) => (
              <div key={b.l} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: 46, height: 46, margin: '0 auto', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: 'var(--accent-glow)', border: '1px solid var(--border-accent)' }}>{b.e}</div>
                <div className="fm-cap" style={{ marginTop: 5, fontSize: 10 }}>{b.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fm-label" style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '24px 4px 8px' }}>Ayarlar</div>
        <div className="fm-card" style={{ overflow: 'hidden' }}>
          <SettRow icon="🔔" label="Günlük Hatırlatma" detail="20:00" />
          <SettRow icon="🌓" label="Görünüm" detail="Otomatik" />
          <SettRow icon="🔒" label="Gizlilik" />
          <SettRow icon="📄" label="Gizlilik Politikası" />
          <SettRow icon="📋" label="Kullanım Koşulları" last />
        </div>

        <div className="fm-label" style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '24px 4px 8px' }}>Hesap</div>
        <div className="fm-card" style={{ overflow: 'hidden' }}>
          <SettRow label="Çıkış Yap" danger />
          <SettRow label="Hesabı Sil" muted last />
        </div>
      </div>
      <TabBar dark={dark} active="profile" />
    </Screen>
  );
}

Object.assign(window, { Stats, Profile });
