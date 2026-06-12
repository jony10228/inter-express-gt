import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import videoSrc from './videos/inter-express-explainer.mp4'
import logo from './img/logo.jpg'

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
  const C = 300
  const R = 272  // +16% vs 234 anterior

  const routes = [
    { id: 'US', label: 'USA',    pos: { x: 153, y: 162 }, d: 'M 153,162 C 38,28 442,20 300,300',   dur: 5.4, delay: 0   },
    { id: 'CN', label: 'China',  pos: { x: 455, y: 159 }, d: 'M 455,159 C 570,22 392,18 300,300',  dur: 6.0, delay: 1.9 },
    { id: 'MX', label: 'México', pos: { x: 170, y: 338 }, d: 'M 170,338 C 46,218 106,396 300,300', dur: 4.6, delay: 1.0 },
  ]

  const lats = [-55, -35, -15, 0, 15, 35, 55]
  const nLng = 10

  const stars = [
    {x:48,y:88,r:0.7,o:0.22},{x:112,y:42,r:0.9,o:0.16},{x:195,y:65,r:0.5,o:0.28},
    {x:62,y:190,r:0.8,o:0.18},{x:505,y:70,r:0.6,o:0.25},{x:538,y:148,r:1.0,o:0.14},
    {x:478,y:232,r:0.7,o:0.20},{x:554,y:322,r:0.5,o:0.28},{x:530,y:422,r:0.8,o:0.17},
    {x:480,y:494,r:0.6,o:0.22},{x:382,y:542,r:0.9,o:0.18},{x:282,y:560,r:0.6,o:0.14},
    {x:168,y:534,r:0.8,o:0.20},{x:84,y:490,r:0.6,o:0.25},{x:44,y:392,r:1.0,o:0.16},
    {x:60,y:298,r:0.5,o:0.22},{x:86,y:138,r:0.7,o:0.18},{x:434,y:46,r:0.6,o:0.26},
    {x:364,y:30,r:0.9,o:0.15},{x:242,y:26,r:0.7,o:0.20},{x:156,y:22,r:0.5,o:0.18},
    {x:24,y:252,r:0.6,o:0.16},{x:22,y:352,r:0.8,o:0.22},{x:572,y:238,r:0.7,o:0.15},
    {x:576,y:392,r:0.5,o:0.20},{x:428,y:567,r:0.8,o:0.14},{x:202,y:577,r:0.5,o:0.18},
    {x:78,y:550,r:0.7,o:0.17},
  ]

  // Orbital ambient particles — tiny orange dots pulsing around the sphere rim
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 2 * Math.PI + 0.4
    const dist = R + 16 + (i % 4) * 10
    return {
      x: Math.round(C + dist * Math.cos(angle)),
      y: Math.round(C + dist * Math.sin(angle)),
      delay: +(i * 0.36).toFixed(2),
      dur:   +(2.6 + (i % 5) * 0.55).toFixed(1),
      r:     +(0.7 + (i % 3) * 0.4).toFixed(1),
    }
  })

  return (
    <svg width="100%" height="100%" viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet" fill="none"
      style={{ display: 'block', opacity: 0.93 }}
    >
      <defs>
        <filter id="glb-bloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <filter id="glb-glow-md" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glb-glow-sm" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glb-glow-xs" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glb-atm" x="-8%" y="-8%" width="116%" height="116%">
          <feGaussianBlur stdDeviation="14" />
        </filter>

        {/* Sphere — warm light upper-left, cool dark body */}
        <radialGradient id="glb-sphere" cx="36%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#241810" />
          <stop offset="30%"  stopColor="#160F07" />
          <stop offset="65%"  stopColor="#0D0905" />
          <stop offset="100%" stopColor="#060403" />
        </radialGradient>

        {/* Specular highlight — bright warm spot upper-left */}
        <radialGradient id="glb-spec" cx="28%" cy="22%" r="34%">
          <stop offset="0%"   stopColor="rgba(255,195,100,0.22)" />
          <stop offset="55%"  stopColor="rgba(247,148,29,0.07)" />
          <stop offset="100%" stopColor="rgba(247,148,29,0)" />
        </radialGradient>

        {/* Shadow — dark lower-right opposite the light */}
        <radialGradient id="glb-shadow" cx="70%" cy="74%" r="52%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.72)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Edge vignette — sphere melts into background */}
        <radialGradient id="glb-edge" cx="50%" cy="50%" r="50%">
          <stop offset="42%" stopColor="transparent" />
          <stop offset="80%" stopColor="rgba(6,4,2,0.5)" />
          <stop offset="100%" stopColor="#0D0D0D" />
        </radialGradient>

        {/* GT inner bloom */}
        <radialGradient id="glb-gtbloom" cx="50%" cy="50%">
          <stop offset="0%"  stopColor="rgba(247,148,29,0.52)" />
          <stop offset="35%" stopColor="rgba(247,148,29,0.16)" />
          <stop offset="100%" stopColor="rgba(247,148,29,0)" />
        </radialGradient>

        {/* Atmosphere rim gradient */}
        <radialGradient id="glb-atm-grad" cx="50%" cy="50%" r="50%">
          <stop offset="88%"  stopColor="rgba(247,148,29,0)" />
          <stop offset="100%" stopColor="rgba(247,148,29,0.13)" />
        </radialGradient>

        {/* Route line gradients: dim at origin, bright orange at GT */}
        {routes.map(r => (
          <linearGradient key={r.id} id={`glb-rg-${r.id}`}
            x1={r.pos.x} y1={r.pos.y} x2={300} y2={300}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#F7941D" stopOpacity="0.04"/>
            <stop offset="40%"  stopColor="#F7941D" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#F7941D" stopOpacity="0.72"/>
          </linearGradient>
        ))}

        {/* Micro dot texture */}
        <pattern id="glb-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="0.65" fill="rgba(255,255,255,0.038)" />
        </pattern>

        <clipPath id="glb-clip">
          <circle cx={C} cy={C} r={R} />
        </clipPath>
      </defs>

      {/* ── STARS ──────────────────────────────────────────── */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.o} />
      ))}

      {/* ── ATMOSPHERE outer glow halo ─────────────────────── */}
      <circle cx={C} cy={C} r={R + 4}
        fill="none" stroke="rgba(247,148,29,0.09)" strokeWidth="30"
        filter="url(#glb-atm)" />

      {/* ── SPHERE BODY ────────────────────────────────────── */}
      <circle cx={C} cy={C} r={R} fill="url(#glb-sphere)" />

      {/* ── DOT MATRIX texture ─────────────────────────────── */}
      <g clipPath="url(#glb-clip)">
        <rect x="0" y="0" width="600" height="600" fill="url(#glb-dots)" />
      </g>

      {/* ── LAT/LNG GRID (slow rotation) ───────────────────── */}
      <g clipPath="url(#glb-clip)">
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from="0 300 300" to="360 300 300" dur="90s" repeatCount="indefinite" />
          {lats.map((lat, i) => {
            const cy2 = C - R * Math.sin(lat * Math.PI / 180)
            const rx  = R * Math.cos(lat * Math.PI / 180)
            return (
              <ellipse key={i} cx={C} cy={cy2} rx={rx} ry={rx * 0.088}
                stroke={lat === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}
                strokeWidth={lat === 0 ? 0.7 : 0.4} fill="none" />
            )
          })}
          {Array.from({ length: nLng }, (_, i) => (
            <ellipse key={i} cx={C} cy={C} rx={R * 0.042} ry={R}
              stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" fill="none"
              transform={`rotate(${i * (180 / nLng)},${C},${C})`} />
          ))}
        </g>
      </g>

      {/* ── SPECULAR HIGHLIGHT ─────────────────────────────── */}
      <circle cx={C} cy={C} r={R} fill="url(#glb-spec)" clipPath="url(#glb-clip)" />

      {/* ── SHADOW ─────────────────────────────────────────── */}
      <circle cx={C} cy={C} r={R} fill="url(#glb-shadow)" clipPath="url(#glb-clip)" />

      {/* ── EDGE VIGNETTE ──────────────────────────────────── */}
      <circle cx={C} cy={C} r={R} fill="url(#glb-edge)" />

      {/* ── ATMOSPHERE rim ─────────────────────────────────── */}
      <circle cx={C} cy={C} r={R} fill="url(#glb-atm-grad)" />
      <circle cx={C} cy={C} r={R}
        fill="none" stroke="rgba(247,148,29,0.12)" strokeWidth="1.5" />

      {/* ── GT DEEP BLOOM ──────────────────────────────────── */}
      <circle cx={C} cy={C} r="155" fill="url(#glb-gtbloom)" filter="url(#glb-bloom)" />

      {/* ── ROUTE BASE TRACKS ──────────────────────────────── */}
      {routes.map(r => (
        <path key={`rb-${r.id}`} d={r.d}
          stroke="rgba(255,255,255,0.03)" strokeWidth="0.7" />
      ))}

      {/* ── ROUTE GLOWING LINES ────────────────────────────── */}
      {routes.map(r => (
        <g key={`rl-${r.id}`}>
          <path d={r.d} stroke="rgba(247,148,29,0.07)" strokeWidth="8"
            filter="url(#glb-glow-sm)" />
          <path d={r.d} stroke={`url(#glb-rg-${r.id})`} strokeWidth="1.3" />
        </g>
      ))}

      {/* ── PACKAGE PARTICLES ──────────────────────────────── */}
      {routes.flatMap(r =>
        [0, 1].map(wave => {
          const t0 = r.delay + wave * (r.dur * 0.5)
          return (
            <g key={`pkg-${r.id}-${wave}`}>
              {/* Glow halo */}
              <circle r="9" fill="rgba(247,148,29,0.22)" filter="url(#glb-glow-sm)">
                <animateMotion path={r.d} dur={`${r.dur}s`}
                  repeatCount="indefinite" begin={`${t0}s`} rotate="auto" />
              </circle>
              {/* Package box — auto-rotates to face direction of travel */}
              <g>
                <animateMotion path={r.d} dur={`${r.dur}s`}
                  repeatCount="indefinite" begin={`${t0}s`} rotate="auto" />
                <rect x="-5.5" y="-4" width="11" height="8" rx="1.5"
                  fill="#F7941D" stroke="rgba(255,220,150,0.4)" strokeWidth="0.6" />
                <line x1="-5.5" y1="0" x2="5.5" y2="0"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
                <line x1="0" y1="-4" x2="0" y2="4"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
              </g>
              {/* Trail dot 1 */}
              <circle r="2.2" fill="#F7941D" opacity="0.5">
                <animateMotion path={r.d} dur={`${r.dur}s`}
                  repeatCount="indefinite" begin={`${t0 + 0.18}s`} />
              </circle>
              {/* Trail dot 2 */}
              <circle r="1.3" fill="#F7941D" opacity="0.24">
                <animateMotion path={r.d} dur={`${r.dur}s`}
                  repeatCount="indefinite" begin={`${t0 + 0.32}s`} />
              </circle>
            </g>
          )
        })
      )}

      {/* ── COUNTRY ORIGIN NODES ───────────────────────────── */}
      {routes.map((r, i) => {
        const lw = Math.max(32, r.label.length * 6 + 12)
        return (
          <g key={`nd-${r.id}`}>
            {/* Expanding pulse ring */}
            <circle cx={r.pos.x} cy={r.pos.y} r="14"
              fill="none" stroke="rgba(247,148,29,0.18)" strokeWidth="1">
              <animate attributeName="r" values="12;30;12"
                dur={`${2.8 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
              <animate attributeName="opacity" values="0.4;0;0.4"
                dur={`${2.8 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            </circle>
            {/* Node outer ring */}
            <circle cx={r.pos.x} cy={r.pos.y} r="13"
              fill="#101010" stroke="rgba(247,148,29,0.38)" strokeWidth="1.2" />
            {/* Node inner glow */}
            <circle cx={r.pos.x} cy={r.pos.y} r="6"
              fill="rgba(247,148,29,0.2)" filter="url(#glb-glow-xs)" />
            {/* Core dot */}
            <circle cx={r.pos.x} cy={r.pos.y} r="2.5" fill="#F7941D" />
            {/* Label pill backdrop */}
            <rect x={r.pos.x - lw / 2} y={r.pos.y - 34} width={lw} height="14" rx="3.5"
              fill="rgba(8,6,4,0.78)" stroke="rgba(247,148,29,0.22)" strokeWidth="0.6" />
            {/* Label text */}
            <text x={r.pos.x} y={r.pos.y - 24}
              textAnchor="middle" fontSize="8.5" fontWeight="700" letterSpacing="0.1em"
              fill="rgba(247,148,29,0.88)"
              fontFamily="Space Grotesk,system-ui,sans-serif">{r.label}</text>
          </g>
        )
      })}

      {/* ── GT DESTINATION HUB ─────────────────────────────── */}
      {/* Slow outer pulse */}
      <circle cx={C} cy={C} r="50" fill="none" stroke="rgba(247,148,29,0.08)" strokeWidth="1">
        <animate attributeName="r" values="48;82;48" dur="5.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="5.2s" repeatCount="indefinite" />
      </circle>
      {/* Fast inner pulse */}
      <circle cx={C} cy={C} r="36" fill="none" stroke="rgba(247,148,29,0.16)" strokeWidth="1">
        <animate attributeName="r" values="34;56;34" dur="3.7s" repeatCount="indefinite" begin="0.7s" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="3.7s" repeatCount="indefinite" begin="0.7s" />
      </circle>
      {/* Hub ring with glow */}
      <circle cx={C} cy={C} r="26"
        fill="#131313" stroke="#F7941D" strokeWidth="1.6" filter="url(#glb-glow-md)" />
      {/* Warm inner fill */}
      <circle cx={C} cy={C} r="16" fill="rgba(247,148,29,0.1)" />
      {/* GT label */}
      <text x={C} y={C - 2} textAnchor="middle"
        fontSize="11" fontWeight="800" fill="#FFFFFF" letterSpacing="2"
        fontFamily="Space Grotesk,system-ui,sans-serif">GT</text>
      {/* GUATEMALA sub-label */}
      <text x={C} y={C + 12} textAnchor="middle"
        fontSize="5.5" fontWeight="600" fill="rgba(247,148,29,0.65)"
        fontFamily="Space Grotesk,system-ui,sans-serif" letterSpacing="1.2">GUATEMALA</text>

    </svg>
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
    <div className="flow-card" style={{
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
        <div className="flow-track" style={{ position: 'absolute', left: 40, right: 40, top: 38, height: 2, zIndex: 0, borderRadius: 2 }}>
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
            <div key={i} className="flow-node-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 80 }}>
              <div className="flow-node-circle" style={{
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
                <span className="flow-node-emoji" style={{ fontSize: 32, lineHeight: 1 }}>{n.icon}</span>
              </div>
              <span className="flow-node-label" style={{
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
    <div className="casillero-card" style={{
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
          <img src={logo} alt="Inter Express GT" style={{ height: 40, width: 'auto', display: 'block' }} className="h-10 sm:h-10 xs:h-8" />
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
    <section id="hero" className="relative overflow-hidden flex flex-col" style={{ background: '#0D0D0D', minHeight: '100vh' }}>
      <div className="grain-overlay absolute inset-0 z-[1]" />

      {/* Ambient left glow */}
      <div className="absolute pointer-events-none z-[1]" style={{ left: -100, top: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(247,148,29,0.05) 0%, transparent 65%)', filter: 'blur(40px)' }} />

      {/* Content: 2-col grid, texto izquierda / globo derecha, centrado verticalmente */}
      <div className="relative z-10 flex-1 flex flex-col justify-center" style={{ paddingTop: 80, paddingBottom: 24 }}>
        <div className="max-w-6xl mx-auto px-6 md:pl-10 w-full">
          <div className="grid md:grid-cols-[55%_45%] md:gap-8 items-center">
            <div>
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
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <motion.a
              href="#cotizar"
              whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(247,148,29,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="text-center"
              style={{ background: '#F7941D', color: '#000000', fontWeight: 700, fontSize: 14, padding: '14px 28px', borderRadius: 8 }}
            >
              Cotizar ahora
            </motion.a>
            <motion.a
              href="https://wa.me/50200000000" target="_blank" rel="noopener noreferrer"
              whileHover={{ borderColor: '#FFFFFF', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="text-center"
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
            </div>{/* /text column */}

            {/* Globe desktop — right column */}
            <div className="hidden md:flex items-center justify-center" style={{ pointerEvents: 'none' }}>
              <motion.div style={{ x: globeX, y: globeY }}>
                <div style={{ width: 480, height: 480 }}>
                  <GlobeHero />
                </div>
              </motion.div>
            </div>

          </div>{/* /grid */}

          {/* Globe mobile — below grid */}
          <div className="md:hidden flex justify-center mt-8" style={{ pointerEvents: 'none' }}>
            <div style={{ width: 300, height: 300, opacity: 0.65 }}>
              <GlobeHero />
            </div>
          </div>
        </div>{/* /max-w */}
      </div>{/* /content */}

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
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(36px, 9vw, 64px)', fontWeight: 900, lineHeight: 1, marginBottom: 10 }}>
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
      <div className="service-section" style={{ background: '#0D0D0D', padding: '80px 0 120px', borderTop: '1px solid #111111', position: 'relative', overflow: 'hidden' }}>
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
      <div className="service-section" style={{ background: '#080808', padding: '120px 0', borderTop: '1px solid #141414', borderBottom: '1px solid #141414', position: 'relative', overflow: 'hidden' }}>
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
  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'FAQ', href: '#faq' },
  ]

  const contactItems = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      text: 'Jalapa, Guatemala',
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      text: 'info@interexpressgt.com',
      href: 'mailto:info@interexpressgt.com',
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      text: '+502 XXXX-XXXX',
      href: 'https://wa.me/50200000000',
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      text: 'Lun–Vie 8AM–6PM · Sáb 8AM–1PM',
    },
  ]

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com/interexpress.gt',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com/interexpressgt',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/50200000000',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: 'TikTok',
      href: 'https://tiktok.com/@interexpressgt',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
        </svg>
      ),
    },
  ]

  const paymentMethods = ['Visa', 'Mastercard', 'Transferencia', 'Efectivo']

  const colTitle = (text) => (
    <p style={{ color: '#F7941D', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>{text}</p>
  )

  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid #2A2A2A', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow bottom-left */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 500, height: 400, background: 'radial-gradient(circle at bottom left, rgba(247,148,29,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="max-w-6xl mx-auto px-6 py-16 relative">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src={logo} alt="Inter Express GT" style={{ height: 36, width: 'auto', display: 'block' }} />
              <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 13, letterSpacing: '0.06em' }}>INTER EXPRESS GT</span>
            </div>
            <p style={{ color: '#F7941D', fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Compra global. Recibe en Guatemala.</p>
            <p style={{ color: '#555555', fontSize: 13.5, lineHeight: 1.75 }}>
              Tu puente de compras internacionales. Comprá en cualquier tienda del mundo y recibilo en Guatemala.
            </p>
          </div>

          {/* Col 2 — Navegación */}
          <div>
            {colTitle('Navegación')}
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    style={{ color: '#AAAAAA', fontSize: 14, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#AAAAAA')}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contacto */}
          <div>
            {colTitle('Contacto')}
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {contactItems.map(({ icon, text, href }, i) => (
                <li key={i}>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ color: '#AAAAAA', fontSize: 13.5, display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5, transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#AAAAAA')}
                    >
                      <span style={{ color: '#F7941D', marginTop: 1, flexShrink: 0 }}>{icon}</span>
                      {text}
                    </a>
                  ) : (
                    <span style={{ color: '#AAAAAA', fontSize: 13.5, display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                      <span style={{ color: '#F7941D', marginTop: 1, flexShrink: 0 }}>{icon}</span>
                      {text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Redes + Pagos */}
          <div>
            {colTitle('Seguinos')}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888888', transition: 'border-color 0.2s, color 0.2s, background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F7941D'; e.currentTarget.style.color = '#F7941D'; e.currentTarget.style.background = 'rgba(247,148,29,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888888'; e.currentTarget.style.background = 'transparent' }}
                >
                  {icon}
                </a>
              ))}
            </div>

            {colTitle('Métodos de pago')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {paymentMethods.map(m => (
                <span
                  key={m}
                  style={{ background: '#141414', border: '1px solid #2A2A2A', borderRadius: 6, padding: '5px 11px', color: '#888888', fontSize: 11.5, fontWeight: 500, letterSpacing: '0.02em' }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

        </div>{/* /grid */}

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <p style={{ color: '#555555', fontSize: 13 }}>© 2025 Inter Express GT. Todos los derechos reservados.</p>
          <p style={{ color: '#555555', fontSize: 13 }}>Diseñado con ♥ en Guatemala</p>
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
