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
    legenda: "Convenção do Podemos: oficialização da candidatura a Deputado Estadual",
    src: "/campanha/agora-oficial.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 2,
    legenda: "O Nortão precisa ser ouvido: Geovane Gamba em Alta Floresta",
    src: "/campanha/nortao.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 3,
    legenda: "União e trabalho: ao lado do prefeito Chico Gamba em Alta Floresta",
    src: "/campanha/coloquei.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 4,
    legenda: "Nossa Terra, Nosso Orgulho: Alta Floresta e o Nortão de Mato Grosso",
    src: "/campanha/aereo.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
  {
    id: 5,
    legenda: "Geovane Gamba 20444: A força do produtor rural e do Nortão na ALMT",
    src: "/campanha/dia-dos-pais.webp",
    link: "https://www.instagram.com/gamba_geovane",
  },
]

export const Campanha: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [mobileIndex, setMobileIndex] = useState(1)
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 1024 : false)

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener("resize", checkViewport)
    return () => window.removeEventListener("resize", checkViewport)
  }, [])

  const handleMobileScroll = () => {
    const el = mobileCarouselRef.current
    if (!el) return
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 20 : 300
    const scrollPos = el.scrollLeft
    const newIdx = Math.min(
      CAMPANHA_DATA.length,
      Math.max(1, Math.round(scrollPos / cardWidth) + 1)
    )
    setMobileIndex(newIdx)
  }

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track || isMobile) return

    let ctx: gsap.Context | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          ctx = gsap.context(() => {
            const totalCards = CAMPANHA_DATA.length
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
        }
      },
      { rootMargin: "400px" }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      ctx?.revert()
    }
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
        /* MOBILE VIEW (NATIVE TOUCH CAROUSEL WITH DYNAMIC TRACKING & DOTS) */
        <div className="w-full px-5 sm:px-8 py-14 flex flex-col gap-6">
          {/* Header with Title + Counter */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-wd-orange font-semibold">
                Nos últimos dias
              </span>
              <h2 className="font-condensed font-bold uppercase text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                Registros da campanha pelo Nortão
              </h2>
            </div>

            {/* Dynamic counter "01 / 05" on mobile */}
            <div className="font-condensed font-bold text-sm tracking-widest text-wd-orange tabular-nums px-2.5 py-1 rounded-[0.25rem] bg-white/5 border border-white/10 shrink-0">
              0{mobileIndex} / 0{CAMPANHA_DATA.length}
            </div>
          </div>

          {/* Native touch carousel showing slice of next card */}
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileScroll}
            className="w-full flex gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 -mx-5 px-5 sm:-mx-8 sm:px-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {CAMPANHA_DATA.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-[78vw] max-w-[320px] snap-center flex flex-col gap-2.5 group cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] rounded-[0.25rem] overflow-hidden border border-white/15 bg-black/40 shadow-xl">
                  <img
                    src={item.src}
                    alt={item.legenda}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover transition-transform duration-300 group-active:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Subtle Instagram badge on image */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white/80 font-sans tracking-wide">
                    <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </div>
                </div>
                <p className="font-sans text-xs sm:text-sm text-white/90 leading-snug line-clamp-2">
                  {item.legenda}
                </p>
              </a>
            ))}
          </div>

          {/* Pagination Indicators & Instagram CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Dynamic dots indicator */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {CAMPANHA_DATA.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    mobileIndex === i + 1
                      ? "w-6 bg-wd-orange shadow-[0_0_6px_rgba(242,111,34,0.6)]"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            <a
              href="https://www.instagram.com/gamba_geovane"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-wider text-wd-orange hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Ver mais no Instagram</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Regional cities footer tag */}
          <div className="pt-3 border-t border-white/5 text-[11px] text-white/40 font-sans uppercase tracking-widest text-center">
            Alta Floresta · Sinop · Sorriso · Colíder · Guarantã
          </div>
        </div>
      )}
    </section>
  )
}

export default Campanha
