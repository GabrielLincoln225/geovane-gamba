import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface PilarItem {
  id: number
  estagio: string
  numero: string
  titulo: string
  destaque?: string
  texto: string
}

const PILARES_DATA: PilarItem[] = [
  {
    id: 1,
    estagio: "Semente",
    numero: "01",
    titulo: "Raiz no campo",
    texto:
      "Produtor rural que conhece de perto a rotina de quem produz no Nortão. É a base de tudo o que a candidatura defende.",
  },
  {
    id: 2,
    estagio: "Broto",
    numero: "02",
    titulo: "Representação de verdade",
    destaque: "O Nortão precisa ser ouvido.",
    texto:
      "Presença e escuta em Alta Floresta e em toda a região, não só em período de eleição.",
  },
  {
    id: 3,
    estagio: "Árvore",
    numero: "03",
    titulo: "Presença que guia",
    texto:
      "Valores de família e caráter como base pública. A mesma presença que guia em casa, levada para o mandato.",
  },
]

export const Pilares: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const stemPathRef = useRef<SVGPathElement>(null)
  const mobileStemRef = useRef<SVGPathElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const stemPath = stemPathRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      if (!isMobile && stemPath) {
        // Line total length
        const totalStemLength = stemPath.getTotalLength()
        gsap.set(stemPath, {
          strokeDasharray: totalStemLength,
          strokeDashoffset: totalStemLength,
        })

        // Prepare icon paths
        const iconPaths = [
          document.querySelectorAll(".card-icon-path-0"),
          document.querySelectorAll(".card-icon-path-1"),
          document.querySelectorAll(".card-icon-path-2"),
        ]

        iconPaths.forEach((paths, i) => {
          paths.forEach((p) => {
            const pathEl = p as SVGPathElement
            if (pathEl.getTotalLength) {
              const len = pathEl.getTotalLength()
              gsap.set(pathEl, {
                strokeDasharray: len,
                strokeDashoffset: i === 0 ? 0 : len,
              })
            }
          })
        })

        // Master orchestrated timeline for Desktop (~200vh pinned)
        // Using scrub: 0.3 for instant, snappy tracking that descends 1:1 with user scroll
        // No anticipatePin to eliminate any flicker/jump when pinning with Lenis
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200vh",
            pin: true,
            pinSpacing: true,
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        })

        // -------------------------------------------------------------
        // INITIAL STATE: STAGE 1 (SEMENTE) ACTIVE
        // -------------------------------------------------------------
        // Stem starts connected to Node 1 (offset at ~85% of total length)
        // From Node 1 (y=30) to Node 2 (y=170) is ~50%
        // From Node 2 (y=170) to Node 3 (y=310) is 100%
        gsap.set(stemPath, { strokeDashoffset: totalStemLength * 0.95 })

        // -------------------------------------------------------------
        // STEP 1 -> STEP 2: SEMENTE TO BROTO (t = 0.15 to 0.45)
        // -------------------------------------------------------------
        // 1. Draw stem down to Node 2
        pinTl.fromTo(
          stemPath,
          { strokeDashoffset: totalStemLength * 0.95 },
          { strokeDashoffset: totalStemLength * 0.5, duration: 1.0, ease: "none" },
          0.15
        )

        // 2. Dim Stage 1 on left, light up Stage 2
        pinTl.fromTo(
          ".stepper-item-0",
          { opacity: 1 },
          { opacity: 0.25, duration: 0.5, ease: "power1.out" },
          0.2
        )
        pinTl.fromTo(
          ".stepper-node-ring-0",
          { opacity: 1, scale: 1.3 },
          { opacity: 0, scale: 1, duration: 0.4, ease: "power1.out" },
          0.2
        )

        pinTl.fromTo(
          ".stepper-item-1",
          { opacity: 0.25 },
          { opacity: 1, duration: 0.5, ease: "power1.out" },
          0.35
        )
        pinTl.fromTo(
          ".stepper-node-ring-1",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.3, duration: 0.4, ease: "power2.out" },
          0.35
        )

        // 3. Card transition: Semente fades out, Broto fades in
        pinTl.fromTo(
          ".card-stage-0",
          { opacity: 1, y: 0 },
          { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
          0.15
        )
        pinTl.fromTo(
          ".card-stage-1",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.35
        )

        // 4. Draw Broto SVG icon
        iconPaths[1].forEach((p) => {
          pinTl.to(
            p,
            { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
            0.4
          )
        })

        // -------------------------------------------------------------
        // HOLD AT BROTO: "O Nortão precisa ser ouvido." (t = 0.45 to 0.65)
        // -------------------------------------------------------------

        // -------------------------------------------------------------
        // STEP 2 -> STEP 3: BROTO TO ÁRVORE (t = 0.65 to 0.95)
        // -------------------------------------------------------------
        // 1. Draw stem down to Node 3
        pinTl.to(
          stemPath,
          { strokeDashoffset: 0, duration: 1.0, ease: "none" },
          0.65
        )

        // 2. Dim Stage 2 on left, light up Stage 3
        pinTl.to(
          ".stepper-item-1",
          { opacity: 0.25, duration: 0.5, ease: "power1.out" },
          0.7
        )
        pinTl.to(
          ".stepper-node-ring-1",
          { opacity: 0, scale: 1, duration: 0.4, ease: "power1.out" },
          0.7
        )

        pinTl.to(
          ".stepper-item-2",
          { opacity: 1, duration: 0.5, ease: "power1.out" },
          0.85
        )
        pinTl.fromTo(
          ".stepper-node-ring-2",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.3, duration: 0.4, ease: "power2.out" },
          0.85
        )

        // 3. Card transition: Broto fades out, Árvore fades in
        pinTl.to(
          ".card-stage-1",
          { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
          0.65
        )
        pinTl.fromTo(
          ".card-stage-2",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.85
        )

        // 4. Draw Árvore SVG icon
        iconPaths[2].forEach((p) => {
          pinTl.to(
            p,
            { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
            0.9
          )
        })
      }

      // -------------------------------------------------------------
      // MOBILE: UNPINNED STACK WITH INDEPENDENT TRIGGERS
      // -------------------------------------------------------------
      if (isMobile) {
        if (mobileStemRef.current) {
          const mLen = mobileStemRef.current.getTotalLength()
          gsap.set(mobileStemRef.current, {
            strokeDasharray: mLen,
            strokeDashoffset: mLen,
          })
          gsap.to(mobileStemRef.current, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 85%",
              scrub: 0.3,
            },
          })
        }

        gsap.utils.toArray<HTMLElement>(".mobile-pilar-item").forEach((item, idx) => {
          gsap.fromTo(
            item,
            { opacity: 0.25, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "bottom 60%",
                toggleActions: "play reverse play reverse",
              },
            }
          )

          const iconPaths = item.querySelectorAll(`.mobile-icon-path-${idx}`)
          iconPaths.forEach((p) => {
            const pathEl = p as SVGPathElement
            if (pathEl.getTotalLength) {
              const len = pathEl.getTotalLength()
              gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len })
              gsap.to(pathEl, {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 75%",
                },
              })
            }
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      id="pilares"
      className="relative z-20 w-full min-h-screen lg:h-screen bg-wd-dark-blue text-white border-t border-white/10 flex flex-col justify-between overflow-hidden"
    >
      {/* =============================================================
          DESKTOP PINNED VIEW (~200vh scroll)
          ============================================================= */}
      {!isMobile ? (
        <div className="relative w-full h-full max-w-[1360px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-between py-10 lg:py-12">
          
          {/* Header */}
          <div className="w-full max-w-2xl shrink-0">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold block mb-1.5">
              O que sustenta a candidatura
            </span>
            <h2 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Da semente à colheita.
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/60 mt-1">
              Três estágios de um mesmo compromisso.
            </p>
          </div>

          {/* Main Stage Grid: Left Stem Stepper (5 cols) + Right Card (7 cols) */}
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-4">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN: Continuous Caule (Stem) with 3 Stage Milestones
                ------------------------------------------------------------- */}
            <div className="col-span-5 flex items-center justify-start relative pl-2">
              <div className="relative w-full max-w-[340px] h-[340px] flex items-center">
                
                {/* SVG Stem running through the 3 nodes */}
                <svg
                  className="absolute left-6 top-0 w-8 h-full overflow-visible pointer-events-none"
                  viewBox="0 0 32 340"
                  fill="none"
                >
                  {/* Background guide track */}
                  <path
                    d="M 16 30 L 16 310"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* Active drawing stem (DrawSVG scrub) */}
                  <path
                    ref={stemPathRef}
                    d="M 16 30 L 16 310"
                    stroke="#F26F22"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                {/* 3 Milestones stacked along the stem */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between py-2">
                  {PILARES_DATA.map((pilar, idx) => (
                    <div
                      key={pilar.id}
                      className={`stepper-item-${idx} flex items-center gap-5 transition-all duration-300 ${
                        idx === 0 ? "opacity-100" : "opacity-25"
                      }`}
                    >
                      {/* Node Circle with Pulse Ring */}
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        {/* Glow ring */}
                        <div
                          className={`stepper-node-ring-${idx} absolute inset-1 rounded-full border-2 border-wd-orange ${
                            idx === 0 ? "opacity-100 scale-125" : "opacity-0 scale-90"
                          } transition-all`}
                        />
                        {/* Center dot */}
                        <div className="w-3.5 h-3.5 rounded-full bg-wd-orange shadow-[0_0_12px_rgba(242,111,34,0.6)]" />
                      </div>

                      {/* Stage Label & Title */}
                      <div className="flex flex-col">
                        <span className="font-condensed font-bold text-xs tracking-widest text-wd-orange uppercase">
                          {pilar.numero} · {pilar.estagio}
                        </span>
                        <span className="font-condensed font-bold text-xl sm:text-2xl uppercase tracking-tight text-white">
                          {pilar.titulo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: Premium Interactive Card ("No card que a gente começa")
                ------------------------------------------------------------- */}
            <div className="col-span-7 relative">
              <div className="relative w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[0.25rem] p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
                
                {/* Stage 1: SEMENTE */}
                <div className="card-stage-0 absolute inset-0 p-8 sm:p-10 lg:p-12 flex flex-col justify-between opacity-100 will-change-[transform,opacity]">
                  <div>
                    {/* Top Row: Icon + Badge + Progress */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <path
                              className="card-icon-path-0"
                              d="M 24 8 C 16 16 13 26 13 33 C 13 40 18 44 24 44 C 30 44 35 40 35 33 C 35 26 32 16 24 8 Z"
                              stroke="#F26F22"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="card-icon-path-0"
                              d="M 24 20 L 24 38 M 24 28 C 28 26 30 22 30 22"
                              stroke="#F26F22"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                          Estágio: Semente
                        </span>
                      </div>
                      <span className="font-condensed font-bold text-sm tracking-widest text-white/40 tabular-nums">
                        01 / 03
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mt-6 mb-4">
                      Raiz no campo
                    </h3>

                    {/* Narrative Text */}
                    <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                      Produtor rural que conhece de perto a rotina de quem produz no Nortão. É a base de tudo o que a candidatura defende.
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="w-full pt-6">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-wd-orange rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Stage 2: BROTO */}
                <div className="card-stage-1 absolute inset-0 p-8 sm:p-10 lg:p-12 flex flex-col justify-between opacity-0 will-change-[transform,opacity] pointer-events-none">
                  <div>
                    {/* Top Row: Icon + Badge + Progress */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <path
                              className="card-icon-path-1"
                              d="M 24 44 L 24 16 C 24 12 18 10 12 12 C 10 18 14 24 24 24 C 34 24 38 18 36 12 C 30 10 24 12 24 16"
                              stroke="#F26F22"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="card-icon-path-1"
                              d="M 18 16 C 21 13 24 13 24 13 C 24 13 27 13 30 16"
                              stroke="#F26F22"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                          Estágio: Broto
                        </span>
                      </div>
                      <span className="font-condensed font-bold text-sm tracking-widest text-white/40 tabular-nums">
                        02 / 03
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mt-6 mb-2">
                      Representação de verdade
                    </h3>

                    {/* Prominent Display Highlight */}
                    <p className="font-condensed font-black uppercase text-2xl sm:text-3xl lg:text-4xl text-wd-orange tracking-tight leading-tight my-2 [text-wrap:balance]">
                      “O Nortão precisa ser ouvido.”
                    </p>

                    {/* Narrative Text */}
                    <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                      Presença e escuta em Alta Floresta e em toda a região, não só em período de eleição.
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="w-full pt-6">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-wd-orange rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Stage 3: ÁRVORE */}
                <div className="card-stage-2 absolute inset-0 p-8 sm:p-10 lg:p-12 flex flex-col justify-between opacity-0 will-change-[transform,opacity] pointer-events-none">
                  <div>
                    {/* Top Row: Icon + Badge + Progress */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <path
                              className="card-icon-path-2"
                              d="M 24 44 L 24 24 M 24 32 L 18 24 M 24 28 L 30 20"
                              stroke="#F26F22"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              className="card-icon-path-2"
                              d="M 24 24 C 15 24 11 16 16 10 C 21 4 25 8 24 12 C 26 6 34 6 36 12 C 41 14 39 24 24 24 Z"
                              stroke="#F26F22"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="card-icon-path-2"
                              d="M 19 44 C 22 41 24 41 24 44 C 24 41 26 41 29 44"
                              stroke="#F26F22"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                          Estágio: Árvore
                        </span>
                      </div>
                      <span className="font-condensed font-bold text-sm tracking-widest text-white/40 tabular-nums">
                        03 / 03
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mt-6 mb-4">
                      Presença que guia
                    </h3>

                    {/* Narrative Text */}
                    <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                      Valores de família e caráter como base pública. A mesma presença que guia em casa, levada para o mandato.
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="w-full pt-6">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-wd-orange rounded-full" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Bar Indicator */}
          <div className="w-full flex justify-between items-center text-xs text-white/40 font-sans uppercase tracking-widest pt-4 border-t border-white/5 shrink-0">
            <span>Pilares de Mandato</span>
            <span>Mato Grosso 2026</span>
          </div>

        </div>
      ) : (
        /* =============================================================
           MOBILE VIEW (STACKED WITHOUT PIN)
           ============================================================= */
        <div className="w-full px-6 py-16 flex flex-col gap-10">
          {/* Header */}
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold block mb-1.5">
              O que sustenta a candidatura
            </span>
            <h2 className="font-condensed font-bold uppercase text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Da semente à colheita.
            </h2>
            <p className="font-sans text-sm text-white/60 mt-1">
              Três estágios de um mesmo compromisso.
            </p>
          </div>

          {/* Stacked Pillars with Left Continuous Stem */}
          <div className="relative pl-8 flex flex-col gap-12">
            {/* Continuous SVG Stem */}
            <div className="absolute left-2.5 top-2 bottom-4 w-1">
              <svg className="w-4 h-full overflow-visible" preserveAspectRatio="none">
                <path
                  d="M 2 0 L 2 1000"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  ref={mobileStemRef}
                  d="M 2 0 L 2 1000"
                  stroke="#F26F22"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {PILARES_DATA.map((pilar, index) => (
              <div
                key={pilar.id}
                className="mobile-pilar-item relative flex flex-col gap-2 pt-2 bg-white/[0.02] border border-white/10 rounded-[0.25rem] p-6"
              >
                {/* Node circle */}
                <div className="absolute -left-[2.35rem] top-8 w-3.5 h-3.5 rounded-full bg-wd-orange border-2 border-wd-dark-blue shadow" />

                {/* Handcrafted Icon */}
                <div className="w-10 h-10 mb-1">
                  {index === 0 && (
                    <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none">
                      <path
                        className="mobile-icon-path-0"
                        d="M 24 8 C 16 16 13 26 13 33 C 13 40 18 44 24 44 C 30 44 35 40 35 33 C 35 26 32 16 24 8 Z"
                        stroke="#F26F22"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none">
                      <path
                        className="mobile-icon-path-1"
                        d="M 24 44 L 24 16 C 24 12 18 10 12 12 C 10 18 14 24 24 24 C 34 24 38 18 36 12 C 30 10 24 12 24 16"
                        stroke="#F26F22"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-9 h-9" viewBox="0 0 48 48" fill="none">
                      <path
                        className="mobile-icon-path-2"
                        d="M 24 44 L 24 24 M 24 32 L 18 24 M 24 28 L 30 20 M 24 24 C 15 24 11 16 16 10 C 21 4 25 8 24 12 C 26 6 34 6 36 12 C 41 14 39 24 24 24 Z"
                        stroke="#F26F22"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </div>

                <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                  Estágio: {pilar.estagio}
                </span>

                <h3 className="font-condensed font-bold uppercase text-2xl text-white tracking-tight leading-tight">
                  {pilar.titulo}
                </h3>

                {pilar.destaque && (
                  <p className="font-condensed font-bold uppercase text-xl text-wd-orange tracking-tight my-1">
                    “{pilar.destaque}”
                  </p>
                )}

                <p className="font-sans text-sm text-white/80 leading-relaxed">
                  {pilar.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Pilares
