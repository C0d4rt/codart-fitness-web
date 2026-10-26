export type ChatAttachment =
  | { kind: 'audio'; seconds: number }
  | { kind: 'photo'; label: string; src?: string }
  | { kind: 'file'; name: string }

/** One WhatsApp message, written the way the diary really sends it (`*bold*`, `_italic_`). */
export type ChatMessage = {
  from: 'you' | 'bot'
  text?: string
  attachment?: ChatAttachment
  /** A reply or link button under the message, as WhatsApp draws it. */
  button?: string
  time: string
}

export type ChatScreen = {
  id: string
  /** What a screen reader hears instead of the whole conversation. */
  label: string
  messages: ChatMessage[]
}
