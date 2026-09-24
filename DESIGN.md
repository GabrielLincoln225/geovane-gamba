---
name: Geovane Gamba Campaign
description: Official campaign website for State Deputy
colors:
  primary: "#F26F22"
  secondary: "#16A3A3"
  neutral-bg: "#020F1F"
typography:
  display:
    fontFamily: "'Cardinal Classic Long', ui-serif, Georgia, serif"
    fontWeight: 500
  body:
    fontFamily: "'Inter Tight', ui-sans-serif, system-ui, sans-serif"
  label:
    fontFamily: "'Oswald', 'Arial Narrow', sans-serif"
---

# Design System: Geovane Gamba Campaign

## Overview

**Creative North Star: "A Força do Nortão, com Cinematografia Premium"**

A identidade visual da campanha de Geovane Gamba transmite imponência, seriedade e dinamismo. Longe do estereótipo de "design genérico de IA", o projeto exige um acabamento cinematográfico, com tipografia forte, contrastes profundos e espaçamentos generosos, refletindo as raízes do candidato no agronegócio de Mato Grosso.

## Colors

O contraste entre as cores quentes da terra e a profundidade do azul escuro cria um impacto visual imediato.

### Primary
- **Laranja da Terra** (#F26F22): Usado para destacar botões de ação (CTAs), a numeração 20444 e detalhes de micro-interações. Representa a força do agronegócio e a energia da campanha.

### Secondary
- **Turquesa da Preservação** (#16A3A3): Usado para acentos secundários, bordas sutis ou categorias menores de informação. Representa as belezas naturais e o desenvolvimento sustentável.

### Neutral
- **Azul Noturno** (#020F1F): O fundo principal (background) do site inteiro. Dá peso, autoridade e permite que as fotos e vídeos se destaquem de forma cinematográfica.

## Typography

**Display Font:** Cardinal Classic Long (com fallback serif)
**Body Font:** Inter Tight (com fallback sans-serif)
**Label/Mono Font:** Oswald (com fallback sans-serif)

**Character:** A tipografia combina a sofisticação e tradição da Cardinal Classic Long (serifa) para os títulos imponentes, a legibilidade técnica da Inter Tight para textos de apoio, e a urgência industrial da Oswald para as numerações da campanha.

### Hierarchy
- **Display** (700, clamp(2.5rem, 7vw, 4.5rem), 0.95): Títulos principais, o nome do candidato e o slogan. Deve sempre aparecer em letras maiúsculas (uppercase).
- **Headline** (500, 2rem, 1.1): Subtítulos descritivos ou citações. Frequentemente usado em itálico.
- **Body** (400, 1rem, 1.5): Textos de parágrafos normais. A cor do texto não é branco puro, mas um `white/80` para reduzir o contraste excessivo no fundo escuro.
- **Label** (700, 0.875rem, tracking-widest, uppercase): Rótulos de partidos, tags pequenas de seção e a numeração do candidato.

## Layout

O design foge de blocos contínuos e monótonos. A estrutura de página favorece layouts assimétricos ou de alinhamento lateral rígido (como no letreiro da Hero que ocupa apenas a metade esquerda da tela em desktop). O conteúdo deve ter "respiro" nas bordas da tela.

## Elevation & Depth

Não usamos "glassmorphism genérico de IA" (backdrop-filter pesado com bordas brancas grossas). O sistema é majoritariamente **Flat**.

**The Flat-By-Default Rule.** Superfícies são planas. A profundidade é dada através de escurecimento direcional (gradientes escuros sobre imagens) ou pela própria coreografia de animações (parallax). Sombras são usadas com extrema discrição apenas em botões interativos ou para separação ótica sutil no texto (`drop-shadow-lg`).

## Shapes

As formas são decididamente retilíneas, com cantos levemente arredondados (`4px` ou `0.25rem`) em tags e botões para não parecer cortante. Evitar cards extremamente arredondados tipo "bolha".

## Do's and Don'ts

### Do:
- **Do** usar animações suaves vinculadas ao Scroll (GSAP ScrollTrigger) para revelar conteúdo.
- **Do** manter a numeração `20444` na fonte condensada (Roboto Condensed) e com espaçamento de letras ajustado (`tracking-wider`).

### Don't:
- **Don't** usar "glow" ou brilhos de neon (anti-padrão estabelecido).
- **Don't** disparar dezenas de animações simultâneas; a coreografia visual deve ter uma cadência clara e legível.
