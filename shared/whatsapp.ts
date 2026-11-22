/**
 * `wa.me` takes the number as digits only, with the country code and no plus sign. Nuxt reads an
 * all-digit env value as a number, so the number may arrive as one. Without a text, the chat opens
 * empty.
 */
export const whatsAppLink = (number: string | number, text: string): string => {
  const digits = String(number).replace(/\D/g, '')
  const query = text === '' ? '' : `?text=${encodeURIComponent(text)}`
  return `https://wa.me/${digits}${query}`
}
