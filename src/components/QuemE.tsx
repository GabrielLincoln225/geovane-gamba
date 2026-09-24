import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const QUOTE_WORDS = "“Sou filho dessa terra e quero representar o Nosso Nortão.”".split(" ")

const FICHA_ITEMS = [
  { label: "Origem", value: "Produtor rural do Nortão de MT" },
  { label: "Família", value: "Casado com Gabriela Indianara, pai da Isabella" },
  { label: "Partido", value: "Podemos (20)" },
  { label: "Candidatura", value: "Deputado Estadual · 20444" },
]

export const QuemE: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const fichaRef = useRef<HTMLDListElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let ctx: gsap.Context | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          ctx = gsap.context(() => {
      // 1. Image reveal with clip-path + parallax
      if (imageWrapperRef.current && imageRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          }
        )

        // Parallax: image moves ~10% slower than scroll
        gsap.to(imageRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
      }

      // 2. Title lines rising through masked overflow
      gsap.fromTo(
        ".quem-e-title-line",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
          },
        }
      )

      // 3. Label fade + slide
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          }
        )
      }

      // 4. Quote words: scrub opacity from 0.15 -> 1.0 word by word as user scrolls
      if (quoteRef.current) {
        gsap.fromTo(
          ".quote-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 80%",
              end: "bottom 55%",
              scrub: true,
            },
          }
        )
      }

      // 5. Paragraphs and Ficha: fade + slide with stagger
      if (bioRef.current) {
        gsap.fromTo(
          bioRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bioRef.current,
              start: "top 80%",
            },
          }
        )
      }

      if (fichaRef.current) {
        gsap.fromTo(
          ".ficha-item",
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: fichaRef.current,
              start: "top 85%",
            },
          }
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

  return (
    <section
      ref={sectionRef}
      id="quem-e"
      className="relative z-20 w-full min-h-screen bg-wd-deep-blue text-white py-16 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Vertical Photo (4:5 Ratio) with Clip-Path Reveal & Parallax */}
        <div className="lg:col-span-5 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
          <div
            ref={imageWrapperRef}
            className="relative w-full aspect-[4/5] rounded-[0.25rem] overflow-hidden border border-white/15 bg-black/30 shadow-2xl"
          >
            <img
              ref={imageRef}
              src="/site/quem-e.webp"
              alt="Geovane Gamba no campo em Alta Floresta"
              loading="lazy"
              width={960}
              height={1200}
              className="w-full h-full object-cover scale-105 will-change-transform"
            />
            {/* Subtle documentary location tag */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-white/90 font-sans tracking-wide border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-wd-orange" />
              <span>Alta Floresta · MT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative, Quote, Bio & Ficha Técnica */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 lg:gap-10">
          
          {/* Label */}
          <div ref={labelRef} className="flex items-center gap-2.5">
            <span className="h-1.5 w-6 bg-wd-orange rounded-full"></span>
            <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-wd-orange font-semibold">
              Quem é
            </span>
          </div>

          {/* Título: Máscara por linhas */}
          <h2 className="font-condensed font-bold uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            <span className="block overflow-hidden">
              <span className="quem-e-title-line inline-block">Raiz no campo,</span>
            </span>
            <span className="block overflow-hidden">
              <span className="quem-e-title-line inline-block">compromisso com o Nortão.</span>
            </span>
          </h2>

          {/* Citação em Destaque (Elemento Mais Forte: Display Grande + Aspas Grandes na cor de destaque) */}
          <div className="relative pl-4 sm:pl-8 border-l-2 border-wd-orange/50 my-1 sm:my-2">
            <blockquote
              ref={quoteRef}
              className="block font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-snug"
            >
              {QUOTE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="quote-word inline-block mr-1.5 sm:mr-2 text-white will-change-[opacity]"
                >
                  {word}
                </span>
              ))}
            </blockquote>
            <span className="block font-sans text-xs sm:text-base text-wd-orange font-medium mt-2.5 sm:mt-3">
              — Geovane Gamba
            </span>
          </div>

          {/* Parágrafos de Narrativa */}
          <div ref={bioRef} className="flex flex-col gap-4 font-sans text-base sm:text-lg text-white/75 leading-relaxed">
            <p>
              Geovane cresceu no campo e vive a rotina de quem produz no Nortão de Mato Grosso. A candidatura nasce daí: de dentro da região pra fora, não o contrário.
            </p>
            <p>
              Oficializado candidato a Deputado Estadual pelo Podemos, ele coloca o nome à disposição de quem vive, planta e constrói Alta Floresta e o Nortão todos os dias.
            </p>
          </div>

          {/* Ficha Técnica (dl com divisórias finas entre os itens, NÃO cards) */}
          <dl
            ref={fichaRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-6 border-t border-white/10"
          >
            {FICHA_ITEMS.map(({ label, value }) => (
              <div
                key={label}
                className="ficha-item flex flex-col gap-1 py-3 border-b border-white/5"
              >
                <dt className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
                  {label}
                </dt>
                <dd className="font-sans text-sm sm:text-base font-medium text-white/90">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

        </div>

      </div>
    </section>
  )
}

export default QuemE
