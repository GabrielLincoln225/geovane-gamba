import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export const SITE_URL = "https://geovanegamba.com.br"
export const WHATSAPP_SHARE_URL = `https://wa.me/?text=${encodeURIComponent(
  `Geovane Gamba, Deputado Estadual 20444. A força jovem do Nortão. Conheça: ${SITE_URL}`
)}`

const NAV_LINKS = [
  { label: "Quem é", href: "#quem-e" },
  { label: "Pilares", href: "#pilares" },
  { label: "Campanha", href: "#campanha" },
]

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Show header ONLY after the hero unpins (hero pin length is 450vh desktop, 320vh mobile)
    // The hero container triggers this scroll position
    const heroEl = document.querySelector("#hero-section") || document.body.firstElementChild

    const showAnim = gsap.fromTo(
      header,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
        paused: true,
      }
    )

    ScrollTrigger.create({
      trigger: heroEl,
      start: "bottom top",
      onEnter: () => showAnim.play(),
      onLeaveBack: () => showAnim.reverse(),
    })

    // Track active section for animated nav underline
    NAV_LINKS.forEach(({ href }) => {
      const section = document.querySelector(href)
      if (section) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 30%",
          end: "bottom 30%",
          onEnter: () => setActiveSection(href),
          onEnterBack: () => setActiveSection(href),
        })
      }
    })

    return () => {
      showAnim.kill()
    }
  }, [])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleShare = () => {
    window.open(WHATSAPP_SHARE_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 w-full bg-wd-deep-blue/85 backdrop-blur-md border-b border-white/10 transition-colors pointer-events-auto"
        style={{ transform: "translateY(-100%)", opacity: 0 }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Left: Nome + Número */}
          <a
            href="#hero-section"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <span className="font-condensed font-black text-xl sm:text-2xl uppercase tracking-tight text-white group-hover:text-white/90 transition-colors">
              GEOVANE GAMBA
            </span>
            <span className="font-condensed font-bold text-xl sm:text-2xl text-wd-orange">
              20444
            </span>
          </a>

          {/* Center (Desktop): Navigation links with active indicator */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleScrollTo(e, href)}
                  className={`relative font-sans text-sm font-medium tracking-wide transition-colors py-1 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {label}
                  {/* Animated underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-wd-orange transition-all duration-300 ease-out ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </a>
              )
            })}
          </nav>

          {/* Right (Desktop): Botão Compartilhar */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-wd-orange hover:bg-[#d8580f] text-white px-5 py-2.5 rounded-[0.25rem] font-sans font-semibold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer shadow-md active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31" />
              </svg>
              <span>Compartilhar</span>
            </button>
          </div>

          {/* Right (Mobile): Botão Hamburguer */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sheet Panel */}
          <div className="relative w-4/5 max-w-xs h-full bg-wd-deep-blue border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div>
              {/* Header inside sheet */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-condensed font-black text-xl uppercase tracking-tight text-white">
                    GEOVANE GAMBA
                  </span>
                  <span className="font-condensed font-bold text-xl text-wd-orange">
                    20444
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1 text-white/70 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-5 pt-8">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleScrollTo(e, href)}
                    className="font-sans text-lg font-medium text-white/80 hover:text-wd-orange transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Bottom action inside sheet */}
            <div className="pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleShare()
                }}
                className="w-full flex items-center justify-center gap-2 bg-wd-orange text-white py-3 rounded-[0.25rem] font-sans font-semibold text-sm uppercase tracking-wider shadow-lg active:scale-98"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31" />
                </svg>
                <span>Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
