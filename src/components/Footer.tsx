import React from "react"
import { WHATSAPP_SHARE_URL } from "./Vote"

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 w-full bg-wd-deep-blue text-white/70 py-12 px-6 md:px-12 lg:px-16 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        
        {/* Identificação Oficial de Campanha */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-condensed font-black text-xl uppercase tracking-tight text-white">
              GEOVANE GAMBA
            </span>
            <span className="text-white/40">—</span>
            <span className="font-condensed font-bold text-xl text-wd-orange">
              20444
            </span>
          </div>

          <p className="font-sans text-xs text-white/70 max-w-md leading-relaxed">
            Material de campanha · Podemos (20) · Candidato a Deputado Estadual · Mato Grosso
          </p>

          <p className="font-sans text-xs text-white/60">
            CNPJ da campanha: [CNPJ — confirmar com a campanha]
          </p>

          <p className="font-sans text-xs text-white/50">
            Conteúdo produzido com auxílio de inteligência artificial.
          </p>
        </div>

        {/* Links de Contato e Redes Sociais */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/gamba_geovane"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs uppercase tracking-wider text-white/70 hover:text-white transition-colors flex items-center gap-2 py-2"
          >
            <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href={WHATSAPP_SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs uppercase tracking-wider text-white/70 hover:text-white transition-colors flex items-center gap-2 py-2"
          >
            <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

      </div>
    </footer>
  )
}

export default Footer
