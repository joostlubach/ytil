import { escapeRegExp } from 'lodash'

import { isFunction } from './functions'

export interface PatternToRegExpOptions {
  anchor?:    boolean | 'start' | 'end'
  wildcards?: boolean
  modifiers?: string
}

export function patternToRegExp(pattern: string, options: PatternToRegExpOptions = {}) {
  let regExpPattern = escapeRegExp(pattern)
  if (options.wildcards) {
    regExpPattern = regExpPattern.replace(/\\\*/g, '(.*?)')
  }
  if (options.anchor !== false) {
    regExpPattern = `^${regExpPattern}$`
  }

  return new RegExp(regExpPattern, options.modifiers)
}

export function parseRegExp(pattern: string) {
  if (/^\/(.*)\/([img]+)?$/.test(pattern)) {
    return new RegExp(RegExp.$1, RegExp.$2)
  } else {
    return new RegExp(pattern)
  }
}

export function tryRegExp(subject: string, regExp: RegExp, parse: (match: RegExpMatchArray) => string): string | null {
  const match = subject.match(regExp)
  return match == null ? null : parse(match)
}

export function switchRegExp<T>(subject: string, entries: Array<[RegExp, (match: RegExpMatchArray) => T]>): T | undefined
export function switchRegExp<T>(subject: string, entries: Array<[RegExp, (match: RegExpMatchArray) => T]>, defaultValue: T | (() => T)): T
export function switchRegExp<T>(subject: string, entries: Array<[RegExp, (match: RegExpMatchArray) => T]>, defaultValue?: T | (() => T)): T | undefined {
  for (const [regExp, parse] of entries) {
    const match = subject.match(regExp)
    if (match == null) { continue }
    return parse(match)
  }

  return isFunction(defaultValue) ? defaultValue() : defaultValue
}
