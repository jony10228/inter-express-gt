import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import videoSrc from './videos/inter-express-explainer.mp4'

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
// Avión top-down blanco sobre círculo naranja — sin fondo, transparente
function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Círculo naranja sólido */}
      <circle cx="18" cy="18" r="17" fill="#F7941D"/>
      {/* Avión vista superior, nariz apuntando arriba→derecha (-42°), escala 0.82 */}
      <g transform="translate(18,18) rotate(-42) scale(0.82)">
        {/* Fuselaje — cuerpo central */}
        <path d="M0,-12.5 L2.2,-2 L2.2,6.5 L0,9.5 L-2.2,6.5 L-2.2,-2 Z" fill="white"/>
        {/* Ala derecha — barrida hacia atrás */}
        <path d="M2.2,-0.5 L12,4.5 L4,7 L2.2,3.5 Z" fill="white"/>
        {/* Ala izquierda — simétrica */}
        <path d="M-2.2,-0.5 L-12,4.5 L-4,7 L-2.2,3.5 Z" fill="white"/>
        {/* Estabilizador horizontal derecho */}
        <path d="M2.2,5.5 L7,9.5 L2.2,10 Z" fill="white"/>
        {/* Estabilizador horizontal izquierdo */}
        <path d="M-2.2,5.5 L-7,9.5 L-2.2,10 Z" fill="white"/>
      </g>
    </svg>
  )
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }

// ─── Global Grain Overlay ─────────────────────────────────────────────────────
function GlobalGrain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity: 0.03,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 110, damping: 24 })
  const ry = useSpring(y, { stiffness: 110, damping: 24 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setVisible(true) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  if (!visible) return null

  return (
    <div className="hidden md:block">
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{ width: 8, height: 8, background: '#FFFFFF', x, y, translateX: '-50%', translateY: '-50%', top: 0, left: 0 }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.22)', x: rx, y: ry, translateX: '-50%', translateY: '-50%', top: 0, left: 0 }}
      />
    </div>
  )
}


// ─── Hero Visual — Premium Network Globe ──────────────────────────────────────
function GlobeHero() {
  const C = { x: 300, y: 300 }
  const R = 248
  const GT = { x: 300, y: 300 }

  // Country positions at orbital radius 178, chosen for dramatic composition
  const toXY = (deg, r = 178) => ({
    x: Math.round(C.x + r * Math.cos(deg * Math.PI / 180)),
    y: Math.round(C.y + r * Math.sin(deg * Math.PI / 180)),
  })

  const routes = [
    {
      id: 'US', label: 'USA', pos: toXY(222),
      // Great-circle arc sweeping up through the sky above the sphere
      get d() { return `M ${this.pos.x},${this.pos.y} C 88,72 402,68 ${GT.x},${GT.y}` },
      dur: 3.4, delay: 0,
    },
    {
      id: 'CN', label: 'China', pos: toXY(330),
      get d() { return `M ${this.pos.x},${this.pos.y} C 518,68 372,62 ${GT.x},${GT.y}` },
      dur: 3.0, delay: 1.1,
    },
    {
      id: 'MX', label: 'México', pos: toXY(201),
      get d() { return `M ${this.pos.x},${this.pos.y} C 55,208 168,334 ${GT.x},${GT.y}` },
      dur: 3.8, delay: 0.55,
    },
  ]

  const lats = [-50, -25, 0, 25, 50]
  const lngs = Array.from({ length: 8 }, (_, i) => i * 22.5)

  return (
    <div className="absolute pointer-events-none overflow-hidden hidden md:block"
      style={{ right: -50, top: -70, width: 680, height: 680 }}>
      <svg width="680" height="680" viewBox="0 0 600 600" fill="none" style={{ opacity: 0.9 }}>
        <defs>

          {/* ── FILTERS ─────────────────────────────────────────────────── */}
          {/* Bloom: large diffused glow behind GT */}
          <filter id="hv-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="32" />
          </filter>
          {/* Glow: medium glow for GT node */}
          <filter id="hv-glow-md" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="11" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Glow: tight glow for particles and small nodes */}
          <filter id="hv-glow-sm" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="4.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Atmosphere: soft blur for edge ring */}
          <filter id="hv-atm" x="-6%" y="-6%" width="112%" height="112%">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          {/* ── SPHERE BODY GRADIENT ────────────────────────────────────── */}
          {/* Warm light source upper-left, realistic subsurface lighting */}
          <radialGradient id="hv-sphere" cx="34%" cy="29%" r="72%">
            <stop offset="0%"   stopColor="#1F160C" stopOpacity="0.95" />
            <stop offset="40%"  stopColor="#130D07" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#070402" stopOpacity="0.88" />
          </radialGradient>

          {/* Edge fade: sphere blends into page background */}
          <radialGradient id="hv-edge" cx="50%" cy="50%" r="50%">
            <stop offset="46%"  stopOpacity="0" />
            <stop offset="80%"  stopColor="rgba(8,5,2,0.55)" stopOpacity="1"/>
            <stop offset="100%" stopColor="#0D0D0D" stopOpacity="1" />
          </radialGradient>

          {/* GT bloom gradient */}
          <radialGradient id="hv-gtbloom" cx="50%" cy="50%">
            <stop offset="0%"  stopColor="#F7941D" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#F7941D" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#F7941D" stopOpacity="0" />
          </radialGradient>

          {/* ── DOT-MATRIX TEXTURE ──────────────────────────────────────── */}
          <pattern id="hv-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.85" fill="rgba(255,255,255,0.05)" />
          </pattern>

          {/* ── ROUTE GRADIENTS (country→GT: dim origin, bright destination) */}
          {routes.map(r => (
            <linearGradient key={r.id} id={`hv-rg-${r.id}`}
              x1={r.pos.x} y1={r.pos.y} x2={GT.x} y2={GT.y}
              gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#F7941D" stopOpacity="0.06"/>
              <stop offset="45%"  stopColor="#F7941D" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#F7941D" stopOpacity="0.6"/>
            </linearGradient>
          ))}

          {/* ── CLIP ────────────────────────────────────────────────────── */}
          <clipPath id="hv-clip">
            <circle cx={C.x} cy={C.y} r={R} />
          </clipPath>

        </defs>

        {/* ══ L0 SPHERE BODY ═══════════════════════════════════════════════ */}
        <circle cx={C.x} cy={C.y} r={R} fill="url(#hv-sphere)" />

        {/* ══ L1 DOT MATRIX (static tech texture inside sphere) ════════════ */}
        <g clipPath="url(#hv-clip)">
          <rect x="0" y="0" width="600" height="600" fill="url(#hv-dots)" />
        </g>

        {/* ══ L2 LAT/LNG ARCS (slow rotation, subtle) ══════════════════════ */}
        <g clipPath="url(#hv-clip)">
          <animateTransform attributeName="transform" type="rotate"
            from="0 300 300" to="360 300 300" dur="80s" repeatCount="indefinite" />
          {lats.map((lat, i) => {
            const cy2 = C.y - R * Math.sin(lat * Math.PI / 180)
            const rx  = R * Math.cos(lat * Math.PI / 180)
            return <ellipse key={i} cx={C.x} cy={cy2} rx={rx} ry={rx * 0.1}
              stroke="rgba(255,255,255,0.065)" strokeWidth="0.5" fill="none" />
          })}
          {lngs.map((a, i) => (
            <ellipse key={i} cx={C.x} cy={C.y} rx={R * 0.052} ry={R}
              stroke="rgba(255,255,255,0.065)" strokeWidth="0.5" fill="none"
              transform={`rotate(${a},${C.x},${C.y})`} />
          ))}
        </g>

        {/* ══ L3 ATMOSPHERE RING ═══════════════════════════════════════════ */}
        <circle cx={C.x} cy={C.y} r={R}
          fill="none" stroke="rgba(247,148,29,0.08)" strokeWidth="26" filter="url(#hv-atm)" />

        {/* ══ L4 EDGE FADE ═════════════════════════════════════════════════ */}
        <circle cx={C.x} cy={C.y} r={R} fill="url(#hv-edge)" />

        {/* ══ L5 GT DEEP BLOOM ═════════════════════════════════════════════ */}
        <circle cx={GT.x} cy={GT.y} r="145" fill="url(#hv-gtbloom)" filter="url(#hv-bloom)" />

        {/* ══ L6 ROUTE LINES ═══════════════════════════════════════════════ */}
        {routes.map(r => (
          <g key={`rt-${r.id}`}>
            {/* Ghost: barely-there base so route exists even without particles */}
            <path d={r.d} stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
            {/* Gradient: directional orange going country → GT */}
            <path d={r.d} stroke={`url(#hv-rg-${r.id})`} strokeWidth="1.1" />
            {/* Soft glow on top for depth */}
            <path d={r.d} stroke="rgba(247,148,29,0.08)" strokeWidth="4" filter="url(#hv-glow-sm)" />
          </g>
        ))}

        {/* ══ L7 COMET PARTICLES ═══════════════════════════════════════════ */}
        {/* Two waves per route, each wave has a 3-dot comet trail.
            Trail dots begin AFTER main dot so they appear BEHIND it on the path. */}
        {routes.flatMap(r =>
          [0, 1].map(wave => {
            const t0 = r.delay + wave * (r.dur / 2)
            return (
              <g key={`comet-${r.id}-${wave}`}>
                {/* Tail 2 — faintest, smallest */}
                <circle r="1.1" fill="#F7941D" opacity="0.18" filter="url(#hv-glow-sm)">
                  <animateMotion path={r.d} dur={`${r.dur}s`}
                    repeatCount="indefinite" begin={`${t0 + 0.3}s`} />
                </circle>
                {/* Tail 1 — medium */}
                <circle r="2.2" fill="#F7941D" opacity="0.45" filter="url(#hv-glow-sm)">
                  <animateMotion path={r.d} dur={`${r.dur}s`}
                    repeatCount="indefinite" begin={`${t0 + 0.15}s`} />
                </circle>
                {/* Head — brightest */}
                <circle r="3.5" fill="#F7941D" filter="url(#hv-glow-sm)">
                  <animateMotion path={r.d} dur={`${r.dur}s`}
                    repeatCount="indefinite" begin={`${t0}s`} />
                </circle>
              </g>
            )
          })
        )}

        {/* ══ L8 COUNTRY NODES ═════════════════════════════════════════════ */}
        {routes.map((r, i) => (
          <g key={`node-${r.id}`}>
            {/* Expanding pulse ring */}
            <circle cx={r.pos.x} cy={r.pos.y} r="14"
              fill="none" stroke="rgba(247,148,29,0.14)" strokeWidth="1">
              <animate attributeName="r" values="12;28;12"
                dur={`${2.6 + i * 0.38}s`} repeatCount="indefinite" begin={`${i * 0.44}s`} />
              <animate attributeName="opacity" values="0.4;0;0.4"
                dur={`${2.6 + i * 0.38}s`} repeatCount="indefinite" begin={`${i * 0.44}s`} />
            </circle>
            {/* Node body */}
            <circle cx={r.pos.x} cy={r.pos.y} r="11"
              fill="#0E0E0E" stroke="rgba(247,148,29,0.4)" strokeWidth="1" />
            {/* Inner ambient fill */}
            <circle cx={r.pos.x} cy={r.pos.y} r="5"
              fill="rgba(247,148,29,0.18)" filter="url(#hv-glow-sm)" />
            {/* Core dot */}
            <circle cx={r.pos.x} cy={r.pos.y} r="2.2" fill="#F7941D" />
            {/* Country code label */}
            <text x={r.pos.x} y={r.pos.y - 17} textAnchor="middle"
              fontSize="8.5" fontWeight="600" letterSpacing="0.1em"
              fill="rgba(247,148,29,0.68)"
              fontFamily="Space Grotesk,sans-serif">{r.id}</text>
          </g>
        ))}

        {/* ══ L9 GT CENTER NODE ════════════════════════════════════════════ */}
        {/* Outermost slow pulse — sets the cadence */}
        <circle cx={GT.x} cy={GT.y} r="46" fill="none"
          stroke="rgba(247,148,29,0.09)" strokeWidth="1">
          <animate attributeName="r" values="44;74;44" dur="4.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="4.8s" repeatCount="indefinite" />
        </circle>
        {/* Inner faster pulse */}
        <circle cx={GT.x} cy={GT.y} r="34" fill="none"
          stroke="rgba(247,148,29,0.18)" strokeWidth="1">
          <animate attributeName="r" values="32;54;32" dur="3.5s" repeatCount="indefinite" begin="0.65s" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3.5s" repeatCount="indefinite" begin="0.65s" />
        </circle>
        {/* GT node ring — orange border with glow */}
        <circle cx={GT.x} cy={GT.y} r="24"
          fill="#141414" stroke="#F7941D" strokeWidth="1.5" filter="url(#hv-glow-md)" />
        {/* Warm inner fill */}
        <circle cx={GT.x} cy={GT.y} r="15" fill="rgba(247,148,29,0.09)" />
        {/* "GT" label */}
        <text x={GT.x} y={GT.y - 2} textAnchor="middle"
          fontSize="10" fontWeight="800" fill="#FFFFFF" letterSpacing="1.5"
          fontFamily="Space Grotesk,sans-serif">GT</text>
        {/* "GUATEMALA" sub-label */}
        <text x={GT.x} y={GT.y + 11} textAnchor="middle"
          fontSize="5.5" fontWeight="500" fill="rgba(247,148,29,0.6)"
          fontFamily="Space Grotesk,sans-serif" letterSpacing="0.8">GUATEMALA</text>

      </svg>
    </div>
  )
}

// ─── Count-Up ─────────────────────────────────────────────────────────────────
function CountUp({ target, duration = 1800 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref}>{val.toLocaleString()}</span>
}

// ─── Premium Flow Diagram ─────────────────────────────────────────────────────
function PremiumFlowDiagram() {
  const nodes = [
    { icon: '🔗', label: 'Link' },
    { icon: '💬', label: 'Cotización' },
    { icon: '💳', label: 'Compra' },
    { icon: '✈️', label: 'Envío' },
    { icon: '📦', label: 'Entrega' },
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % nodes.length), 950)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position: 'relative',
      background: '#0A0A0A',
      border: '1px solid #1E1E1E',
      borderRadius: 24,
      padding: 48,
      minHeight: 420,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top-right orange ambient */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: 280, background: 'radial-gradient(circle at top right, rgba(247,148,29,0.08), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <p style={{ color: '#444444', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Space Grotesk',sans-serif", marginBottom: 52, position: 'relative', zIndex: 1 }}>
        FLUJO DEL PROCESO
      </p>

      {/* Nodes + track */}
      <div style={{ position: 'relative', flex: 1, zIndex: 1 }}>

        {/* Full-width line track — sits at vertical center of 80px nodes (40px from top) */}
        <div style={{ position: 'absolute', left: 40, right: 40, top: 38, height: 2, zIndex: 0, borderRadius: 2 }}>
          {/* Base track */}
          <div style={{ position: 'absolute', inset: 0, background: '#1E1E1E', borderRadius: 2 }} />
          {/* Orange fill progresses with active node */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            background: 'linear-gradient(to right, #F7941D, rgba(247,148,29,0.6))',
            borderRadius: 2,
            width: `${active * 25}%`,
            transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
          {/* Traveling dot — pure CSS animation */}
          <div className="flow-dot-travel" style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#F7941D',
            boxShadow: '0 0 12px #F7941D, 0 0 24px rgba(247,148,29,0.5)',
          }} />
        </div>

        {/* Node columns — spread across full width */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 80 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#141414',
                border: active === i ? '2px solid #F7941D' : '1px solid #2A2A2A',
                boxShadow: active === i
                  ? '0 0 20px rgba(247,148,29,0.4), 0 0 40px rgba(247,148,29,0.12), inset 0 0 20px rgba(247,148,29,0.04)'
                  : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border 0.35s ease, box-shadow 0.35s ease',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 32, lineHeight: 1 }}>{n.icon}</span>
              </div>
              <span style={{
                fontSize: 13, color: active === i ? '#CCCCCC' : '#444444',
                textAlign: 'center', fontWeight: 500, lineHeight: 1.3,
                transition: 'color 0.35s ease',
              }}>
                {n.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 28, borderTop: '1px solid #141414', position: 'relative', zIndex: 1, marginTop: 40 }}>
        <div style={{
          color: '#F7941D', border: '1px solid rgba(247,148,29,0.25)',
          background: 'rgba(247,148,29,0.07)', borderRadius: 6,
          padding: '5px 14px', fontSize: 12,
          fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
          minWidth: 96, textAlign: 'center',
        }}>
          Paso {active + 1} de 5
        </div>
        <span style={{ color: '#3A3A3A', fontSize: 13 }}>Proceso completamente gestionado</span>
      </div>
    </div>
  )
}

// ─── Premium Casillero Map ────────────────────────────────────────────────────
function PremiumCasilleroMap() {
  const cx = 200, cy = 210, orbitR = 150
  const countries = [
    { code: 'US', label: 'USA',    angle: -90, cpx: 265, cpy: 133 },
    { code: 'CN', label: 'China',  angle:  30, cpx: 250, cpy: 222 },
    { code: 'MX', label: 'México', angle: 210, cpx: 152, cpy: 242 },
  ]

  const pts = countries.map(c => {
    const rad = (c.angle * Math.PI) / 180
    return { ...c, ox: Math.round(cx + orbitR * Math.cos(rad)), oy: Math.round(cy + orbitR * Math.sin(rad)) }
  })

  return (
    <div style={{
      position: 'relative',
      background: '#0A0A0A',
      border: '1px solid #1E1E1E',
      borderRadius: 24,
      padding: '40px 40px 28px',
      minHeight: 420,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top-left ambient */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 220, height: 220, background: 'radial-gradient(circle at top left, rgba(247,148,29,0.06), transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <p style={{ color: '#444444', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12, position: 'relative', zIndex: 1 }}>
        RED LOGÍSTICA GLOBAL
      </p>

      {/* SVG map */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 370" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', minHeight: 330 }}>
          <defs>
            <pattern id="dotgrid2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.025)" />
            </pattern>
            <filter id="glow-dot">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-gt">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Dot grid */}
          <rect width="400" height="370" fill="url(#dotgrid2)" />

          {/* Curved base paths */}
          {pts.map((c, i) => (
            <path
              key={`path-${i}`}
              d={`M ${c.ox},${c.oy} Q ${c.cpx},${c.cpy} ${cx},${cy}`}
              fill="none"
              stroke="#1E1E1E"
              strokeWidth="1.5"
            />
          ))}

          {/* Traveling dots — one per route, staggered delays */}
          {pts.map((c, i) => (
            <circle key={`dot-${i}`} r="5" fill="#F7941D" filter="url(#glow-dot)">
              <animateMotion
                path={`M ${c.ox},${c.oy} Q ${c.cpx},${c.cpy} ${cx},${cy}`}
                dur="3s"
                repeatCount="indefinite"
                begin={`${i}s`}
              />
            </circle>
          ))}

          {/* Country nodes — on top of paths */}
          {pts.map((c, i) => (
            <g key={`node-${i}`}>
              <circle cx={c.ox} cy={c.oy} r="32" fill="#141414" stroke="#2A2A2A" strokeWidth="1" />
              <text x={c.ox} y={c.oy - 3} textAnchor="middle" fontSize="15" fontWeight="700" fill="#CCCCCC" fontFamily="Space Grotesk,sans-serif">{c.code}</text>
              <text x={c.ox} y={c.oy + 14} textAnchor="middle" fontSize="10" fill="#555555" fontFamily="Inter,sans-serif">{c.label}</text>
            </g>
          ))}

          {/* GT outer pulse ring */}
          <circle cx={cx} cy={cy} r="52" fill="none" stroke="rgba(247,148,29,0.25)" strokeWidth="1.5">
            <animate attributeName="r" values="54;70;54" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* GT main circle */}
          <circle cx={cx} cy={cy} r="50" fill="#141414" stroke="#F7941D" strokeWidth="2" filter="url(#glow-gt)" />

          {/* GT labels — rendered last so they float above glow */}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill="#FFFFFF" fontFamily="Space Grotesk,sans-serif">GT</text>
          <text x={cx} y={cy + 15} textAnchor="middle" fontSize="10" fill="#888888" fontFamily="Inter,sans-serif">Guatemala</text>
        </svg>
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['Servicios', 'Cómo funciona', 'FAQ']

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.55)',
        borderBottom: scrolled ? '1px solid #1A1A1A' : '1px solid transparent',
        transition: 'background 0.35s, border-color 0.35s',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <LogoMark size={36} />
          <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, letterSpacing: '0.06em' }}>INTER EXPRESS GT</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              style={{ color: '#666666', fontSize: 14, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target.style.color = '#FFFFFF')}
              onMouseLeave={e => (e.target.style.color = '#666666')}
            >{l}</a>
          ))}
        </div>

        <div className="hidden md:flex">
          <motion.a
            href="#cotizar"
            whileHover={{ scale: 1.03, backgroundColor: '#F7941D', color: '#000000' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{ border: '1px solid #F7941D', color: '#F7941D', fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 8 }}
          >
            Cotizar ahora
          </motion.a>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menú">
          {[0, 1, 2].map(i => (
            <motion.span key={i}
              animate={i === 1 ? (open ? { opacity: 0 } : { opacity: 1 }) : open ? { rotate: i === 0 ? 45 : -45, y: i === 0 ? 7 : -7 } : { rotate: 0, y: 0 }}
              className="block w-5 h-px mb-1.5 last:mb-0"
              style={{ background: '#FFFFFF' }}
            />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: '#1A1A1A', background: '#080808' }}
          >
            <div className="flex flex-col gap-4 p-6">
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} onClick={() => setOpen(false)} style={{ color: '#888888', fontSize: 14 }}>{l}</a>
              ))}
              <a href="#cotizar" onClick={() => setOpen(false)}
                style={{ border: '1px solid #F7941D', color: '#F7941D', fontSize: 13, fontWeight: 600, padding: '12px 20px', borderRadius: 8, textAlign: 'center', marginTop: 8 }}
              >Cotizar ahora</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const stores = ['Amazon', 'Nike', 'Shein', 'AliExpress', 'Adidas', 'eBay', 'Zara', 'ASOS', 'iHerb', 'Walmart', 'Target', 'H&M']
  const doubled = [...stores, ...stores]

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const globeX = useSpring(mouseX, { stiffness: 50, damping: 28 })
  const globeY = useSpring(mouseY, { stiffness: 40, damping: 24 })

  useEffect(() => {
    const onMouse = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mouseX.set(((e.clientX - cx) / cx) * -20)
      mouseY.set(((e.clientY - cy) / cy) * -12)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <section id="hero" className="relative overflow-hidden flex flex-col" style={{ background: '#0D0D0D', minHeight: '90vh' }}>
      <div className="grain-overlay absolute inset-0 z-[1]" />

      {/* Ambient left glow */}
      <div className="absolute pointer-events-none z-[1]" style={{ left: -100, top: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(247,148,29,0.05) 0%, transparent 65%)', filter: 'blur(40px)' }} />

      {/* Globe right — z-[1] with mouse parallax */}
      <motion.div
        className="absolute right-0 top-0 z-[1] hidden md:block"
        style={{ x: globeX, y: globeY }}
      >
        <GlobeHero />
      </motion.div>

      {/* Content — left aligned */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-center" style={{ paddingTop: 112, paddingBottom: 40, paddingLeft: 40 }}>
        <div style={{ maxWidth: 580 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 100, border: '1px solid rgba(247,148,29,0.4)', background: 'rgba(247,148,29,0.1)', marginBottom: 36 }}
          >
            <span className="badge-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#F7941D', flexShrink: 0, boxShadow: '0 0 8px #F7941D' }} />
            <span style={{ color: '#F7941D', fontSize: 13, fontWeight: 500, letterSpacing: '0.01em' }}>Servicio disponible en toda Guatemala</span>
          </motion.div>

          {/* Headlines */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 4 }}
          >
            Comprá en cualquier<br />parte del mundo.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#F7941D', lineHeight: 1.15, marginBottom: 36 }}
          >
            Nosotros lo traemos.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            style={{ color: '#888888', fontSize: 18, lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}
          >
            Comprá en cualquier tienda del mundo. Te damos dirección física en USA, China y México para traer tus paquetes hasta Guatemala — rápido, seguro y hasta tu puerta.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.52 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}
          >
            <motion.a
              href="#cotizar"
              whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(247,148,29,0.3)' }}
              whileTap={{ scale: 0.97 }}
              style={{ background: '#F7941D', color: '#000000', fontWeight: 700, fontSize: 14, padding: '14px 28px', borderRadius: 8 }}
            >
              Cotizar ahora
            </motion.a>
            <motion.a
              href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
              whileHover={{ borderColor: '#FFFFFF', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              style={{ border: '1px solid #333333', color: '#FFFFFF', fontWeight: 600, fontSize: 14, padding: '14px 28px', borderRadius: 8 }}
            >
              Hablar por WhatsApp
            </motion.a>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.68, duration: 0.5 }}
            style={{ color: '#555555', fontSize: 13 }}
          >
            ★★★★★&nbsp;&nbsp;Más de 2,800 clientes satisfechos en Guatemala
          </motion.p>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        className="relative z-10 flex justify-start bounce-arrow"
        style={{ paddingLeft: 'max(24px, calc((100vw - 1152px) / 2 + 24px))', paddingBottom: 32, color: 'rgba(255,255,255,0.2)' }}
      >
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <path d="M8 2v14M2 12l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Store marquee */}
      <div className="relative z-10 overflow-hidden border-t border-b py-5" style={{ borderColor: '#1A1A1A' }}>
        <p className="text-center mb-4" style={{ color: '#2A2A2A', fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase' }}>
          Compramos en cualquier tienda del mundo
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track flex gap-3 w-max">
            {doubled.map((s, i) => (
              <div
                key={i}
                className="flex-shrink-0 transition-all duration-200"
                style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8, padding: '8px 20px', color: '#CCCCCC', fontWeight: 500, fontSize: 13, cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F7941D'; e.currentTarget.style.color = '#FFFFFF' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#CCCCCC' }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: 5000, accent: '+', label: 'Pedidos entregados' },
    { value: 2800, accent: '+', label: 'Clientes satisfechos' },
    { value: 3,    accent: '',  label: 'Países de origen' },
    { value: 48,   accent: 'h', label: 'Tiempo de respuesta' },
  ]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ background: '#0D0D0D', borderTop: '1px solid #F7941D' }}>
      <div className="max-w-6xl mx-auto overflow-hidden" style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center text-center"
              style={{
                padding: '56px 24px',
                borderRight: '1px solid #1E1E1E',
                borderBottom: '1px solid #1E1E1E',
              }}
            >
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 64, fontWeight: 900, lineHeight: 1, marginBottom: 10 }}>
                <span style={{ color: '#FFFFFF' }}>{inView && <CountUp target={s.value} />}</span>
                {s.accent && <span style={{ color: '#F7941D' }}>{s.accent}</span>}
              </div>
              <p style={{ color: '#555555', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #1A1A1A', padding: '20px 0', textAlign: 'center' }}>
        <p style={{ color: '#2E2E2E', fontSize: 14, fontStyle: 'italic' }}>
          Cada paquete tiene una historia. La tuya empieza aquí.
        </p>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const checks1 = ['Sin tarjeta internacional', 'Cualquier tienda del mundo', 'Cotización en menos de 24h', 'Seguimiento en tiempo real']
  const checks2 = ['Compra en cualquier tienda del mundo', 'Dirección física en USA, China y México', 'Recibís en oficina o en tu casa', 'Sin límite de paquetes']

  const CheckList = ({ items }) => (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
      {items.map((c, i) => (
        <motion.li key={i} variants={fadeUp} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 2, height: 18, background: '#F7941D', marginRight: 16, flexShrink: 0, borderRadius: 1 }} />
          <span style={{ color: '#CCCCCC', fontSize: 15 }}>{c}</span>
        </motion.li>
      ))}
    </ul>
  )

  return (
    <section id="servicios">
      {/* Header */}
      <div style={{ background: '#0D0D0D', padding: '96px 0 48px' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.p variants={fadeUp} style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>
              Servicios
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
              Todo lo que necesitás para<br />comprar global.
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: '#666666', fontSize: 17 }}>
              Dos servicios, una sola meta: traerte lo que querés.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Personal Shopper */}
      <div style={{ background: '#0D0D0D', padding: '80px 0 120px', borderTop: '1px solid #111111', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle 800px at 10% 30%, rgba(247,148,29,0.05), transparent)', zIndex: 0 }} />
        <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-[45%_55%] gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <p style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'Space Grotesk',sans-serif" }}>
                PERSONAL SHOPPER
              </p>
              <h3 style={{ fontSize: 'clamp(26px, 3vw, 48px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 20 }}>
                ¿Lo viste en internet?<br />Ya es tuyo.
              </h3>
              <p style={{ color: '#888888', fontSize: 17, lineHeight: 1.8, maxWidth: 420, marginBottom: 32 }}>
                Mandanos el link de cualquier tienda del mundo — Amazon, Nike, Shein, tiendas europeas, asiáticas, donde sea. Te cotizamos en menos de 24 horas y compramos por vos, sin que necesités tarjeta internacional ni lidiar con aduanas.
              </p>
              <CheckList items={checks1} />
              <motion.a href="#cotizar" whileHover={{ x: 4 }}
                style={{ color: '#F7941D', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
              >
                Cotizar mi pedido <span>→</span>
              </motion.a>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="grad-border-card" style={{ borderRadius: 25 }}>
                <PremiumFlowDiagram />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Casillero */}
      <div style={{ background: '#080808', padding: '120px 0', borderTop: '1px solid #141414', borderBottom: '1px solid #141414', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle 800px at 90% 70%, rgba(247,148,29,0.05), transparent)', zIndex: 0 }} />
        <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-[55%_45%] gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <div className="grad-border-card" style={{ borderRadius: 25 }}>
                <PremiumCasilleroMap />
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'Space Grotesk',sans-serif" }}>
                CASILLERO INTERNACIONAL
              </p>
              <h3 style={{ fontSize: 'clamp(26px, 3vw, 48px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 20 }}>
                Tu dirección en USA,<br />China y México.
              </h3>
              <p style={{ color: '#888888', fontSize: 17, lineHeight: 1.8, maxWidth: 420, marginBottom: 32 }}>
                Comprás donde quieras, en cualquier tienda del planeta. Te damos una dirección física en USA, China y México donde recibís tus compras, y nosotros las traemos hasta Guatemala sin complicaciones.
              </p>
              <CheckList items={checks2} />
              <motion.a href="#cotizar" whileHover={{ x: 4 }}
                style={{ color: '#F7941D', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Activar mi casillero <span>→</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: 1, title: 'Encontrás algo en internet', desc: 'En cualquier tienda del mundo: Amazon, Nike, Shein, tiendas europeas o asiáticas.' },
    { n: 2, title: 'Nos mandás el enlace', desc: 'Por WhatsApp. Te cotizamos en menos de 24 horas.' },
    { n: 3, title: 'Compramos e importamos', desc: 'Lo compramos por vos y lo recibimos en nuestra dirección en USA, China o México.' },
    { n: 4, title: 'Lo recibís en Guatemala', desc: 'En nuestras oficinas en Jalapa o con entrega a domicilio.' },
  ]

  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setPlaying(true)
    } else {
      videoRef.current.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const next = !muted
    videoRef.current.muted = next
    setMuted(next)
  }

  return (
    <section id="cómo-funciona" style={{ background: '#0D0D0D', borderTop: '1px solid #111111' }}>
      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* Header */}
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-16">
          <motion.p variants={fadeUp} style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>El proceso</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>Cómo funciona.</motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#666666', fontSize: 17 }}>De internet a tu puerta en 4 pasos.</motion.p>
        </motion.div>

        {/* 2-col layout: video left, steps right */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col md:flex-row gap-10 md:gap-16 items-start"
        >

          {/* ── Video column (40%) ────────────────────────────── */}
          <motion.div variants={fadeUp} className="w-full md:flex-shrink-0 flex justify-center md:block" style={{ width: '100%', maxWidth: 320, margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>

              {/* Floating badge */}
              <div style={{
                position: 'absolute', top: -14, left: 16, zIndex: 20,
                background: '#F7941D', color: '#000000',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                padding: '5px 13px', borderRadius: 20,
                fontFamily: "'Space Grotesk',sans-serif",
                boxShadow: '0 4px 20px rgba(247,148,29,0.45)',
                whiteSpace: 'nowrap',
              }}>
                ▶ Mirá cómo funciona
              </div>

              {/* Video container */}
              <div style={{
                position: 'relative',
                aspectRatio: '9 / 16',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #2A2A2A',
                boxShadow: '0 0 60px rgba(247,148,29,0.15), 0 24px 60px rgba(0,0,0,0.5)',
                background: '#0E0E0E',
              }}>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Gradient scrim for controls readability */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 30%)',
                }} />

                {/* Custom controls */}
                <div style={{
                  position: 'absolute', bottom: 14, left: 14, right: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  zIndex: 10,
                }}>
                  {/* Play / Pause */}
                  <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                    style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: '#F7941D', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                      boxShadow: '0 4px 16px rgba(247,148,29,0.45)',
                    }}
                  >
                    {playing
                      ? <Pause size={16} color="#000000" strokeWidth={2.5} />
                      : <Play  size={16} color="#000000" strokeWidth={2.5} fill="#000000" />
                    }
                  </motion.button>

                  {/* Mute / Unmute */}
                  <motion.button
                    onClick={toggleMute}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {muted
                      ? <VolumeX size={15} color="#FFFFFF" strokeWidth={2} />
                      : <Volume2 size={15} color="#FFFFFF" strokeWidth={2} />
                    }
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Steps column (60%) ───────────────────────────── */}
          <motion.div variants={fadeUp} className="flex-1 w-full" style={{ paddingTop: 24 }}>
            <div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 18 }}>

                  {/* Circle + vertical connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%',
                      border: '1.5px solid #F7941D',
                      background: 'rgba(247,148,29,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15, color: '#F7941D',
                      fontFamily: "'Space Grotesk',sans-serif",
                      flexShrink: 0, position: 'relative', zIndex: 1,
                    }}>
                      {s.n}
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{
                        width: 1.5, flex: 1, minHeight: 32,
                        background: 'linear-gradient(to bottom, rgba(247,148,29,0.4), rgba(247,148,29,0.08))',
                        margin: '6px 0',
                      }} />
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{ paddingTop: 11, paddingBottom: i < steps.length - 1 ? 28 : 0 }}>
                    <h3 style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700, marginBottom: 7, lineHeight: 1.3 }}>
                      {s.title}
                    </h3>
                    <p style={{ color: '#666666', fontSize: 15, lineHeight: 1.75 }}>
                      {s.desc}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>

        {/* CTA — below both columns */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="flex justify-center mt-14">
          <motion.a href="#cotizar"
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(247,148,29,0.28)' }}
            whileTap={{ scale: 0.97 }}
            style={{ background: '#F7941D', color: '#000000', fontWeight: 700, fontSize: 14, padding: '14px 32px', borderRadius: 8 }}
          >
            Empezar mi primer pedido →
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}

// ─── Testimonials — Masonry ───────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Carlos Herrera', text: 'Traje mis tenis Nike Air Max desde USA y llegaron perfectos, sin daños y en el tiempo prometido. El servicio es muy profesional y confiable. Lo recomiendo completamente.', product: 'Tenis Nike Air Max — USA' },
  { name: 'Ana de Morales', text: 'Compré mi laptop en Amazon y el proceso fue increíblemente fácil. Me cotizaron rápido y me mantuvieron informada en todo momento. Superó mis expectativas.', product: 'Laptop Dell — Amazon USA' },
  { name: 'Kevin Pérez', text: 'Mis suplementos de iHerb llegaron sellados y en perfecto estado. Mucho más baratos que comprarlos acá. 100% recomendados.', product: 'Suplementos iHerb — USA' },
  { name: 'Sofía Castillo', text: 'Los juguetes de mis hijos llegaron desde AliExpress sin ningún problema. Excelente servicio, atención personalizada y precios muy justos para la calidad que recibís.', product: 'Juguetes AliExpress — China' },
  { name: 'Diego Monterroso', text: 'Ropa de Zara que no llega a Guatemala, ya la tengo. Increíble poder comprar en tiendas internacionales sin complicarme. Lo seguiré usando siempre.', product: 'Ropa Zara — México' },
  { name: 'María Sajquiy', text: 'Usé el casillero para traer electrodomésticos y todo llegó impecable. El seguimiento en tiempo real te da mucha tranquilidad. Excelente empresa guatemalteca.', product: 'Electrodomésticos — USA' },
]

function TestimonialCard({ t }) {
  return (
    <div className="grad-border-card" style={{ borderRadius: 17, marginBottom: 20 }}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25 }}
        style={{ background: '#0F0F0F', borderRadius: 16, padding: 32, breakInside: 'avoid', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 10, left: 18, fontSize: 80, lineHeight: 1, color: '#F7941D', opacity: 0.08, fontFamily: 'Georgia,serif', userSelect: 'none', pointerEvents: 'none' }}>"</div>
        <div style={{ display: 'flex', gap: 2, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: '#F7941D', fontSize: 14 }}>★</span>)}
        </div>
        <p style={{ color: '#AAAAAA', fontSize: 15, lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20, position: 'relative', zIndex: 1 }}>
          {t.text}
        </p>
        <div style={{ borderTop: '1px solid #161616', paddingTop: 16, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(247,148,29,0.12)', border: '1px solid rgba(247,148,29,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#F7941D', flexShrink: 0, fontFamily: "'Space Grotesk',sans-serif" }}>
            {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{t.name}</p>
            <p style={{ color: '#3A3A3A', fontSize: 12 }}>{t.product}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Testimonials() {
  const col1 = TESTIMONIALS.filter((_, i) => i % 3 === 0)
  const col2 = TESTIMONIALS.filter((_, i) => i % 3 === 1)
  const col3 = TESTIMONIALS.filter((_, i) => i % 3 === 2)

  return (
    <section id="testimonios" style={{ background: '#080808', borderTop: '1px solid #111111' }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>Testimonios</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>Lo que dicen nuestros clientes.</motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#666666', fontSize: 17 }}>Más de 2,800 guatemaltecos ya compran global con nosotros.</motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-5"
        >
          <motion.div variants={fadeIn}>
            {col1.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </motion.div>
          <motion.div variants={fadeIn} className="md:mt-10">
            {col2.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </motion.div>
          <motion.div variants={fadeIn}>
            {col3.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: '¿Cómo funciona el servicio de Personal Shopper?', a: 'Es simple: nos mandás el link del producto que querés comprar por WhatsApp. Nosotros te cotizamos el precio total (producto + envío + comisión) en menos de 24 horas. Si aceptás, pagás y nosotros nos encargamos de todo: comprar, importar y entregarte.' },
  { q: '¿Qué es el casillero internacional?', a: 'Te asignamos una dirección física en USA, China o México. Comprás directamente en tiendas internacionales usando esa dirección de envío. Cuando el paquete llega a nuestra bodega, lo consolidamos y te lo enviamos a Guatemala.' },
  { q: '¿Cuánto tiempo tarda en llegar mi pedido?', a: 'Los tiempos varían según el origen. Desde USA: 7-14 días hábiles. Desde China: 15-25 días hábiles. Desde México: 5-10 días hábiles. Estos tiempos incluyen la compra, tránsito internacional y entrega en Guatemala.' },
  { q: '¿Cuánto cobran por sus servicios?', a: 'Cobramos una comisión basada en el valor del producto y el peso del paquete. Te damos el costo total antes de que aceptés, sin sorpresas. Solicitá una cotización gratis por WhatsApp para tu producto específico.' },
  { q: '¿Puedo comprar en cualquier tienda?', a: 'Sí, compramos en cualquier tienda en línea del mundo: Amazon, Nike, Shein, AliExpress, eBay, Zara, ASOS, iHerb, Walmart, Target, y cualquier otra. Si la tienda tiene envío a USA, China o México, podemos traértelo.' },
  { q: '¿Es seguro mandarles el pago?', a: 'Totalmente. Trabajamos con múltiples métodos de pago seguros y tenemos cientos de clientes satisfechos. Podés revisar nuestras reseñas en Instagram. Si tenés dudas, podemos agendar una llamada antes de tu primer pedido.' },
  { q: '¿Dónde puedo recoger mi paquete?', a: 'Tenemos nuestras oficinas en Jalapa, Guatemala. También ofrecemos servicio de delivery a domicilio con costo adicional dependiendo de tu ubicación. Consultá disponibilidad para tu área.' },
  { q: '¿Qué pasa si mi producto llega dañado?', a: 'Inspeccionamos todos los paquetes antes de enviarte. En caso de daño durante el transporte, te ayudamos a gestionar el reclamo con el vendedor o courier. Documentamos cada paquete con fotos antes de enviarte.' },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      animate={{ backgroundColor: open ? '#0F0F0F' : 'transparent', borderRadius: open ? 8 : 0 }}
      transition={{ duration: 0.22 }}
      style={{ borderBottom: '1px solid #1A1A1A', marginBottom: open ? 4 : 0 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left"
        style={{ padding: `24px ${open ? '20px' : '0'}`, transition: 'padding 0.22s' }}
      >
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 500 }}>{item.q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.22 }}
          style={{ color: '#F7941D', fontSize: 22, lineHeight: 1, flexShrink: 0, fontWeight: 300 }}
        >+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p style={{ borderLeft: '2px solid #F7941D', paddingLeft: 16, marginLeft: 20, marginRight: 20, paddingBottom: 24, color: '#888888', fontSize: 15, lineHeight: 1.8 }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQ() {
  const half = Math.ceil(FAQS.length / 2)

  return (
    <section id="faq" style={{ background: '#0D0D0D' }}>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>FAQ</motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15 }}>Preguntas frecuentes.</motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="grid md:grid-cols-2 gap-x-16">
          <motion.div variants={fadeIn}>{FAQS.slice(0, half).map((item, i) => <FAQItem key={i} item={item} />)}</motion.div>
          <motion.div variants={fadeIn}>{FAQS.slice(half).map((item, i) => <FAQItem key={i} item={item} />)}</motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex justify-center mt-14">
          <motion.a href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
            whileHover={{ background: '#FFFFFF', color: '#000000', scale: 1.03, borderColor: '#FFFFFF' }}
            whileTap={{ scale: 0.97 }} transition={{ duration: 0.18 }}
            style={{ border: '1px solid #333333', color: '#FFFFFF', fontSize: 14, fontWeight: 600, padding: '14px 32px', borderRadius: 8 }}
          >
            ¿Tenés otra pregunta? Escribinos por WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section id="cotizar" className="relative overflow-hidden" style={{ background: '#0A0A0A', borderTop: '2px solid #F7941D' }}>
      <div className="grain-overlay absolute inset-0 z-[0]" />
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 900px 400px at 50% 50%, rgba(247,148,29,0.09) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.p variants={fadeUp} style={{ color: '#F7941D', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24, fontFamily: "'Space Grotesk',sans-serif" }}>
            EMPEZÁ HOY
          </motion.p>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 24, maxWidth: 580, textWrap: 'balance' }}>
            Tu próxima compra internacional está a un mensaje de distancia.
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#666666', fontSize: 17, marginBottom: 28, maxWidth: 460 }}>
            Nos encargamos de todo. Vos solo elegís lo que querés.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 40, color: '#444444', fontSize: 13 }}>
            <span>✓ Sin tarjeta internacional</span>
            <span style={{ color: '#222222' }}>·</span>
            <span>✓ Respuesta en horas</span>
            <span style={{ color: '#222222' }}>·</span>
            <span>✓ Entrega en Guatemala</span>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <motion.a href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(247,148,29,0.32)' }} whileTap={{ scale: 0.97 }}
              style={{ background: '#F7941D', color: '#000000', fontWeight: 700, fontSize: 14, padding: '14px 32px', borderRadius: 8 }}
            >Cotizar ahora</motion.a>
            <motion.a href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
              whileHover={{ background: '#FFFFFF', color: '#000000', scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18 }}
              style={{ border: '1px solid #333333', color: '#FFFFFF', fontWeight: 600, fontSize: 14, padding: '14px 32px', borderRadius: 8 }}
            >Hablar por WhatsApp</motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = ['Servicios', 'Cómo funciona', 'FAQ', 'Contacto']
  return (
    <footer style={{ background: '#0D0D0D', borderTop: '1px solid #111111' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <LogoMark size={30} />
              <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, letterSpacing: '0.06em' }}>INTER EXPRESS GT</span>
            </div>
            <p style={{ color: '#444444', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Compra en cualquier tienda del mundo. Nosotros lo traemos a Guatemala.</p>
            <p style={{ color: '#2A2A2A', fontSize: 13 }}>Jalapa, Guatemala</p>
          </div>
          <div>
            <p style={{ color: '#2A2A2A', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>NAVEGACIÓN</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {links.map(l => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(' ', '-')}`} style={{ color: '#444444', fontSize: 14, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.target.style.color = '#FFFFFF')} onMouseLeave={e => (e.target.style.color = '#444444')}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ color: '#2A2A2A', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>CONTACTO</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li>
                <a href="https://instagram.com/interexpress.gt" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#444444', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={e => (e.currentTarget.style.color = '#444444')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @interexpress.gt
                </a>
              </li>
              <li>
                <a href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#444444', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={e => (e.currentTarget.style.color = '#444444')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #111111', paddingTop: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ color: '#2A2A2A', fontSize: 13 }}>© 2025 Inter Express GT — Compra global. Recibe en Guatemala.</p>
          <p style={{ color: '#222222', fontSize: 12 }}>Jalapa, Guatemala · Servicio confiable desde 2020</p>
        </div>
      </div>
    </footer>
  )
}

// ─── WhatsApp Float ───────────────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center whatsapp-btn"
      style={{ background: '#25D366' }} aria-label="Contactar por WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </motion.a>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh' }}>
      <GlobalGrain />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
