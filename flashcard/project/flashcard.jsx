// flashcard.jsx — the hero study screen. Classic variant only.
// Real 3D flip · swipe glow + corner icons · stack peek · tutorial overlay · feedback.
// Exports: FlashcardScreen ({ dark, deckTitle, pose }) + FlashcardState (static storyboard frames)

// B1–B2 level demo vocabulary (target audience: Turkish learners)
const DECK = [
  { en: 'Beautiful', tr: 'Güzel',   ipa: '/ˈbjuːtɪfl/',  ex: 'She has a beautiful smile.',          tag: 'sıfat' },
  { en: 'Important', tr: 'Önemli',  ipa: '/ɪmˈpɔːtnt/',  ex: 'This is an important decision.',       tag: 'sıfat' },
  { en: 'Difficult', tr: 'Zor',     ipa: '/ˈdɪfɪkəlt/',  ex: 'The exam was really difficult.',       tag: 'sıfat' },
  { en: 'Famous',    tr: 'Ünlü',    ipa: '/ˈfeɪməs/',    ex: 'He is a famous football player.',      tag: 'sıfat' },
  { en: 'Healthy',   tr: 'Sağlıklı', ipa: '/ˈhelθi/',    ex: 'Eating fruit keeps you healthy.',      tag: 'sıfat' },
];

function Confetti({ on }) {
  if (!on) return null;
  const cols = ['#B4FF4F', '#5B7FFF', '#4ADE80', '#FFB84D'];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 40 }}>
      {Array.from({ length: 28 }).map((_, i) => {
        const left = Math.random() * 100, delay = Math.random() * 0.15, dur = 0.9 + Math.random() * 0.6;
        const size = 6 + Math.random() * 6;
        return <div key={i} style={{
          position: 'absolute', top: '30%', left: left + '%', width: size, height: size * 1.4,
          background: cols[i % cols.length], borderRadius: 2,
          animation: `fm-conf ${dur}s ${delay}s ease-out forwards`, opacity: 0,
        }} />;
      })}
    </div>
  );
}

// One physical face of the card (front = English prompt, back = Turkish + example)
function CardFace({ face }) {
  const isFront = face === 'front';
  return (
    <div className={'fc-face' + (isFront ? '' : ' fc-back')} style={{
      background: isFront
        ? 'linear-gradient(165deg, var(--bg-elevated), var(--bg-surface))'
        : 'linear-gradient(200deg, var(--bg-surface), var(--bg-elevated))',
      border: '1px solid var(--border-accent)',
      boxShadow: '0 0 40px var(--accent-glow), 0 20px 40px rgba(0,0,0,0.25)',
      padding: '22px 24px',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: isFront
        ? 'radial-gradient(90% 70% at 20% 12%, var(--accent-glow), transparent 60%)'
        : 'radial-gradient(90% 70% at 80% 88%, var(--accent-blue-glow), transparent 60%)', pointerEvents: 'none' }} />
      {/* glint sweep on flip */}
      <div className="fc-glint" />
      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <span className={'fm-chip' + (isFront ? ' accent' : ' blue')}>{isFront ? 'İngilizce' : 'Türkçe'}</span>
        {isFront && (
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <Icon d={ICONS.sound} size={19} stroke="currentColor" />
          </div>
        )}
      </div>
      {/* center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative', textAlign: 'center' }}>
        <div className="fm-display" style={{ fontSize: isFront ? 52 : 46, color: 'var(--text-primary)' }}>{isFront ? CARD.en : CARD.tr}</div>
        {isFront
          ? <div className="fm-cap" style={{ color: 'var(--text-muted)', fontSize: 14 }}>{CARD.ipa} · {CARD.tag}</div>
          : <div className="fm-display" style={{ fontStyle: 'italic', fontSize: 19, color: 'var(--text-secondary)', maxWidth: 250, lineHeight: 1.4 }}>“{CARD.ex}”</div>}
      </div>
      {/* bottom hint */}
      <div className="fm-cap" style={{ textAlign: 'center', color: 'var(--text-muted)', position: 'relative' }}>
        {isFront ? 'Anlamı görmek için dokun' : 'Tekrar görmek için dokun'}
      </div>
    </div>
  );
}
// CARD is set by the renderer below so CardFace stays presentational
let CARD = DECK[0];

// Corner verdict icon that fades/scales in as you drag toward a threshold
function VerdictBadge({ side, amt }) {
  const know = side === 'know';
  return (
    <div style={{
      position: 'absolute', top: 18, [know ? 'right' : 'left']: 18, zIndex: 25,
      width: 52, height: 52, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: know ? 'var(--success)' : 'var(--error)',
      boxShadow: `0 8px 24px ${know ? 'rgba(74,222,128,0.5)' : 'rgba(255,107,107,0.45)'}`,
      opacity: amt, transform: `scale(${0.4 + amt * 0.6}) rotate(${(1 - amt) * (know ? 12 : -12)}deg)`,
      transition: 'none', pointerEvents: 'none',
    }}>
      <Icon d={know ? ICONS.check : ICONS.x} size={26} stroke="#fff" sw={2.8} />
    </div>
  );
}

// Tutorial hint arrows shown on the first few cards
function TutorialHint({ fade }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 35, pointerEvents: 'none', opacity: fade, transition: 'opacity .3s' }}>
      <div style={{ position: 'absolute', left: 6, top: '46%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--error)', animation: 'fm-nudge-l 1.4s ease-in-out infinite' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'color-mix(in srgb, var(--error) 16%, transparent)', border: '1px solid color-mix(in srgb, var(--error) 40%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={ICONS.arrow} size={20} stroke="currentColor" sw={2.4} style={{ transform: 'scaleX(-1)' }} />
        </div>
        <span className="fm-label" style={{ fontSize: 10.5 }}>Bilmiyorum</span>
      </div>
      <div style={{ position: 'absolute', right: 6, top: '46%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--success)', animation: 'fm-nudge-r 1.4s ease-in-out infinite' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'color-mix(in srgb, var(--success) 16%, transparent)', border: '1px solid color-mix(in srgb, var(--success) 40%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={ICONS.arrow} size={20} stroke="currentColor" sw={2.4} />
        </div>
        <span className="fm-label" style={{ fontSize: 10.5 }}>Biliyorum</span>
      </div>
      <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center' }}>
        <span className="fm-cap" style={{ background: 'var(--bg-base)', padding: '5px 12px', borderRadius: 99, border: '1px solid var(--border)' }}>← sürükle · çevirmek için dokun · sürükle →</span>
      </div>
    </div>
  );
}

// Header + progress + card stage shell shared by live + static renderers
function StudyShell({ dark, deckTitle, streak, idx, total, children }) {
  return (
    <Screen dark={dark}>
      <style>{`@keyframes fm-conf{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(220px) rotate(320deg)}}`}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon d={ICONS.arrow} size={22} stroke="var(--text-secondary)" style={{ transform: 'scaleX(-1)' }} />
          <span className="fm-title" style={{ fontSize: 16, color: 'var(--text-primary)' }}>{deckTitle}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)' }}>
          <Icon d={ICONS.flame} size={18} fill="var(--warning)" stroke="var(--warning)" />
          <span className="fm-num" style={{ fontSize: 15 }}>{streak}</span>
        </div>
      </div>
      <div style={{ padding: '16px 18px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="fm-track" style={{ flex: 1 }}>
          <div className="fm-fill fm-shimmer" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <span className="fm-num" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{idx + 1}/{total}</span>
      </div>
      {children}
    </Screen>
  );
}

// Background peek cards (stack effect)
function PeekStack() {
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(0.84) translateY(22px)', borderRadius: 28, background: 'var(--bg-surface)', border: '1px solid var(--border)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', inset: 0, transform: 'scale(0.92) translateY(12px)', borderRadius: 28, background: 'var(--bg-elevated)', border: '1px solid var(--border)', opacity: 0.72 }} />
    </React.Fragment>
  );
}

function ActionButtons({ onNo, onYes }) {
  return (
    <div style={{ position: 'absolute', left: 18, right: 18, bottom: 30, display: 'flex', gap: 12 }}>
      <button className="fm-btn block" onClick={onNo} style={{ background: 'var(--bg-surface)', color: 'var(--error)', border: '1px solid var(--border)' }}>
        <Icon d={ICONS.x} size={18} stroke="currentColor" sw={2.2} /> Bilmiyorum
      </button>
      <button className="fm-btn primary block" onClick={onYes}>
        <Icon d={ICONS.check} size={18} stroke="currentColor" sw={2.4} /> Biliyorum
      </button>
    </div>
  );
}

// ── Live interactive flashcard ──────────────────────────────────────────────
function FlashcardScreen({ dark, deckTitle = 'Günlük İngilizce' }) {
  const [idx, setIdx] = React.useState(0);
  const [face, setFace] = React.useState('front');
  const [flipped, setFlipped] = React.useState(false);
  const [drag, setDrag] = React.useState(0);
  const [fb, setFb] = React.useState(null);
  const [streak, setStreak] = React.useState(4);
  const [confetti, setConfetti] = React.useState(false);
  const start = React.useRef(null);
  CARD = DECK[idx % DECK.length];
  const total = DECK.length;

  const answer = (know) => {
    if (fb) return;
    setFb(know ? 'know' : 'dont');
    const ns = know ? streak + 1 : 0;
    if (know && ns >= 5) { setConfetti(true); setTimeout(() => setConfetti(false), 1300); }
    setDrag(know ? 480 : -480);
    setTimeout(() => {
      setStreak(ns); setFace('front'); setFlipped(false); setFb(null); setDrag(0);
      setIdx((p) => (p + 1) % total);
    }, know ? 380 : 560);
  };

  const doFlip = () => { setFlipped((f) => !f); setFace((f) => (f === 'front' ? 'back' : 'front')); };

  const onDown = (e) => { start.current = e.clientX; };
  const onMove = (e) => { if (start.current != null && !fb) setDrag(e.clientX - start.current); };
  const onUp = (e) => {
    if (start.current == null) return;
    const dx = e.clientX - start.current; start.current = null;
    if (Math.abs(dx) < 8) { doFlip(); setDrag(0); return; }
    if (dx > 60) answer(true);
    else if (dx < -60) answer(false);
    else setDrag(0);
  };

  const rot = drag * 0.045;
  const flyOut = Math.abs(drag) > 240;
  const knowAmt = Math.max(0, Math.min(1, (drag - 30) / 120));
  const dontAmt = Math.max(0, Math.min(1, (-drag - 30) / 120));
  const tutorial = idx < 3 && !fb;

  return (
    <StudyShell dark={dark} deckTitle={deckTitle} streak={streak} idx={idx} total={total}>
      <div className="fc-stage" style={{ position: 'relative', margin: '26px auto 0', width: '84%', height: 416 }}>
        <PeekStack />
        <div
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={(e) => start.current != null && onUp(e)}
          style={{
            position: 'absolute', inset: 0, touchAction: 'none', cursor: 'grab', perspective: '1400px',
            transform: `translateX(${drag}px) rotate(${rot}deg)`,
            opacity: flyOut ? 0 : 1,
            transition: start.current == null ? 'transform .34s cubic-bezier(.2,.8,.2,1), opacity .3s' : 'none',
          }}>
          {/* swipe tint overlay */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 28, pointerEvents: 'none', zIndex: 20,
            boxShadow: knowAmt ? `inset 0 0 0 2px var(--success), inset 0 0 ${40 * knowAmt}px rgba(74,222,128,${0.4 * knowAmt})`
              : dontAmt ? `inset 0 0 0 2px var(--error), inset 0 0 ${40 * dontAmt}px rgba(255,107,107,${0.38 * dontAmt})` : 'none' }} />
          <div className={'fc-card' + (flipped ? ' flipped' : '') + (fb === 'dont' ? ' fc-shake' : '')}>
            <CardFace face="front" />
            <CardFace face="back" />
          </div>
          {knowAmt > 0 && <VerdictBadge side="know" amt={knowAmt} />}
          {dontAmt > 0 && <VerdictBadge side="dont" amt={dontAmt} />}
          {fb && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 30, animation: 'fm-pop .3s cubic-bezier(.2,.8,.2,1)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: fb === 'know' ? 'var(--success)' : 'var(--error)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <Icon d={fb === 'know' ? ICONS.check : ICONS.x} size={40} stroke="#fff" sw={2.6} />
              </div>
            </div>
          )}
          {tutorial && <TutorialHint fade={1 - Math.min(1, Math.abs(drag) / 80)} />}
        </div>
        <Confetti on={confetti} />
      </div>
      <ActionButtons onNo={() => answer(false)} onYes={() => answer(true)} />
    </StudyShell>
  );
}

// ── Static storyboard frame: forces one visual state, non-interactive ────────
// pose: 'back' | 'swipe-right' | 'swipe-left' | 'correct' | 'wrong' | 'tutorial'
function FlashcardState({ dark, pose, deckTitle = 'Günlük İngilizce', wordIdx = 0 }) {
  CARD = DECK[wordIdx % DECK.length];
  const flipped = pose === 'back';
  const drag = pose === 'swipe-right' ? 120 : pose === 'swipe-left' ? -120 : 0;
  const fb = pose === 'correct' ? 'know' : pose === 'wrong' ? 'dont' : null;
  const knowAmt = pose === 'swipe-right' ? 0.85 : 0;
  const dontAmt = pose === 'swipe-left' ? 0.85 : 0;
  const rot = drag * 0.045;
  return (
    <StudyShell dark={dark} deckTitle={deckTitle} streak={pose === 'correct' ? 5 : 4} idx={1} total={DECK.length}>
      <div className="fc-stage" style={{ position: 'relative', margin: '26px auto 0', width: '84%', height: 416 }}>
        <PeekStack />
        <div style={{ position: 'absolute', inset: 0, perspective: '1400px', transform: `translateX(${drag}px) rotate(${rot}deg)` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 28, pointerEvents: 'none', zIndex: 20,
            boxShadow: knowAmt ? `inset 0 0 0 2px var(--success), inset 0 0 ${40 * knowAmt}px rgba(74,222,128,${0.4 * knowAmt})`
              : dontAmt ? `inset 0 0 0 2px var(--error), inset 0 0 ${40 * dontAmt}px rgba(255,107,107,${0.38 * dontAmt})` : 'none' }} />
          <div className={'fc-card' + (flipped ? ' flipped' : '') + (pose === 'wrong' ? ' fc-shake' : '')}>
            <CardFace face="front" />
            <CardFace face="back" />
          </div>
          {knowAmt > 0 && <VerdictBadge side="know" amt={knowAmt} />}
          {dontAmt > 0 && <VerdictBadge side="dont" amt={dontAmt} />}
          {fb && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 30 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: fb === 'know' ? 'var(--success)' : 'var(--error)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <Icon d={fb === 'know' ? ICONS.check : ICONS.x} size={40} stroke="#fff" sw={2.6} />
              </div>
            </div>
          )}
          {pose === 'tutorial' && <TutorialHint fade={1} />}
        </div>
        <Confetti on={pose === 'correct'} />
      </div>
      <ActionButtons onNo={() => {}} onYes={() => {}} />
    </StudyShell>
  );
}

Object.assign(window, { FlashcardScreen, FlashcardState, DECK });
