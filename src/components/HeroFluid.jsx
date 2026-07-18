import { useEffect, useRef } from 'react'

// Живые «волны света» (fbm + domain warping) + НАСТОЯЩАЯ круглая стеклянная
// линза (как сфера monopo): передаём центр и радиус круга; внутри волны
// сэмплируются со сферическим смещением — увеличение в центре и сильное
// преломление у кромок (bulge-профиль сферы), плюс хроматическая аберрация
// и один тонкий светящийся ободок. Никакого DOM-бордера — кромка одна.
const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec3 u_circle;  // центр x, центр y (px, y вверх), радиус (px)

vec2 hash(vec2 p){
  p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise(in vec2 p){
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x+p.y)*K1);
  vec2 a = p - i + (i.x+i.y)*K2;
  float m = step(a.y,a.x);
  vec2 o = vec2(m,1.0-m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0*K2;
  vec3 h = max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0);
  vec3 n = h*h*h*h*vec3(dot(a,hash(i+0.0)),dot(b,hash(i+o)),dot(c,hash(i+1.0)));
  return dot(n, vec3(70.0));
}
float fbm(vec2 p){
  float f = 0.0, a = 0.55;
  mat2 rot = mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<3;i++){ f += a*noise(p); p = rot*p; a *= 0.45; }
  return f;
}

// Палитра волн света по значению полосы
vec3 waveColor(float g, float band){
  vec3 cBase  = vec3(0.851, 0.929, 1.000);
  vec3 cSky   = vec3(0.608, 0.792, 1.000);
  vec3 cAzure = vec3(0.329, 0.612, 0.976);
  vec3 cRoyal = vec3(0.145, 0.420, 0.930);
  vec3 cWhite = vec3(1.0);
  vec3 col = mix(cSky, cBase, g);
  col = mix(col, cAzure, band * 0.55);
  col = mix(col, cRoyal, smoothstep(0.72, 1.0, band) * smoothstep(0.15, 0.6, 1.0 - g) * 0.55);
  float vein = smoothstep(0.76, 0.98, band) * smoothstep(0.3, 0.8, g);
  col = mix(col, cWhite, vein * 0.9);
  col += cWhite * pow(vein, 3.0) * 0.3;
  return col;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;

  // --- SDF круглой линзы ---
  vec2 toC = gl_FragCoord.xy - u_circle.xy;   // px от центра круга
  float rad = u_circle.z;                       // радиус, px
  float dist = length(toC);
  float d = dist - rad;                          // <0 внутри
  float inGlass = rad > 1.0 ? step(d, 0.0) : 0.0;

  // --- сферическая линза: bulge-профиль (0 в центре → 1 у кромки) ---
  // мягкое, как у monopo: внутри почти чисто, у кромки плавный сильный изгиб
  vec2 uvS = uv;
  float nd = 0.0;
  if (inGlass > 0.5) {
    nd = clamp(dist / rad, 0.0, 1.0);
    vec2 dir = toC / max(dist, 1.0);            // единичный, px
    float bulge = 1.0 - sqrt(max(1.0 - nd*nd, 0.0)); // выпуклость сферы у края
    float zoom = 0.09;                           // лёгкое увеличение в центре
    vec2 sampleFC = gl_FragCoord.xy - toC * zoom - dir * bulge * rad * 0.38;
    uvS = sampleFC / u_res;
  }

  vec2 p = uvS;
  p.x *= u_res.x / u_res.y;
  p *= 0.55;
  float t = u_time * 0.055;

  vec2 q = vec2(fbm(p + t*0.9),
                fbm(p + vec2(3.1, 6.7) - t*0.7));
  vec2 r = vec2(fbm(p + 1.4*q + vec2(1.7, 9.2) + t*1.3),
                fbm(p + 1.4*q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 1.2*r - t*0.5);
  float g = clamp(0.5 + 0.6*f, 0.0, 1.0);

  // --- волны света; в стекле фаза расщепляется на R/G/B (аберрация у кромки) ---
  float phase = 6.28318*(g*0.85 + q.x*0.4) - u_time*0.12;
  float ca = inGlass * (0.35 * pow(nd, 2.0) + 0.04);
  float bandR = smoothstep(0.12, 0.88, 0.5 + 0.5*sin(phase + ca));
  float bandG = smoothstep(0.12, 0.88, 0.5 + 0.5*sin(phase));
  float bandB = smoothstep(0.12, 0.88, 0.5 + 0.5*sin(phase - ca));

  vec3 col;
  if (inGlass > 0.5) {
    col = vec3(waveColor(g, bandR).r, waveColor(g, bandG).g, waveColor(g, bandB).b);
    // едва заметная вуаль стекла — без белого fresnel-канта
    col = mix(col, vec3(1.0), 0.03);
  } else {
    col = waveColor(g, bandG);
  }

  // --- ТОНЮСЕНЬКАЯ кромка: волосяная светлая линия, как у monopo ---
  float rim = smoothstep(1.2, 0.0, abs(d)) * (rad > 1.0 ? 1.0 : 0.0);
  col = mix(col, vec3(1.0), rim * 0.4);
  // едва уловимая тень сразу за кромкой — даёт сфере объём без белой полосы
  float halo = smoothstep(rad*0.06, 0.0, d) * step(0.0, d);
  col *= 1.0 - halo * 0.06;

  // виньетка
  float vig = smoothstep(1.3, 0.3, length(uv - vec2(0.5, 0.52)));
  col = mix(col * 0.88 + vec3(0.329, 0.612, 0.976) * 0.04, col, vig);

  // дизеринг
  float dith = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453) - 0.5) / 255.0;
  col += dith;

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`

export default function HeroFluid() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // ВАЖНО: не вызывать loseContext() в cleanup — React StrictMode
    // монтирует эффект дважды, и убитый контекст нельзя пересоздать.
    let gl = null
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false })
        || canvas.getContext('experimental-webgl')
    } catch { gl = null }
    if (!gl || gl.isContextLost()) return

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src); gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('[hero shader]', gl.getShaderInfoLog(s)); return null }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uCircle = gl.getUniformLocation(prog, 'u_circle')

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      const bw = Math.max(1, Math.floor(w * dpr))
      const bh = Math.max(1, Math.floor(h * dpr))
      if (canvas.width === bw && canvas.height === bh) return
      canvas.width = bw
      canvas.height = bh
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    // iOS Safari: фактический размер канваса устаканивается только после
    // первого layout и меняется при сворачивании адресной строки. Без этого
    // шейдер стартует с кривым соотношением сторон и «чинится» лишь после
    // первого скролла. ResizeObserver ловит сам элемент, visualViewport —
    // изменения видимой области, плюс страховочные ресайзы на первых кадрах.
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
    }
    window.addEventListener('resize', resize)
    window.visualViewport && window.visualViewport.addEventListener('resize', resize)
    requestAnimationFrame(resize)
    const t0 = setTimeout(resize, 200)
    const t1 = setTimeout(resize, 600)

    const reduceMotion = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const drawOnce = (tSec) => {
      gl.uniform1f(uTime, tSec)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      // Линза отключена (radius = 0 → inGlass всегда 0): остаются только
      // чистые волны света. Уберём — по просьбе, композиция сферы не зашла.
      gl.uniform3f(uCircle, 0, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!shown) { shown = true; canvas.style.opacity = '1' }
    }

    let shown = false
    const start = performance.now()
    let raf = 0
    let visible = true
    const frame = (now) => {
      drawOnce((now - start) / 1000)
      raf = requestAnimationFrame(frame)
    }
    const play = () => { if (!raf && visible) raf = requestAnimationFrame(frame) }
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0 } }

    if (reduceMotion) {
      // Уважаем системную настройку: рисуем один статичный кадр волн, без анимации.
      drawOnce(12)
    } else {
      // Крутим шейдер только пока hero виден: за экраном rAF на паузе —
      // экономия CPU/батареи и никакого фонового джанка при скролле низа.
      const io = typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            if (visible) play(); else stop()
          }, { threshold: 0 })
        : null
      io ? io.observe(canvas) : play()
      // Не жечь кадры в фоновой вкладке.
      const onVis = () => { if (document.hidden) stop(); else if (visible) play() }
      document.addEventListener('visibilitychange', onVis)
      play()

      canvas.__cleanupLoop = () => {
        stop()
        io && io.disconnect()
        document.removeEventListener('visibilitychange', onVis)
      }
    }

    return () => {
      stop()
      canvas.__cleanupLoop && canvas.__cleanupLoop()
      clearTimeout(t0)
      clearTimeout(t1)
      ro && ro.disconnect()
      window.removeEventListener('resize', resize)
      window.visualViewport && window.visualViewport.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(135deg,#eaf4ff_0%,#bcdcff_45%,#8fc2fb_100%)]">
      <div className="liquid-layer liquid-a" />
      <div className="liquid-layer liquid-b" />
      <div className="liquid-layer liquid-c" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000" aria-hidden />
      <div className="absolute inset-0 grain pointer-events-none" />
    </div>
  )
}
