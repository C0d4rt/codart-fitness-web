const escape = (text: string): string =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

/** WhatsApp's own marks, `*bold*` and `_italic_`, as safe HTML; everything else is escaped first. */
export const formatChat = (text: string): string =>
  escape(text)
    .replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_\n]+)_(?=$|[\s).,!?])/gm, '$1<em>$2</em>')
    .replaceAll('\n', '<br>')
