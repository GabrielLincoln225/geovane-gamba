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

  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 1024 : false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const stemPath = stemPathRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      if (!isMobile && stemPath) {
        // Calculate exact length of the vertical stem line
        const totalStemLength = stemPath.getTotalLength()
        gsap.set(stemPath, {
          strokeDasharray: totalStemLength,
          strokeDashoffset: totalStemLength,
        })

        // Setup handcrafted SVG icons with stroke-dash for line drawing
        const iconPaths = [
          document.querySelectorAll(".pilar-card-icon-0"),
          document.querySelectorAll(".pilar-card-icon-1"),
          document.querySelectorAll(".pilar-card-icon-2"),
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

        // Pacing configuration:
        // Pinned for 360vh so each stage has ~100vh of comfortable, stable reading time.
        // Scrub of 0.6 ensures a smooth, buttery connection to the user's scroll without flying by.
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=360vh",
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })

        // Initial setup: Stage 1 (Semente) is active
        gsap.set(stemPath, { strokeDashoffset: totalStemLength * 0.95 })
        gsap.set(".pilar-card-stage-0", { opacity: 1, y: 0, display: "flex" })
        gsap.set(".pilar-card-stage-1", { opacity: 0, y: 24, display: "none" })
        gsap.set(".pilar-card-stage-2", { opacity: 0, y: 24, display: "none" })

        // =============================================================
        // ZONE 1: SEMENTE IS HELD AT REST (0.00 to 0.28)
        // Ample scroll distance for the user to comfortably read Stage 1
        // =============================================================

        // =============================================================
        // TRANSITION 1: SEMENTE -> BROTO (0.28 to 0.40)
        // =============================================================
        // 1. Draw stem down from Node 1 to Node 2
        pinTl.to(
          stemPath,
          {
            strokeDashoffset: totalStemLength * 0.5,
            duration: 0.4,
            ease: "none",
          },
          0.28
        )

        // 2. Dim Node 1 on left, light up Node 2
        pinTl.to(
          ".stepper-item-0",
          { opacity: 0.25, duration: 0.3, ease: "power1.out" },
          0.28
        )
        pinTl.to(
          ".stepper-node-ring-0",
          { opacity: 0, scale: 0.9, duration: 0.25, ease: "power1.out" },
          0.28
        )

        pinTl.to(
          ".stepper-item-1",
          { opacity: 1, duration: 0.3, ease: "power1.out" },
          0.33
        )
        pinTl.fromTo(
          ".stepper-node-ring-1",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.25, duration: 0.3, ease: "power2.out" },
          0.33
        )

        // 3. Card transition: Stage 0 slides out, Stage 1 slides in
        pinTl.to(
          ".pilar-card-stage-0",
          {
            opacity: 0,
            y: -20,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              const el = document.querySelector(".pilar-card-stage-0") as HTMLElement
              if (el) el.style.display = "none"
            },
          },
          0.28
        )

        pinTl.set(
          ".pilar-card-stage-1",
          { display: "flex" },
          0.33
        )

        pinTl.fromTo(
          ".pilar-card-stage-1",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          0.34
        )

        // 4. Draw Broto SVG line icon
        iconPaths[1].forEach((p) => {
          pinTl.to(
            p,
            { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" },
            0.36
          )
        })

        // =============================================================
        // ZONE 2: BROTO IS HELD AT REST (0.40 to 0.68)
        // Ample scroll distance for reading "O Nortão precisa ser ouvido."
        // =============================================================

        // =============================================================
        // TRANSITION 2: BROTO -> ÁRVORE (0.68 to 0.80)
        // =============================================================
        // 1. Draw stem down from Node 2 to Node 3
        pinTl.to(
          stemPath,
          {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: "none",
          },
          0.68
        )

        // 2. Dim Node 2 on left, light up Node 3
        pinTl.to(
          ".stepper-item-1",
          { opacity: 0.25, duration: 0.3, ease: "power1.out" },
          0.68
        )
        pinTl.to(
          ".stepper-node-ring-1",
          { opacity: 0, scale: 0.9, duration: 0.25, ease: "power1.out" },
          0.68
        )

        pinTl.to(
          ".stepper-item-2",
          { opacity: 1, duration: 0.3, ease: "power1.out" },
          0.73
        )
        pinTl.fromTo(
          ".stepper-node-ring-2",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1.25, duration: 0.3, ease: "power2.out" },
          0.73
        )

        // 3. Card transition: Stage 1 slides out, Stage 2 slides in
        pinTl.to(
          ".pilar-card-stage-1",
          {
            opacity: 0,
            y: -20,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              const el = document.querySelector(".pilar-card-stage-1") as HTMLElement
              if (el) el.style.display = "none"
            },
          },
          0.68
        )

        pinTl.set(
          ".pilar-card-stage-2",
          { display: "flex" },
          0.73
        )

        pinTl.fromTo(
          ".pilar-card-stage-2",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          0.74
        )

        // 4. Draw Árvore SVG line icon
        iconPaths[2].forEach((p) => {
          pinTl.to(
            p,
            { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" },
            0.76
          )
        })

        // =============================================================
        // ZONE 3: ÁRVORE IS HELD AT REST (0.80 to 1.00)
        // Ample scroll distance for reading Stage 3 before unpinning
        // =============================================================
      }

      // =============================================================
      // MOBILE: NATURAL DOCUMENT FLOW (NO PINNING, ZERO GLITCH)
      // =============================================================
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
              scrub: 0.4,
            },
          })
        }

        gsap.utils.toArray<HTMLElement>(".mobile-pilar-card").forEach((item, idx) => {
          gsap.fromTo(
            item,
            { opacity: 0.2, y: 25 },
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
      className="relative z-20 w-full min-h-screen lg:h-screen bg-wd-dark-blue text-white border-t border-white/10 flex flex-col justify-between overflow-hidden pt-20 lg:pt-24 pb-8"
    >
      {/* =============================================================
          DESKTOP PINNED VIEW (~360vh scroll distance for calm pacing)
          ============================================================= */}
      {!isMobile ? (
        <div className="relative w-full h-full max-w-[1360px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-between py-4">
          
          {/* Section Header */}
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

          {/* Main Stage: Left Stem Journey (5 cols) + Right Focused Card (7 cols) */}
          <div className="grid grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-2">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN: Continuous Caule (Stem) with 3 Milestones
                ------------------------------------------------------------- */}
            <div className="col-span-5 flex items-center justify-start relative pl-2">
              <div className="relative w-full max-w-[340px] h-[340px] flex items-center">
                
                {/* SVG Stem line running through the 3 milestones */}
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
                  {/* Drawing stem synchronized with scroll */}
                  <path
                    ref={stemPathRef}
                    d="M 16 30 L 16 310"
                    stroke="#F26F22"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* 3 Milestones stacked vertically along the stem */}
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
                        {/* Center core dot */}
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
                RIGHT COLUMN: Premium Focused Card ("No card que a gente começa")
                ------------------------------------------------------------- */}
            <div className="col-span-7 relative">
              <div className="relative w-full bg-wd-deep-blue/80 backdrop-blur-xl border border-white/15 rounded-[0.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between">
                
                {/* Stage 1: SEMENTE */}
                <div className="pilar-card-stage-0 w-full flex-col justify-between will-change-[transform,opacity]">
                  <div>
                    {/* Top Row: Icon + Badge + Progress */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <path
                              className="pilar-card-icon-0"
                              d="M 24 8 C 16 16 13 26 13 33 C 13 40 18 44 24 44 C 30 44 35 40 35 33 C 35 26 32 16 24 8 Z"
                              stroke="#F26F22"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="pilar-card-icon-0"
                              d="M 24 20 L 24 38 M 24 28 C 28 26 30 22 30 22"
                              stroke="#F26F22"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                          Estágio: Semente
                        </span>
                      </div>
                      <span className="font-condensed font-bold text-sm tracking-widest text-white/50 tabular-nums">
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

                  {/* Segmented Progress Bar */}
                  <div className="w-full pt-8">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="h-1.5 rounded-full bg-wd-orange transition-all duration-300 shadow-[0_0_8px_rgba(242,111,34,0.5)]" />
                      <div className="h-1.5 rounded-full bg-white/10" />
                      <div className="h-1.5 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Stage 2: BROTO */}
                <div className="pilar-card-stage-1 w-full flex-col justify-between will-change-[transform,opacity]" style={{ display: "none" }}>
                  <div>
                    {/* Top Row: Icon + Badge + Progress */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <path
                              className="pilar-card-icon-1"
                              d="M 24 44 L 24 16 C 24 12 18 10 12 12 C 10 18 14 24 24 24 C 34 24 38 18 36 12 C 30 10 24 12 24 16"
                              stroke="#F26F22"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="pilar-card-icon-1"
                              d="M 18 16 C 21 13 24 13 24 13 C 24 13 27 13 30 16"
                              stroke="#F26F22"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                          Estágio: Broto
                        </span>
                      </div>
                      <span className="font-condensed font-bold text-sm tracking-widest text-white/50 tabular-nums">
                        02 / 03
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mt-6 mb-2">
                      Representação de verdade
                    </h3>

                    {/* Prominent Display Highlight */}
                    <p className="font-condensed font-black uppercase text-2xl sm:text-3xl lg:text-4xl text-wd-orange tracking-tight leading-tight my-3 [text-wrap:balance]">
                      “O Nortão precisa ser ouvido.”
                    </p>

                    {/* Narrative Text */}
                    <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                      Presença e escuta em Alta Floresta e em toda a região, não só em período de eleição.
                    </p>
                  </div>

                  {/* Segmented Progress Bar */}
                  <div className="w-full pt-8">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="h-1.5 rounded-full bg-wd-orange/50" />
                      <div className="h-1.5 rounded-full bg-wd-orange transition-all duration-300 shadow-[0_0_8px_rgba(242,111,34,0.5)]" />
                      <div className="h-1.5 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Stage 3: ÁRVORE */}
                <div className="pilar-card-stage-2 w-full flex-col justify-between will-change-[transform,opacity]" style={{ display: "none" }}>
                  <div>
                    {/* Top Row: Icon + Badge + Progress */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <path
                              className="pilar-card-icon-2"
                              d="M 24 44 L 24 24 M 24 32 L 18 24 M 24 28 L 30 20"
                              stroke="#F26F22"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                            />
                            <path
                              className="pilar-card-icon-2"
                              d="M 24 24 C 15 24 11 16 16 10 C 21 4 25 8 24 12 C 26 6 34 6 36 12 C 41 14 39 24 24 24 Z"
                              stroke="#F26F22"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="pilar-card-icon-2"
                              d="M 19 44 C 22 41 24 41 24 44 C 24 41 26 41 29 44"
                              stroke="#F26F22"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                          Estágio: Árvore
                        </span>
                      </div>
                      <span className="font-condensed font-bold text-sm tracking-widest text-white/50 tabular-nums">
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

                  {/* Segmented Progress Bar */}
                  <div className="w-full pt-8">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="h-1.5 rounded-full bg-wd-orange/50" />
                      <div className="h-1.5 rounded-full bg-wd-orange/50" />
                      <div className="h-1.5 rounded-full bg-wd-orange transition-all duration-300 shadow-[0_0_8px_rgba(242,111,34,0.5)]" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Bar Indicator */}
          <div className="w-full flex justify-between items-center text-xs text-white/40 font-sans uppercase tracking-widest pt-3 border-t border-white/5 shrink-0">
            <span>Pilares de Mandato</span>
            <span>Mato Grosso 2026</span>
          </div>

        </div>
      ) : (
        /* =============================================================
           MOBILE VIEW (STACKED CARDS WITHOUT PIN)
           ============================================================= */
        <div className="w-full px-6 py-12 flex flex-col gap-10">
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
          <div className="relative pl-8 flex flex-col gap-8">
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
                className="mobile-pilar-card relative flex flex-col gap-3 bg-wd-deep-blue/80 backdrop-blur-md border border-white/15 rounded-[0.5rem] p-6 shadow-xl"
              >
                {/* Node circle on stem */}
                <div className="absolute -left-[2.35rem] top-8 w-3.5 h-3.5 rounded-full bg-wd-orange border-2 border-wd-dark-blue shadow-[0_0_8px_rgba(242,111,34,0.6)]" />

                {/* Handcrafted Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10">
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
                  <span className="font-condensed font-bold text-xs tracking-widest text-white/40 tabular-nums">
                    0{index + 1} / 03
                  </span>
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
