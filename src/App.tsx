import React, { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { QuemE } from "@/components/QuemE"
import { Pilares } from "@/components/Pilares"
import { Campanha } from "@/components/Campanha"
import { Vote } from "@/components/Vote"
import { Footer } from "@/components/Footer"
import { MobileBar } from "@/components/MobileBar"

gsap.registerPlugin(ScrollTrigger)

export const App: React.FC = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let lenis: Lenis | undefined

    const timer = setTimeout(() => {
      if (!prefersReduced) {
        lenis = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        })

        // Seamless integration between Lenis & ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update)

        const updateTicker = (time: number) => {
          lenis?.raf(time * 1000)
        }

        gsap.ticker.add(updateTicker)
        gsap.ticker.lagSmoothing(0)
      }
    }, 120)

    // ScrollTrigger.refresh() once all images and fonts have loaded
    const handleLoad = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    window.addEventListener("load", handleLoad)
    document.fonts?.ready?.then(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => {
      clearTimeout(timer)
      window.removeEventListener("load", handleLoad)
      if (lenis) {
        lenis.destroy()
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-wd-deep-blue text-white selection:bg-wd-orange selection:text-white">
      {/* 1. Fixed Header (appears after hero unpins) */}
      <Header />

      {/* 
        Hero Section:
        Hero is 100% complete and preserved untouched.
        Wrapped in #hero-section so Header & MobileBar track unpinning cleanly.
      */}
      <div id="hero-section">
        <Hero />
      </div>

      {/* 2. Quem É */}
      <QuemE />

      {/* 3. Pilares */}
      <Pilares />

      {/* 4. Campanha */}
      <Campanha />

      {/* 5. Fechamento (Vote) */}
      <Vote />

      {/* 6. Rodapé */}
      <Footer />

      {/* 7. Barra Fixa Mobile */}
      <MobileBar />
    </div>
  )
}

export default App
