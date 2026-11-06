import { Fraunces, Manrope } from 'next/font/google'

/**
 * Homepage redesign fonts — next/font inhein build ke waqt download kar ke
 * apni site se serve karta hai (Google Fonts ki request nahi jati, speed behtar).
 * CSS mein: var(--font-display) headings ke liye, var(--font-body) text ke liye.
 */
export const fontDisplay = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const fontBody = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable}`