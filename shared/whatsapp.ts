/** `wa.me` takes the number as digits only, with the country code and no plus sign. */
export const whatsAppLink = (number: string, text: string): string => {
  const digits = number.replace(/\D/g, '')
  const query = `text=${encodeURIComponent(text)}`
  return digits === '' ? `https://wa.me/?${query}` : `https://wa.me/${digits}?${query}`
}
