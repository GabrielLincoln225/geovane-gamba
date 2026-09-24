import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Digits for the Urna Odometer component: 2 0 4 4 4
const URNA_DIGITS = [2, 0, 4, 4, 4]

// Repeated sequence 0..9 twice (20 numbers total) so the odometer can roll smoothly through digits
const DIGIT_CYCLE = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
]

// Target index in the second cycle to ensure a complete roll through prior digits
// 2 -> index 12 (passes 12 digits)
// 0 -> index 10 (passes 10 digits)
// 4 -> index 14 (passes 14 digits)
const TARGET_INDICES = [12, 10, 14, 14, 14]

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const idleVideoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // Final block refs
  const finalBlockRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const credencialRef = useRef<HTMLParagraphElement>(null)
  const sloganRef = useRef<HTMLParagraphElement>(null)
  const avatarUrnaGroupRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const urnaRef = useRef<HTMLDivElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect mobile & prefers-reduced-motion
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768)
    }
    const checkMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setReducedMotion(mediaQuery.matches)
    }

    checkViewport()
    checkMotion()

    window.addEventListener("resize", checkViewport)
    return () => window.removeEventListener("resize", checkViewport)
  }, [])

  const handleLoadedMetadata = () => {
    setIsLoaded(true)
  }

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 1) {
      setIsLoaded(true)
    }
  }, [])

  // GSAP Orchestrated Timeline
  useEffect(() => {
    if (!isLoaded) return
    const container = containerRef.current
    const video = videoRef.current
    const idleVideo = idleVideoRef.current
    const overlay = overlayRef.current

    if (!container || !video) return

    // Reduced motion fallback: show static final layout immediately
    if (reducedMotion) {
      if (overlay) overlay.style.opacity = "0.85"
      if (finalBlockRef.current) finalBlockRef.current.style.opacity = "1"
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = "1"
      if (nameRef.current) nameRef.current.style.opacity = "1"
      if (credencialRef.current) credencialRef.current.style.opacity = "1"
      if (sloganRef.current) sloganRef.current.style.opacity = "1"
      if (avatarUrnaGroupRef.current) avatarUrnaGroupRef.current.style.opacity = "1"
      if (ctaGroupRef.current) ctaGroupRef.current.style.opacity = "1"
      if (footerRef.current) footerRef.current.style.opacity = "1"

      // Lock odometer strips to target positions
      TARGET_INDICES.forEach((targetIndex, i) => {
        const strip = document.querySelector(`.odometer-strip-${i}`) as HTMLElement
        if (strip) {
          strip.style.transform = `translateY(-${targetIndex * 5}%)`
        }
      })
      return
    }

    video.pause()

    const ctx = gsap.context(() => {
      const pinDistance = isMobile ? "320vh" : "450vh"
      const videoProxy = { currentTime: 0 }

      // Total timeline length: 10.0s
      // 0.0s - 0.15s: Idle video to scrub video handoff
      // 0.15s - 8.0s: PURE VIDEO ANIMATION & PARALLAX (Zero letters on screen)
      // 8.0s - 10.0s: Video rests on final frame; FINAL BLOCK reveals in ~1.6s sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress === 0 && idleVideo) {
              idleVideo.play().catch(() => {})
            }
          },
        },
      })

      // -------------------------------------------------------------
      // 1. INITIAL SCROLL: HIDE PROMPT & ACTIVATE SCRUB VIDEO
      // -------------------------------------------------------------
      if (scrollHintRef.current) {
        tl.to(
          scrollHintRef.current,
          { opacity: 0, y: -15, duration: 0.15, ease: "power2.in" },
          0
        )
      }

      if (idleVideo) {
        tl.to(idleVideo, { opacity: 0, duration: 0.12, ease: "power1.out" }, 0)
      }
      tl.to(video, { opacity: 1, duration: 0.12, ease: "power1.out" }, 0)

      // -------------------------------------------------------------
      // 2. PARALLAX DEPTH ON VIDEO WRAPPER
      // -------------------------------------------------------------
      if (videoWrapperRef.current) {
        tl.fromTo(
          videoWrapperRef.current,
          { scale: 1.05 },
          { scale: 1.0, duration: 8.0, ease: "none" },
          0
        )
      }

      // -------------------------------------------------------------
      // 3. FLUID VIDEO SCRUB (0.0s to 8.0s) — ALL-INTRA KEYFRAMES
      // -------------------------------------------------------------
      tl.to(
        videoProxy,
        {
          currentTime: 8.0,
          duration: 8.0,
          ease: "none",
          onUpdate: () => {
            if (video && !isNaN(video.duration) && video.duration > 0) {
              const target = Math.min(Math.max(videoProxy.currentTime, 0), video.duration - 0.01)
              video.currentTime = target
            }
          },
        },
        0
      )

      // Hold video on the final aerial frame for the final 20%
      tl.to(
        videoProxy,
        {
          currentTime: 8.0,
          duration: 2.0,
          ease: "none",
        },
        8.0
      )

      // -------------------------------------------------------------
      // 4. DYNAMIC CONTRAST GRADIENT OVERLAY
      // Ramps up strongly to ~85% on the left to guarantee AAA text contrast against bright sky
      // -------------------------------------------------------------
      if (overlay) {
        tl.fromTo(
          overlay,
          { opacity: 0.25 },
          { opacity: 0.25, duration: 4.5, ease: "none" },
          0
        )
        tl.to(
          overlay,
          { opacity: 0.65, duration: 2.5, ease: "power1.inOut" },
          4.5
        )
        tl.to(
          overlay,
          { opacity: 0.85, duration: 1.0, ease: "power1.inOut" },
          7.0
        )
        tl.to(
          overlay,
          { opacity: 0.88, duration: 2.0, ease: "none" },
          8.0
        )
      }

      // -------------------------------------------------------------
      // 5. BLOCO FINAL: ANIMAÇÃO DE ENTRADA (GSAP, ~1.6s DURATION)
      // Entra nos 20% finais (a partir de t = 8.1s)
      // -------------------------------------------------------------
      // Ensure the container is visible
      if (finalBlockRef.current) {
        tl.set(finalBlockRef.current, { opacity: 1 }, 8.1)
      }

      // Step 1: Eyebrow (fade + leve slide)
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          8.1
        )
      }

      // Step 2: Nome (SplitText por caracteres com máscara overflow:hidden, ease: expo.out)
      tl.fromTo(
        ".name-char",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.55,
          stagger: 0.025,
          ease: "expo.out",
        },
        8.2
      )

      // Step 3: Credencial (fade simples, 0.3s)
      if (credencialRef.current) {
        tl.fromTo(
          credencialRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" },
          8.45
        )
      }

      // Step 4: Slogan (SplitText por palavras, fade + blur 8px -> 0. "Nortão" entra por último com atraso extra)
      tl.fromTo(
        ".slogan-word:not(.slogan-word-highlight)",
        { opacity: 0, y: 12, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
        },
        8.55
      )

      tl.fromTo(
        ".slogan-word-highlight",
        { opacity: 0, y: 12, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power2.out",
        },
        8.85
      )

      // Step 5 & 6: Avatar + Urna
      // Avatar: scale 0.9 -> 1 com fade, junto com a urna
      if (avatarRef.current) {
        tl.fromTo(
          avatarRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1.0, duration: 0.45, ease: "power2.out" },
          8.95
        )
      }

      // Urna: casas aparecem
      tl.fromTo(
        ".urna-slot",
        { opacity: 0, scale: 0.92, y: 10 },
        {
          opacity: 1,
          scale: 1.0,
          y: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.out",
        },
        8.95
      )

      // Urna: dígitos rolam como odômetro em cascata (stagger ~0.12s)
      TARGET_INDICES.forEach((targetIndex, i) => {
        tl.fromTo(
          `.odometer-strip-${i}`,
          { yPercent: 0 },
          {
            yPercent: -(targetIndex * 5),
            duration: 0.75,
            ease: "power3.out",
          },
          8.95 + i * 0.12
        )
      })

      // Step 7: Botão + Link (fade + slide por último)
      if (ctaGroupRef.current) {
        tl.fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          9.4
        )
      }

      // Rodapé: fade por último
      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power1.out" },
          9.45
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isLoaded, isMobile, reducedMotion])

  const scrollToQuemE = () => {
    const el = document.getElementById("quem-e")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Helper to render split characters wrapped in overflow:hidden mask
  const renderMaskedWord = (word: string, lineKey: string) => {
    return (
      <span key={lineKey} className="inline-block overflow-hidden leading-[0.88] pb-1">
        {word.split("").map((char, i) => (
          <span
            key={i}
            className="name-char inline-block will-change-transform"
          >
            {char}
          </span>
        ))}
      </span>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-wd-deep-blue text-white select-none"
    >
      {/* Real Semantic H1 for SEO & Accessibility */}
      <h1 className="sr-only">
        Geovane Gamba – Deputado Estadual 20444 | Mato Grosso
      </h1>

      {/* -------------------------------------------------------------
          VIDEO / POSTER PARALLAX STAGE
          ------------------------------------------------------------- */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 w-full h-full overflow-hidden origin-center will-change-transform"
      >
        {/* Poster Image (shown immediately while video assets load) */}
        <img
          src="/hero/hero-poster.jpg"
          alt="Geovane Gamba"
          {...({ fetchpriority: "high" } as any)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
            isLoaded ? "opacity-0" : "opacity-100"
          } ${isMobile ? "object-[82%_center]" : "object-center"}`}
        />

        {/* Idle Video (smooth seamless loop when scroll is at 0) */}
        <video
          ref={idleVideoRef}
          src="/hero/idle.mp4?v=perfect5"
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${isMobile ? "object-[82%_center]" : "object-center"}`}
        />

        {/* Main Parallax Scrub Video (all-intra 100% keyframes for instant seek) */}
        <video
          ref={videoRef}
          src={isMobile ? "/hero/hero-mobile.mp4?v=intra3" : "/hero/hero.mp4?v=intra3"}
          poster="/hero/hero-poster.jpg"
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
            isMobile ? "object-[82%_center]" : "object-center"
          }`}
          style={{ opacity: 0 }}
        />

        {/* Dynamic Dark Gradient Overlay for Contrast */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none bg-gradient-hero transition-opacity duration-200"
          style={{ opacity: 0.25 }}
        />
      </div>

      {/* -------------------------------------------------------------
          STAGE PRINCIPAL: BLOCO FINAL REFEITO SEGUNDO ESPECIFICAÇÃO
          ------------------------------------------------------------- */}
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-between py-8 md:py-10 pointer-events-none">
        
        {/* Empty top spacing (No header tags or badges permitted) */}
        <div className="w-full h-4"></div>

        {/* Center Content Zone (Left 45% Desktop, Centered & Stacked on Mobile) */}
        <div className="relative w-full md:w-[48%] lg:w-[45%] flex-1 flex items-center justify-center md:justify-start">
          
          <div
            ref={finalBlockRef}
            className="w-full flex flex-col items-center md:items-start text-center md:text-left gap-3.5 sm:gap-4 md:gap-5 opacity-0 pointer-events-auto"
          >
            {/* 1. Eyebrow: pequeno, caixa alta, tracking largo */}
            <div ref={eyebrowRef} className="opacity-0">
              <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-wd-orange font-semibold">
                Deputado Estadual · Podemos
              </span>
            </div>

            {/* 2. Nome: o maior elemento da tela, sans display condensada/grotesca, bold/black, caixa alta, tracking levemente negativo, clamp(3.5rem, 8vw, 7.5rem), line-height ~0.9 */}
            <h2
              ref={nameRef}
              className="font-condensed font-black uppercase text-[clamp(2.75rem,11vw,4rem)] md:text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.03em] text-white drop-shadow-xl flex flex-col items-center md:items-start"
            >
              {renderMaskedWord("GEOVANE", "line-1")}
              {renderMaskedWord("GAMBA", "line-2")}
            </h2>

            {/* 3. Credencial: pequena, cor de apoio, colada no nome */}
            <p
              ref={credencialRef}
              className="font-sans text-xs sm:text-sm text-white/75 font-normal tracking-wide -mt-1 sm:-mt-2 opacity-0"
            >
              Produtor rural · Alta Floresta · Nortão de MT
            </p>

            {/* 4. Slogan: segundo maior destaque. A palavra "Nortão" na cor de destaque. text-wrap: balance. */}
            <p
              ref={sloganRef}
              className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-bold text-white tracking-tight leading-tight [text-wrap:balance]"
            >
              <span className="slogan-word inline-block mr-2 will-change-[opacity,filter,transform]">A</span>
              <span className="slogan-word inline-block mr-2 will-change-[opacity,filter,transform]">força</span>
              <span className="slogan-word inline-block mr-2 will-change-[opacity,filter,transform]">jovem</span>
              <span className="slogan-word inline-block mr-2 will-change-[opacity,filter,transform]">do</span>
              <span className="slogan-word slogan-word-highlight inline-block text-wd-orange will-change-[opacity,filter,transform]">Nortão</span>
            </p>

            {/* 5. Avatar + Urna, lado a lado */}
            <div
              ref={avatarUrnaGroupRef}
              className="flex items-center gap-3 sm:gap-4 md:gap-5 pt-1"
            >
              {/* Avatar circular pequeno com borda fina */}
              <div
                ref={avatarRef}
                className="w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full overflow-hidden border border-white/30 shadow-xl shrink-0 opacity-0 will-change-transform"
              >
                <img
                  src="/hero/geovane-avatar.jpg"
                  alt="Geovane Gamba"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Componente Urna (5 casas separadas com rolagem de odômetro) */}
              <div
                ref={urnaRef}
                className="flex flex-col items-start"
                role="group"
                aria-label="Número 20444"
              >
                {/* Label acima, pequeno */}
                <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-white/70 font-medium mb-1">
                  Na urna, digite
                </span>

                {/* 5 casas separadas inspiradas no visor da urna eletrônica */}
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2" aria-hidden="true">
                  {URNA_DIGITS.map((_, i) => (
                    <div
                      key={i}
                      className="urna-slot relative w-8 sm:w-10 md:w-11 h-12 sm:h-14 md:h-15 rounded-[0.25rem] border border-white/20 bg-black/45 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-lg opacity-0"
                    >
                      {/* Inner vignette for electronic visor depth */}
                      <div className="pointer-events-none absolute inset-0 z-10 rounded-[0.25rem] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-2px_4px_rgba(0,0,0,0.6)]" />

                      {/* Odômetro column strip containing 20 digits */}
                      <div
                        className={`odometer-strip-${i} absolute top-0 left-0 w-full will-change-transform flex flex-col`}
                      >
                        {DIGIT_CYCLE.map((num, idx) => (
                          <div
                            key={idx}
                            className="w-full h-12 sm:h-14 md:h-15 flex items-center justify-center font-condensed font-bold tabular-nums text-2xl sm:text-3xl md:text-4xl text-white"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Botão principal + link do Instagram na mesma linha */}
            <div
              ref={ctaGroupRef}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 pt-2 opacity-0"
            >
              {/* Botão principal com hover deslizando seta para direita */}
              <button
                type="button"
                onClick={scrollToQuemE}
                className="inline-flex items-center justify-center gap-2.5 bg-wd-orange hover:bg-[#d8580f] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-[0.25rem] font-sans font-semibold text-sm sm:text-base tracking-wide transition-colors duration-200 group active:scale-[0.98] shadow-lg cursor-pointer"
              >
                <span>Conheça o Geovane</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>

              {/* Link secundário discreto para o Instagram */}
              <a
                href="https://www.instagram.com/gamba_geovane"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm text-white/70 hover:text-white transition-colors duration-200 tracking-wide py-2"
              >
                <span>Seguir @gamba_geovane</span>
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>

        </div>

        {/* Rodapé: Contraste mínimo AA e indicação obrigatória de IA */}
        <footer
          ref={footerRef}
          className="w-full flex items-center justify-center md:justify-start pt-4 border-t border-white/10 opacity-0 pointer-events-auto transition-opacity"
        >
          <p className="font-sans text-xs sm:text-sm text-white/70 tracking-wide">
            Conteúdo produzido com auxílio de inteligência artificial.
          </p>
        </footer>

      </div>

      {/* Floating Scroll Indicator (Visible ONLY at scroll = 0, fades out immediately on scroll) */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 text-white/70 transition-all duration-300"
      >
        <span className="font-sans text-xs uppercase tracking-widest text-white/60">
          Role para ver a transformação
        </span>
        <svg
          className="w-4 h-4 text-wd-orange animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

    </div>
  )
}

export default Hero
