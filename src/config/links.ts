/**
 * Biosite destinations configuration for ARLLON FERNANDES BARBEARIA.
 * Edit destination URLs here as needed.
 */
export const biositeLinks = {
  cortes: "https://arlloncortes.vercel.app",
  extras: "https://arllonbarbeariabebidas.vercel.app",
  produtos: "https://arlloncatalogo.vercel.app",
} as const;

export type BiositeKey = keyof typeof biositeLinks;
