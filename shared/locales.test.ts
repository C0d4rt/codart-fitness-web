import { parse, TYPE, type MessageFormatElement } from '@formatjs/icu-messageformat-parser'
import { describe, expect, it } from 'vitest'

import enUS from '../i18n/locales/en-US.json' with { type: 'json' }
import ptBR from '../i18n/locales/pt-BR.json' with { type: 'json' }

const leaves = (value: unknown, path = ''): [string, unknown][] =>
  value !== null && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key))
    : [[path, value]]

const keys = (messages: unknown) => leaves(messages).map(([key]) => key)

const argumentsOf = (elements: MessageFormatElement[]): string[] =>
  elements.flatMap((element) => [
    ...('value' in element && element.type !== TYPE.literal ? [element.value] : []),
    ...('options' in element
      ? Object.values(element.options).flatMap((option) => argumentsOf(option.value))
      : []),
    ...('children' in element ? argumentsOf(element.children) : []),
  ])

const parseErrors = (messages: unknown) =>
  leaves(messages).flatMap(([key, value]) => {
    try {
      parse(String(value))
      return []
    } catch (error) {
      return [[key, (error as Error).message]]
    }
  })

describe.each([
  ['pt-BR', ptBR],
  ['en-US', enUS],
])('the %s locale', (_, messages) => {
  it('has no empty text', () => {
    const empty = leaves(messages).filter(
      ([, value]) => typeof value !== 'string' || value.trim() === '',
    )
    expect(empty).toEqual([])
  })

  it('has no em or en dash', () => {
    const dashed = leaves(messages).filter(([, value]) => /[–—]/.test(String(value)))
    expect(dashed).toEqual([])
  })

  it('has exactly the keys of pt-BR', () => {
    expect(keys(messages)).toEqual(keys(ptBR))
  })

  it('writes every message in ICU MessageFormat', () => {
    expect(parseErrors(messages)).toEqual([])
  })

  it('fills the same arguments as pt-BR', () => {
    const holes = (messages: unknown) =>
      leaves(messages).map(([key, value]) => [
        key,
        [...new Set(argumentsOf(parse(String(value))))].sort(),
      ])
    expect(holes(messages)).toEqual(holes(ptBR))
  })
})
