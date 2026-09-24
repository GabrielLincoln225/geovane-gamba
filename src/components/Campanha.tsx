import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface CampanhaItem {
  id: number
  legenda: string
  src: string
  link: string
}

const CAMPANHA_DATA: CampanhaItem[] = [
  {
    id: 1,
    legenda: "Agora é oficial: candidato a Deputado Estadual",
    src: "/campanha/agora-oficial.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 2,
    legenda: "O Nortão precisa ser ouvido",
    src: "/campanha/nortao.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 3,
    legenda: "Por que coloquei meu nome à disposição, com Chico Gamba",
    src: "/campanha/coloquei.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 4,
    legenda: "Propriedade rural no Nortão",
    src: "/campanha/aereo.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 5,
    legenda: "Homenagem de Dia dos Pais",
    src: "/campanha/dia-dos-pais.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
]

export const Campanha: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkViewport()
    window.addEventListener("resize", checkViewport)
    return () => window.removeEventListener("resize", checkViewport)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track || isMobile) return

    const ctx = gsap.context(() => {
      // Horizontal scrub timeline for desktop
      const totalCards = CAMPANHA_DATA.length
      // Calculate how far to translate the track
      // We want to translate track so all cards move past the viewport
      const scrollDistance = () => track.scrollWidth - window.innerWidth + 200

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update counter "01 / 05" through "05 / 05"
            const idx = Math.min(
              totalCards,
              Math.max(1, Math.floor(self.progress * totalCards) + 1)
            )
            setCurrentIndex(idx)
          },
        },
      })

      tl.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 120),
        ease: "none",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      id="campanha"
      className="relative z-20 w-full min-h-screen bg-wd-deep-blue text-white py-20 lg:py-0 border-t border-white/10 overflow-hidden"
    >
      {/* DESKTOP PINNED HORIZONTAL GALLERY */}
      {!isMobile ? (
        <div className="relative w-full h-screen flex flex-col justify-between py-12 px-6 md:px-12 lg:px-16 overflow-hidden">
          
          {/* Top Bar: Title + Link to Instagram + Discreet Counter */}
          <div className="w-full max-w-[1440px] mx-auto flex items-end justify-between pb-6 border-b border-white/10">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold block mb-1">
                Nos últimos dias
              </span>
              <h2 className="font-condensed font-bold uppercase text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                Registros da campanha pelo Nortão
              </h2>
            </div>

            <div className="flex items-center gap-8">
              {/* Instagram link */}
              <a
                href="https://www.instagram.com/gamba_geovane"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-1.5 transition-colors group"
              >
                <span>Ver mais no Instagram</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              {/* Dynamic counter "01 / 05" */}
              <div className="font-condensed font-bold text-lg tracking-widest text-wd-orange tabular-nums px-3 py-1 rounded-[0.25rem] bg-white/5 border border-white/10">
                0{currentIndex} / 0{CAMPANHA_DATA.length}
              </div>
            </div>
          </div>

          {/* Horizontal Sliding Track */}
          <div className="relative flex-1 flex items-center overflow-visible">
            <div
              ref={trackRef}
              className="flex items-center gap-8 pl-4 pr-32 will-change-transform"
            >
              {CAMPANHA_DATA.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 shrink-0 cursor-pointer"
                  style={{ width: "min(340px, 32vw)" }}
                >
                  {/* Photo frame 4:5 with subtle hover zoom */}
                  <div className="relative w-full aspect-[4/5] rounded-[0.25rem] overflow-hidden border border-white/15 bg-black/40 shadow-xl">
                    <img
                      src={item.src}
                      alt={item.legenda}
                      loading="lazy"
                      width={800}
                      height={1000}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    {/* Subtle gradient vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                  </div>

                  {/* Caption underneath */}
                  <p className="font-sans text-sm text-white/80 group-hover:text-white transition-colors leading-snug line-clamp-2 max-w-full">
                    {item.legenda}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Subtle bottom cue */}
          <div className="w-full max-w-[1440px] mx-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-sans uppercase tracking-widest">
            <span>Alta Floresta · Sinop · Sorriso · Colíder · Guarantã</span>
            <span>Deslize verticalmente para percorrer</span>
          </div>

        </div>
      ) : (
        /* MOBILE VIEW (NATIVE TOUCH CAROUSEL WITH SCROLL-SNAP) */
        <div className="w-full px-6 py-12 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
              Nos últimos dias
            </span>
            <h2 className="font-condensed font-bold uppercase text-3xl text-white tracking-tight">
              Registros da campanha pelo Nortão
            </h2>
            <a
              href="https://www.instagram.com/gamba_geovane"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-wider text-wd-orange hover:text-white flex items-center gap-1.5 transition-colors mt-1"
            >
              <span>Ver mais no Instagram</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Native touch carousel showing slice of next card */}
          <div className="w-full flex gap-5 overflow-x-auto pb-4 pt-2 -mx-6 px-6 snap-x snap-mandatory scroll-smooth no-scrollbar">
            {CAMPANHA_DATA.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-[78vw] max-w-[320px] snap-center flex flex-col gap-2.5"
              >
                <div className="relative w-full aspect-[4/5] rounded-[0.25rem] overflow-hidden border border-white/15 bg-black/40 shadow-lg">
                  <img
                    src={item.src}
                    alt={item.legenda}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-sans text-xs text-white/85 leading-snug">
                  {item.legenda}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Campanha
