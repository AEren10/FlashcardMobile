// screens-2.jsx — Study (Çalış, 3 sub-tabs) + Library (Kütüphane, 3 sub-tabs)

function SectionHead({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '24px 0 12px' }}>
      <span className="fm-head" style={{ fontSize: 18, color: 'var(--text-primary)' }}>{children}</span>
      {right && <span className="fm-cap" style={{ color: 'var(--accent-secondary)' }}>{right}</span>}
    </div>
  );
}

function DueRow({ label, count, color, icon }) {
  return (
    <div className="fm-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, marginBottom: 10 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        <Icon d={icon} size={20} stroke="currentColor" />
      </div>
      <div style={{ flex: 1 }}>
        <div className="fm-title" style={{ fontSize: 15, color: 'var(--text-primary)' }}>{label}</div>
      </div>
      <span className="fm-num" style={{ fontSize: 20, color: 'var(--text-primary)' }}>{count}</span>
      <Icon d={ICONS.arrow} size={18} stroke="var(--text-muted)" sw={2} />
    </div>
  );
}

function Study({ dark }) {
  const [tab, setTab] = React.useState('Bugün');
  const hard = [
    { en: 'Ambiguous', tr: 'Belirsiz', miss: 3 },
    { en: 'Inevitable', tr: 'Kaçınılmaz', miss: 2 },
    { en: 'Thorough', tr: 'Titiz, eksiksiz', miss: 2 },
    { en: 'Reluctant', tr: 'İsteksiz', miss: 4 },
  ];
  const quizLists = [
    { t: 'Günlük İngilizce', n: 50, cat: 'daily' }, { t: 'İş İngilizcesi', n: 80, cat: 'business' },
    { t: 'Seyahat', n: 40, cat: 'travel' }, { t: 'Akademik', n: 120, cat: 'academic' },
  ];
  return (
    <Screen dark={dark}>
      <div style={{ padding: '6px 20px 120px' }}>
        <div className="fm-display" style={{ fontSize: 34, color: 'var(--text-primary)', marginBottom: 18 }}>Çalış</div>
        <Segmented items={['Bugün', 'Zor Kelimeler', 'Quiz']} value={tab} onChange={setTab} />

        {tab === 'Bugün' && (
          <div>
            <div style={{ marginTop: 18, borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden', border: '1px solid var(--border-accent)', background: 'linear-gradient(150deg, var(--bg-elevated), var(--bg-surface))', boxShadow: '0 0 40px var(--accent-glow)' }}>
              <div style={{ position: 'absolute', top: -50, right: -40, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }} />
              <div className="fm-num" style={{ fontSize: 46, color: 'var(--accent-primary)', position: 'relative' }}>12</div>
              <div className="fm-head" style={{ fontSize: 20, color: 'var(--text-primary)', position: 'relative' }}>kelime bugün hazır</div>
              <button className="fm-btn primary block" style={{ marginTop: 18, position: 'relative' }}>Çalışmaya Başla <Icon d={ICONS.arrow} size={18} stroke="currentColor" sw={2.2} /></button>
            </div>
            <SectionHead>Kategoriler</SectionHead>
            <DueRow label="Yeni" count={5} color="var(--accent-secondary)" icon={ICONS.plus} />
            <DueRow label="Tekrar" count={4} color="var(--accent-primary)" icon={ICONS.bolt} />
            <DueRow label="Unutulmuş" count={3} color="var(--error)" icon={ICONS.flame} />
          </div>
        )}

        {tab === 'Zor Kelimeler' && (
          <div style={{ marginTop: 18 }}>
            {hard.map((w) => (
              <div key={w.en} className="fm-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div className="fm-title" style={{ fontSize: 16, color: 'var(--text-primary)' }}>{w.en}</div>
                  <div className="fm-cap" style={{ marginTop: 2 }}>{w.tr}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    {Array.from({ length: 4 }).map((_, k) => (
                      <div key={k} style={{ width: 7, height: 7, borderRadius: '50%', background: k < w.miss ? 'var(--error)' : 'var(--bg-surface)' }} />
                    ))}
                  </div>
                  <div className="fm-cap" style={{ marginTop: 5, color: 'var(--error)' }}>{w.miss}× yanlış</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Quiz' && (
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quizLists.map((l) => {
              return (
                <div key={l.t} className="fm-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 70, background: catBg(l.cat), position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 70% at 75% 15%, rgba(255,255,255,0.25), transparent 60%)' }} />
                    <div style={{ position: 'absolute', left: 10, bottom: 10 }}>{catChip(l.cat)}</div>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div className="fm-title" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{l.t}</div>
                    <div className="fm-cap" style={{ marginTop: 3 }}>{l.n} kelime</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <TabBar dark={dark} active="study" />
    </Screen>
  );
}

function ListCard({ title, level, count, learners, fav, cat = 'other' }) {
  return (
    <div className="fm-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ height: 72, background: catBg(cat), position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 80% at 80% 10%, rgba(255,255,255,0.28), transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 14 }}>{catChip(cat)}</div>
        {fav && <div style={{ position: 'absolute', top: 12, right: 12, color: '#fff' }}><Icon d={ICONS.star} size={20} fill="#fff" stroke="#fff" /></div>}
      </div>
      <div style={{ padding: 16 }}>
        <div className="fm-head" style={{ fontSize: 17, color: 'var(--text-primary)' }}>{title}</div>
        <div className="fm-cap" style={{ marginTop: 3 }}>{level} · {count} kelime</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div className="fm-cap" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
            <Icon d={ICONS.flame} size={14} fill="var(--warning)" stroke="var(--warning)" /> {learners} kişi çalışıyor
          </div>
          <button className="fm-btn secondary" style={{ padding: '8px 16px', fontSize: 14 }}>Çalış <Icon d={ICONS.arrow} size={15} stroke="currentColor" sw={2.2} /></button>
        </div>
      </div>
    </div>
  );
}

function Library({ dark }) {
  const [tab, setTab] = React.useState('Listelerim');
  const data = {
    'Listelerim': [
      { title: 'Günlük İngilizce', level: 'Başlangıç', count: 50, learners: 142, cat: 'daily' },
      { title: 'İş İngilizcesi', level: 'Orta', count: 80, learners: 89, cat: 'business' },
    ],
    'Favoriler': [
      { title: 'Seyahat Kelimeleri', level: 'Başlangıç', count: 40, learners: 210, fav: true, cat: 'travel' },
      { title: 'Akademik İngilizce', level: 'İleri', count: 120, learners: 64, fav: true, cat: 'academic' },
    ],
    'Keşfet': [
      { title: 'TOEFL 700', level: 'İleri', count: 700, learners: 1820, cat: 'academic' },
      { title: 'Günlük Deyimler', level: 'Orta', count: 95, learners: 540, cat: 'popular' },
    ],
  };
  return (
    <Screen dark={dark}>
      <div style={{ padding: '6px 20px 120px' }}>
        <div className="fm-display" style={{ fontSize: 34, color: 'var(--text-primary)', marginBottom: 18 }}>Kütüphane</div>
        <Segmented items={['Listelerim', 'Favoriler', 'Keşfet']} value={tab} onChange={setTab} />
        <div key={tab} style={{ marginTop: 18 }}>
          {data[tab].map((l) => <ListCard key={l.title} {...l} />)}
        </div>
      </div>
      {/* FAB */}
      <button className="fm-btn primary" style={{ position: 'absolute', right: 18, bottom: 104, width: 56, height: 56, borderRadius: 18, padding: 0, boxShadow: '0 8px 24px var(--accent-glow), 0 0 0 1px var(--border-accent)' }}>
        <Icon d={ICONS.plus} size={26} stroke="currentColor" sw={2.4} />
      </button>
      <TabBar dark={dark} active="library" />
    </Screen>
  );
}

Object.assign(window, { Study, Library });
