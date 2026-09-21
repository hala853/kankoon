import { useState, useRef, useEffect, useId } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface KankoonMascotProps {
  size?: number;
  isOpen?: boolean;
}

export function KankoonMascot({ size = 72, isOpen = false }: KankoonMascotProps) {
  const uid = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Pupil offsets driven by motion values (no React re-render per mouse move)
  const pupilX = useSpring(useTransform(mouseX, v => v * 2.8), { stiffness: 200, damping: 20 });
  const pupilY = useSpring(useTransform(mouseY, v => v * 2.8), { stiffness: 200, damping: 20 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'thinking'>('neutral');

  // 3D tilt springs — tight & responsive
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [22, -22]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-22, 22]), { stiffness: 120, damping: 18 });

  // Global mouse tracking → tilt & pupil (motion values only, throttled via rAF, no setState)
  useEffect(() => {
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let pending = false;
    const apply = () => {
      pending = false;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = Math.max(-1, Math.min(1, (lastX - cx) / (window.innerWidth * 0.3)));
      const ny = Math.max(-1, Math.min(1, (lastY - cy) / (window.innerHeight * 0.3)));
      mouseX.set(nx);
      mouseY.set(ny);
    };
    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(apply);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [mouseX, mouseY]);

  // Auto-blink every 3–5 s
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const scheduleBlink = (): void => {
      t = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => { setIsBlinking(false); scheduleBlink(); }, 140);
      }, 3000 + Math.random() * 2000);
    };
    scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Rotate expression when chat opens
  useEffect(() => {
    if (isOpen) {
      setExpression('happy');
      const t = setTimeout(() => setExpression('thinking'), 2500);
      return () => clearTimeout(t);
    }
    setExpression('neutral');
    return undefined;
  }, [isOpen]);

  // Mouth path per expression
  const mouthPath =
    expression === 'happy'   ? 'M 40 75 Q 50 83 60 75' :
    expression === 'thinking' ? 'M 43 77 Q 50 75 57 77' :
                                'M 42 76 Q 50 80 58 76';

  // Left eyebrow per expression
  const lBrow =
    expression === 'thinking' ? 'M 27 52 Q 36 48 45 52' :
    expression === 'happy'    ? 'M 27 53 Q 36 50 45 53' :
                                'M 28 54 Q 36 51 44 54';

  const rBrow =
    expression === 'thinking' ? 'M 55 52 Q 64 55 73 52' :
    expression === 'happy'    ? 'M 55 53 Q 64 50 73 53' :
                                'M 56 54 Q 64 51 72 54';

  return (
    <div ref={containerRef} style={{ width: size, height: size, perspective: 700 }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating idle */}
        <motion.div
          animate={{ y: [0, -9, 0], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%' }}
        >
          <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            style={{ overflow: 'visible', filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55))' }}
          >
            <defs>
              {/* Body radial gradient — chocolate 3D */}
              <radialGradient id={`km-body-${uid}`} cx="32%" cy="28%" r="75%">
                <stop offset="0%"   stopColor="#5c3820" />
                <stop offset="55%"  stopColor="#2d1f13" />
                <stop offset="100%" stopColor="#0f0a06" />
              </radialGradient>

              {/* Roof linear gradient — gold */}
              <linearGradient id={`km-roof-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#f5d078" />
                <stop offset="45%"  stopColor="#c9974a" />
                <stop offset="100%" stopColor="#7a5020" />
              </linearGradient>

              {/* Eye iris — deep amber */}
              <radialGradient id={`km-iris-${uid}`} cx="38%" cy="32%" r="68%">
                <stop offset="0%"   stopColor="#fde08a" />
                <stop offset="50%"  stopColor="#c9974a" />
                <stop offset="100%" stopColor="#6b3f10" />
              </radialGradient>

              {/* Orb top */}
              <radialGradient id={`km-orb-${uid}`} cx="35%" cy="30%" r="70%">
                <stop offset="0%"   stopColor="#fde08a" />
                <stop offset="100%" stopColor="#c9974a" />
              </radialGradient>

              {/* Ambient glow under */}
              <radialGradient id={`km-glow-${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(201,151,74,0.45)" />
                <stop offset="100%" stopColor="rgba(201,151,74,0)" />
              </radialGradient>

              {/* Inner glow filter for eyes */}
              <filter id={`km-eye-glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Soft glow filter for body */}
              <filter id={`km-body-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Key gradient */}
              <linearGradient id={`km-key-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#f5d078" />
                <stop offset="100%" stopColor="#c9974a" />
              </linearGradient>
            </defs>

            {/* ── Ambient ground glow ── */}
            <ellipse cx="50" cy="96" rx="28" ry="6" fill={`url(#km-glow-${uid})`} />

            {/* ── Ground shadow ── */}
            <ellipse cx="50" cy="93" rx="19" ry="3.5" fill="#050301" opacity="0.45" />

            {/* ── Body glow ring ── */}
            <motion.ellipse
              cx="50" cy="65"
              rx="35" ry="32"
              fill="rgba(201,151,74,0.07)"
              animate={{ opacity: [0.07, 0.15, 0.07], scale: [1, 1.06, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* ── Body ── */}
            <rect
              x="18" y="46"
              width="64" height="46"
              rx="13"
              fill={`url(#km-body-${uid})`}
              stroke="#c9974a"
              strokeWidth="1.6"
            />

            {/* Body top highlight (3D shine) */}
            <rect
              x="21" y="49"
              width="30" height="16"
              rx="8"
              fill="rgba(255,255,255,0.07)"
            />

            {/* Body edge depth (right/bottom) */}
            <path
              d="M 18 82 L 82 82 L 82 79 A 13 13 0 0 1 69 92 L 31 92 A 13 13 0 0 1 18 79 Z"
              fill="rgba(0,0,0,0.35)"
            />

            {/* ── Roof / Hat ── */}
            <polygon
              points="50,6 13,47 87,47"
              fill={`url(#km-roof-${uid})`}
              stroke="#c9974a"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Roof highlight (left face) */}
            <polygon
              points="50,8 16,46 40,46"
              fill="rgba(255,255,255,0.13)"
            />
            {/* Roof shadow (right face) */}
            <polygon
              points="50,8 84,46 63,46"
              fill="rgba(0,0,0,0.18)"
            />

            {/* Roof top orb */}
            <circle cx="50" cy="6" r="5" fill={`url(#km-orb-${uid})`} />
            <circle cx="48.5" cy="4.5" r="1.5" fill="rgba(255,255,255,0.6)" />

            {/* ── Left Eye ── */}
            {/* glow halo */}
            <motion.circle
              cx="36" cy="63"
              fill="rgba(201,151,74,0.22)"
              filter={`url(#km-eye-glow-${uid})`}
              initial={{ r: 11 }}
              animate={{ r: [11, 12.5, 11], opacity: [0.22, 0.38, 0.22] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* sclera */}
            <circle cx="36" cy="63" r="8.2" fill="#f2ead8" />
            {/* iris */}
            <circle cx="36" cy="63" r="5.6" fill={`url(#km-iris-${uid})`} />
            {/* pupil */}
            <motion.circle
              cx={useTransform(pupilX, v => 36 + v)}
              cy={useTransform(pupilY, v => 63 + v)}
              r="2.6"
              fill="#0a0604"
            />
            {/* specular */}
            <motion.circle
              cx={useTransform(pupilX, v => 34.8 + v * 0.4)}
              cy={useTransform(pupilY, v => 61.6 + v * 0.4)}
              r="0.9"
              fill="white"
            />
            <motion.circle
              cx={useTransform(pupilX, v => 37.4 + v * 0.4)}
              cy={useTransform(pupilY, v => 64 + v * 0.4)}
              r="0.5"
              fill="rgba(255,255,255,0.6)"
            />
            {/* eyelid (blink) */}
            {isBlinking && (
              <rect x="27" y="55" width="18" height="16" rx="8" fill="#2d1f13" />
            )}

            {/* ── Right Eye ── */}
            <motion.circle
              cx="64" cy="63"
              fill="rgba(201,151,74,0.22)"
              filter={`url(#km-eye-glow-${uid})`}
              initial={{ r: 11 }}
              animate={{ r: [11, 12.5, 11], opacity: [0.22, 0.38, 0.22] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            <circle cx="64" cy="63" r="8.2" fill="#f2ead8" />
            <circle cx="64" cy="63" r="5.6" fill={`url(#km-iris-${uid})`} />
            <motion.circle
              cx={useTransform(pupilX, v => 64 + v)}
              cy={useTransform(pupilY, v => 63 + v)}
              r="2.6"
              fill="#0a0604"
            />
            <motion.circle
              cx={useTransform(pupilX, v => 62.8 + v * 0.4)}
              cy={useTransform(pupilY, v => 61.6 + v * 0.4)}
              r="0.9"
              fill="white"
            />
            <motion.circle
              cx={useTransform(pupilX, v => 65.4 + v * 0.4)}
              cy={useTransform(pupilY, v => 64 + v * 0.4)}
              r="0.5"
              fill="rgba(255,255,255,0.6)"
            />
            {isBlinking && (
              <rect x="55" y="55" width="18" height="16" rx="8" fill="#2d1f13" />
            )}

            {/* ── Eyebrows (animated) ── */}
            <path
              d={lBrow}
              stroke="#c9974a"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={rBrow}
              stroke="#c9974a"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />

            {/* ── Nose ── */}
            <circle cx="50" cy="71" r="1.4" fill="#8a5c20" />

            {/* ── Mouth (animated) ── */}
            <path
              d={mouthPath}
              stroke="#c9974a"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />

            {/* ── Cheeks ── */}
            <circle cx="25" cy="69" r="5.5" fill="rgba(220,100,60,0.18)" />
            <circle cx="75" cy="69" r="5.5" fill="rgba(220,100,60,0.18)" />

            {/* ── Left arm ── */}
            <ellipse
              cx="12" cy="69"
              rx="6" ry="4"
              fill="#2d1f13"
              stroke="#c9974a"
              strokeWidth="1.2"
              transform="rotate(-20 12 69)"
            />

            {/* ── Right arm + floating key ── */}
            <ellipse
              cx="88" cy="69"
              rx="6" ry="4"
              fill="#2d1f13"
              stroke="#c9974a"
              strokeWidth="1.2"
              transform="rotate(20 88 69)"
            />

            {/* ── Floating Key (orbiting) ── */}
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '50px 65px' }}
            >
              {/* Key positioned at orbit radius */}
              <g transform="translate(73, 42)">
                {/* Key bow */}
                <circle cx="0" cy="0" r="4" fill="none" stroke={`url(#km-key-${uid})`} strokeWidth="1.8" />
                <circle cx="0" cy="0" r="1.6" fill={`url(#km-orb-${uid})`} />
                {/* Key shaft */}
                <line x1="0" y1="4" x2="0" y2="12" stroke={`url(#km-key-${uid})`} strokeWidth="1.8" strokeLinecap="round" />
                {/* Key teeth */}
                <line x1="0" y1="9"  x2="2.5" y2="9"  stroke={`url(#km-key-${uid})`} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="11.5" x2="2.5" y2="11.5" stroke={`url(#km-key-${uid})`} strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </motion.g>

            {/* ── Door ── */}
            <path
              d="M 42 92 L 42 84 A 8 8 0 0 1 50 76 A 8 8 0 0 1 58 84 L 58 92 Z"
              fill="#0f0a06"
              stroke="#c9974a"
              strokeWidth="1"
            />
            <circle cx="55" cy="84" r="1.2" fill="#c9974a" />

            {/* ── Gold trim lines on body ── */}
            <line x1="18" y1="58" x2="82" y2="58" stroke="rgba(201,151,74,0.2)" strokeWidth="0.8" />

            {/* ── Sparkle particles ── */}
            {[
              { x: 8,  y: 30, delay: 0 },
              { x: 88, y: 38, delay: 1.1 },
              { x: 18, y: 88, delay: 0.6 },
              { x: 82, y: 82, delay: 1.7 },
            ].map((sp, i) => (
              <motion.circle
                key={i}
                cx={sp.x} cy={sp.y}
                r="1.5"
                fill="#c9974a"
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: sp.delay, ease: 'easeInOut' }}
              />
            ))}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
