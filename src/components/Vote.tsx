import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import QRCode from "qrcode"

gsap.registerPlugin(ScrollTrigger)

export const SITE_URL = "https://geovane-gamba.vercel.app"
export const WHATSAPP_SHARE_URL = `https://wa.me/?text=${encodeURIComponent(
  `Geovane Gamba, Deputado Estadual 20444. A força jovem do Nortão. Conheça: ${SITE_URL}`
)}`

const URNA_DIGITS = [2, 0, 4, 4, 4]
const DIGIT_CYCLE = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
]
const TARGET_INDICES = [12, 10, 14, 14, 14]

export const Vote: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const phraseRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<HTMLDivElement>(null)

  // Countdown computation: Target 04/10/2026 America/Cuiaba (UTC-4)
  const [countdown, setCountdown] = useState<{ label?: string; text: string } | null>(null)

  useEffect(() => {
    const computeCountdown = () => {
      // 04/10/2026 00:00:00 in America/Cuiaba timezone (UTC-4)
      const electionStart = new Date("2026-10-04T00:00:00-04:00").getTime()
      const electionEnd = new Date("2026-10-04T23:59:59-04:00").getTime()
      const now = Date.now()

      if (now > electionEnd) {
        setCountdown(null)
        return
      }

      if (now >= electionStart && now <= electionEnd) {
        setCountdown({ text: "É hoje. Vote 20444." })
        return
      }

      const msPerDay = 1000 * 60 * 60 * 24
      const days = Math.ceil((electionStart - now) / msPerDay)
      setCountdown({
        label: "Faltam",
        text: `${days} dias`,
      })
    }

    computeCountdown()
    const timer = setInterval(computeCountdown, 60000)
    return () => clearInterval(timer)
  }, [])

  // GSAP Single Orchestrated Timeline on Entry + QRCode deferred
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let ctx: gsap.Context | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()

          // Generate QR Code via library (desktop only)
          if (qrCanvasRef.current) {
            QRCode.toCanvas(
              qrCanvasRef.current,
              "https://www.instagram.com/gamba_geovane",
              {
                width: 90,
                margin: 1,
                color: {
                  dark: "#0e1118",
                  light: "#ffffff",
                },
              },
              (error) => {
                if (error) console.error("QR Code Error:", error)
              }
            )
          }

          ctx = gsap.context(() => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                once: true,
              },
            })

            // 1. Title masked lines
            tl.fromTo(
              ".vote-title-line",
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
              },
              0
            )

            // 2. Phrase: "Bora plantar o futuro"
            if (phraseRef.current) {
              tl.fromTo(
                phraseRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                0.3
              )
            }

            // 3. Urna Slots appear
            tl.fromTo(
              ".vote-urna-slot",
              { opacity: 0, scale: 0.92, y: 15 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.05,
                ease: "power2.out",
              },
              0.4
            )

            // 4. Urna Odometer cascading roll (same logic as Hero, enlarged)
            TARGET_INDICES.forEach((targetIndex, i) => {
              tl.fromTo(
                `.vote-odometer-strip-${i}`,
                { yPercent: 0 },
                {
                  yPercent: -(targetIndex * 5),
                  duration: 1.0,
                  ease: "power3.out",
                },
                0.5 + i * 0.1
              )
            })

            // 5. Description text
            if (descRef.current) {
              tl.fromTo(
                descRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                1.0
              )
            }

            // 6. Buttons + Countdown (fade + slide por último)
            if (ctaRef.current) {
              tl.fromTo(
                ctaRef.current.children,
                { opacity: 0, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power2.out",
                },
                1.15
              )
            }

            if (countdownRef.current) {
              tl.fromTo(
                countdownRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                1.3
              )
            }
          }, sectionRef)
        }
      },
      { rootMargin: "400px" }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      ctx?.revert()
    }
  }, [])

  const handleShareWhatsApp = () => {
    window.open(WHATSAPP_SHARE_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <section
      ref={sectionRef}
      id="vote"
      className="relative z-20 w-full min-h-screen bg-wd-deep-blue text-white py-24 sm:py-32 px-6 md:px-12 lg:px-16 border-t border-white/10 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background with last video frame + heavy gradient overlay ("fechar o ciclo") */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <picture>
          <source srcSet="/hero/hero-final.webp" type="image/webp" />
          <img
            src="/hero/hero-final.jpg"
            alt="Nortão de Mato Grosso"
            loading="lazy"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
        </picture>
        {/* Deep contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-wd-deep-blue via-wd-deep-blue/90 to-wd-deep-blue" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-wd-deep-blue/80 to-wd-deep-blue" />
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">
        
        {/* Título: SplitText por linhas com máscara */}
        <h2
          aria-label="Vamos plantar esse futuro juntos."
          className="font-condensed font-bold uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]"
        >
          <span className="block overflow-hidden pb-1">
            <span className="vote-title-line inline-block">Vamos plantar esse</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="vote-title-line inline-block">futuro juntos.</span>
          </span>
        </h2>

        {/* Frase na cor de destaque */}
        <p
          ref={phraseRef}
          className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-wd-orange tracking-tight"
        >
          Bora plantar o futuro
        </p>

        {/* Urna GRANDE (Reusando exatamente o componente da hero, em tamanho maior) */}
        <div className="flex flex-col items-center mt-2" role="group" aria-label="Número 20444">
          <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-white/70 font-semibold mb-3">
            Na urna, digite
          </span>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4" aria-hidden="true">
            {URNA_DIGITS.map((_, i) => (
              <div
                key={i}
                className="vote-urna-slot relative w-13 sm:w-18 md:w-22 h-18 sm:h-24 md:h-28 rounded-[0.35rem] border-2 border-white/25 bg-black/60 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl opacity-0"
              >
                {/* Electronic visor inner vignette */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-[0.35rem] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-3px_6px_rgba(0,0,0,0.8)]" />

                {/* Vertical rolling strip */}
                <div
                  className={`vote-odometer-strip-${i} absolute top-0 left-0 w-full will-change-transform flex flex-col`}
                >
                  {DIGIT_CYCLE.map((num, idx) => (
                    <div
                      key={idx}
                      className="w-full h-18 sm:h-24 md:h-28 flex items-center justify-center font-condensed font-bold tabular-nums text-4xl sm:text-5xl md:text-6xl text-white"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Texto descritivo */}
        <p
          ref={descRef}
          className="font-sans text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mt-2"
        >
          Guarde o número e compartilhe com quem também acredita no Nortão.
        </p>

        {/* Botão principal + Botão secundário */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-2 w-full max-w-md"
        >
          {/* Botão principal: Compartilhar no WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-wd-orange hover:bg-[#d8580f] text-white px-8 py-4 rounded-[0.25rem] font-sans font-semibold text-base uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xl active:scale-[0.98] group"
          >
            <svg className="w-5 h-5 fill-currentColor shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31" />
            </svg>
            <span>Compartilhar no WhatsApp</span>
          </button>

          {/* Botão secundário: Seguir @gamba_geovane */}
          <a
            href="https://www.instagram.com/gamba_geovane"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-[0.25rem] font-sans font-semibold text-sm uppercase tracking-wider transition-colors duration-200"
          >
            <span>Seguir @gamba_geovane</span>
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Contagem regressiva */}
        {countdown && (
          <div
            ref={countdownRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[0.25rem] bg-white/5 border border-white/10 mt-4"
          >
            {countdown.label && (
              <span className="font-sans text-xs uppercase tracking-widest text-white/50 font-medium">
                {countdown.label}
              </span>
            )}
            <span className="font-condensed font-bold text-lg text-wd-orange tracking-wider">
              {countdown.text}
            </span>
          </div>
        )}

      </div>

      {/* QR Code (Desktop apenas, no canto) */}
      <div className="hidden lg:flex absolute bottom-12 right-12 flex-col items-center gap-2 p-3 bg-white/5 backdrop-blur-md rounded-[0.25rem] border border-white/10 shadow-xl">
        <canvas ref={qrCanvasRef} className="rounded-sm" />
        <span className="font-sans text-[11px] text-white/60 tracking-wide">
          Escaneie e siga a campanha
        </span>
      </div>
    </section>
  )
}

export default Vote
