import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { WHATSAPP_SHARE_URL } from "./Vote"

gsap.registerPlugin(ScrollTrigger)

export const MobileBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null)
  const [canShow, setCanShow] = useState(false)
  const [isInVoteSection, setIsInVoteSection] = useState(false)
  const lastScrollY = useRef(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 1. Detect when hero unpins
    const heroEl = document.querySelector("#hero-section") || document.body.firstElementChild

    const heroTrigger = ScrollTrigger.create({
      trigger: heroEl,
      start: "bottom top",
      onEnter: () => setCanShow(true),
      onLeaveBack: () => {
        setCanShow(false)
        setIsVisible(false)
      },
    })

    // 2. Detect when #vote section is entered to hide mobile bar
    const voteEl = document.querySelector("#vote")
    let voteTrigger: ScrollTrigger | undefined
    if (voteEl) {
      voteTrigger = ScrollTrigger.create({
        trigger: voteEl,
        start: "top 80%",
        onEnter: () => setIsInVoteSection(true),
        onLeaveBack: () => setIsInVoteSection(false),
      })
    }

    return () => {
      heroTrigger.kill()
      if (voteTrigger) voteTrigger.kill()
    }
  }, [])

  // 3. Scroll direction listener: hide on scroll down, show on scroll up
  useEffect(() => {
    if (!canShow || isInVoteSection) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 100) {
        setIsVisible(false)
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling down -> hide
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> show
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [canShow, isInVoteSection])

  // Animate slide up / down with GSAP
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    if (isVisible && canShow && !isInVoteSection) {
      gsap.to(bar, {
        yPercent: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      })
    } else {
      gsap.to(bar, {
        yPercent: 120,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      })
    }
  }, [isVisible, canShow, isInVoteSection])

  const handleShare = () => {
    window.open(WHATSAPP_SHARE_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <aside
      ref={barRef}
      role="complementary"
      aria-label="Barra de ação rápida"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-wd-deep-blue/95 backdrop-blur-md border-t border-white/10 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl transition-shadow"
      style={{ transform: "translateY(120%)", opacity: 0 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Vote 20444 */}
        <div className="flex items-center gap-2">
          <span className="font-condensed font-bold uppercase text-base text-white/90 tracking-tight">
            Vote
          </span>
          <span className="font-condensed font-black text-2xl text-wd-orange tracking-tight">
            20444
          </span>
        </div>

        {/* Right: Botão Compartilhar */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-wd-orange hover:bg-[#d8580f] active:bg-[#c44e0c] text-white px-5 py-2.5 rounded-[0.25rem] font-sans font-semibold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer shadow-md active:scale-95 min-h-[42px]"
        >
          <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31" />
          </svg>
          <span>Compartilhar</span>
        </button>
      </div>
    </aside>
  )
}

export default MobileBar
