// screens-1.jsx — Onboarding (3 slides) + Home (Ana Sayfa)

function Onboarding({ dark, start = 0 }) {
  const slides = [
    { kind: 'network', title: 'Akıllı Tekrar', body: 'Beynin unutmaya başladığı an kelimeyi karşına çıkarıyoruz. Bilim destekli aralıklı tekrar.' },
    { kind: 'stack', title: 'Kendi Listeni Yarat', body: 'Dilediğin kelimeleri ekle, kendi destelerini oluştur, istediğin gibi düzenle.' },
    { kind: 'graph', title: 'Seriyi Koru', body: 'Her gün biraz çalış, serini büyüt. Küçük adımlar, kalıcı ilerleme.' },
  ];
  const [i, setI] = React.useState(start);
  const s = slides[i];
  const last = i === slides.length - 1;
  return (
    <Screen dark={dark} pad={28}>
      <div style={{ minHeight: 690, display: 'flex', flexDirection: 'column' }}>
        {/* progress dots */}
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', paddingTop: 6 }}>
          {slides.map((_, k) => (
            <div key={k} style={{
              height: 6, borderRadius: 99, transition: 'width .3s, background .3s',
              width: k === i ? 26 : 6,
              background: k === i ? 'var(--accent-primary)' : 'var(--bg-surface)',
              boxShadow: k === i ? '0 0 10px var(--accent-glow)' : 'none',
            }} />
          ))}
        </div>
        {/* hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
          <div key={i + 'illu'}><Illu kind={s.kind} dark={dark} /></div>
          <div key={i + 'txt'} style={{ textAlign: 'center' }}>
            <div className="fm-display" style={{ fontSize: 40, color: 'var(--text-primary)', marginBottom: 14 }}>{s.title}</div>
            <p className="fm-body" style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 290, margin: '0 auto' }}>{s.body}</p>
          </div>
        </div>
        {/* CTA */}
        <div style={{ paddingBottom: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button className="fm-btn primary block" onClick={() => setI((p) => (p + 1) % slides.length)}>
            {last ? 'Başla' : 'Devam'} <Icon d={ICONS.arrow} size={18} stroke="currentColor" sw={2.2} />
          </button>
          {!last && <div className="fm-cap" style={{ textAlign: 'center' }}>Atla</div>}
        </div>
      </div>
    </Screen>
  );
}

function StatBox({ children, style }) {
  return <div className="fm-card" style={{ padding: 16, ...style }}>{children}</div>;
}

function ContinueCard({ title, sub, pct, cat }) {
  return (
    <div style={{ flexShrink: 0, width: 150 }}>
      <div style={{ height: 86, borderRadius: 14, marginBottom: 10, position: 'relative', overflow: 'hidden', background: catBg(cat) }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 80% at 80% 10%, rgba(255,255,255,0.22), transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 10, left: 12 }}>{catChip(cat)}</div>
      </div>
      <div className="fm-title" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{title}</div>
      <div className="fm-cap" style={{ marginTop: 2 }}>{sub}</div>
      <div className="fm-track" style={{ marginTop: 8, height: 5 }}><div className="fm-fill" style={{ width: pct + '%' }} /></div>
    </div>
  );
}

function Home({ dark }) {
  return (
    <Screen dark={dark}>
      <div style={{ padding: '4px 20px 120px' }}>
        {/* greeting */}
        <div className="fm-cap" style={{ color: 'var(--text-secondary)' }}>Günaydın 👋</div>
        <div className="fm-display" style={{ fontSize: 38, color: 'var(--text-primary)', marginTop: 2 }}>Ahmet</div>

        {/* stats row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <StatBox style={{ width: 104, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)' }}>
              <Icon d={ICONS.flame} size={18} fill="var(--warning)" stroke="var(--warning)" />
              <span className="fm-num" style={{ fontSize: 26, color: 'var(--text-primary)' }}>7</span>
            </div>
            <div className="fm-cap" style={{ marginTop: 6 }}>günlük seri</div>
          </StatBox>
          <StatBox style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="fm-title" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Günlük hedef</span>
              <span className="fm-num" style={{ fontSize: 15, color: 'var(--text-primary)' }}>3<span style={{ color: 'var(--text-muted)' }}>/10</span></span>
            </div>
            <div className="fm-track" style={{ marginTop: 14 }}><div className="fm-fill" style={{ width: '30%' }} /></div>
            <div className="fm-cap" style={{ marginTop: 8 }}>7 kelime kaldı</div>
          </StatBox>
        </div>

        {/* hero challenge card */}
        <div style={{ marginTop: 16, borderRadius: 20, padding: 22, position: 'relative', overflow: 'hidden', border: '1px solid var(--border-accent)', background: 'linear-gradient(150deg, var(--bg-elevated), var(--bg-surface))', boxShadow: '0 0 40px var(--accent-glow)' }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }} />
          <div className="fm-chip accent" style={{ position: 'relative' }}>
            <Icon d={ICONS.bolt} size={13} fill="currentColor" stroke="currentColor" /> GÜNÜN MEYDAN OKUMASI
          </div>
          <div className="fm-head" style={{ fontSize: 24, color: 'var(--text-primary)', marginTop: 14, position: 'relative' }}>5 Yeni Kelime Öğren</div>
          <div className="fm-cap" style={{ marginTop: 4, position: 'relative' }}>~2 dakika · kolay tempo</div>
          <button className="fm-btn primary" style={{ marginTop: 18, position: 'relative' }}>Başla <Icon d={ICONS.arrow} size={17} stroke="currentColor" sw={2.2} /></button>
        </div>

        {/* continue */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 26 }}>
          <span className="fm-head" style={{ fontSize: 18, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Devam Et</span>
          <span className="fm-cap" style={{ color: 'var(--accent-secondary)' }}>Tümü</span>
        </div>
        <div className="fm-noscroll" style={{ display: 'flex', gap: 14, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
          <ContinueCard title="Günlük İngilizce" sub="50 kelime · %62" pct={62} cat="daily" />
          <ContinueCard title="İş İngilizcesi" sub="80 kelime · %34" pct={34} cat="business" />
          <ContinueCard title="Seyahat" sub="40 kelime · %88" pct={88} cat="travel" />
        </div>
      </div>
      <TabBar dark={dark} active="home" />
    </Screen>
  );
}

Object.assign(window, { Onboarding, Home });
