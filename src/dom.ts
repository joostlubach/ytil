import { v4 as uuidV4 } from 'uuid'

// Tree traversal

interface ClosestOptions {
  until?: Element
}

export function closest(element: Element | EventTarget, predicate: (element: Element) => boolean, options: ClosestOptions = {}): Element | null {
  if (!(element instanceof Node)) { return null }

  for (
    let current: Node | null = element;
    current !== null;
    current = current.parentNode
  ) {
    if (current === options.until) {
      return null
    }
    if (current instanceof Element && predicate(current)) {
      return current
    }
  }

  return null
}

//------
// Focus

export const FOCUS_EXCLUDE     = ':not([disabled]):not([tabindex="-1"])'
export const FOCUSABLE_ALL     = ['button', 'input', 'select', 'textarea', '[tabindex]', '[href]'].map(sel => `${sel}${FOCUS_EXCLUDE}`)
export const FOCUSABLE_FIELDS  = ['input:not([type="button"]):not([type="submit"])', 'select', 'textarea'].map(sel => `${sel}${FOCUS_EXCLUDE}`)
export const FOCUSABLE_BUTTONS = ['input:[type="button"], input[type="submit"]', 'button'].map(sel => `${sel}${FOCUS_EXCLUDE}`)

export function autoFocusFirst(container: HTMLElement, options: AutoFocusFirstOptions = {}) {
  const {
    fields  = true,
    buttons = false,
    select  = false,
  } = options

  const selectors      = fields && buttons ? FOCUSABLE_ALL : fields ? FOCUSABLE_FIELDS : FOCUSABLE_BUTTONS
  const selector       = options.selector == null ? selectors.join(', ') : selectors.map(it => `${it}${options.selector}`).join(', ')
  const focusables     = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
  const firstFocusable = focusables[0]

  firstFocusable?.focus()
  if (select && firstFocusable instanceof HTMLInputElement) {
    firstFocusable.select()
  }
}

export interface AutoFocusFirstOptions {
  fields?:   boolean
  buttons?:  boolean
  select?:   boolean
  selector?: string
}

//------
// Element queries

export function isScrolledElement(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) { return false }

  const overflow = window.getComputedStyle(element).overflow
  if (overflow === 'hidden' || overflow === 'visible') { return false }
  if (overflow === 'scroll') { return true }

  return element.scrollHeight > element.clientHeight
}

const interactiveTags = ['input', 'select', 'textarea', 'button']

export function isInteractiveElement(target: EventTarget | null): target is HTMLElement {
  if (!(target instanceof HTMLElement)) { return false }

  const tagName = target.tagName.toLowerCase()
  if (tagName === 'a' && target.hasAttribute('href')) { return true }
  if (tagName === 'label' && target.hasAttribute('for')) { return true }
  if (tagName === 'label' && target.querySelector(interactiveTags.join(', ')) != null) { return true }
  if (target.getAttribute('role') === 'button') { return true }
  if (target.hasAttribute('tabindex')) { return true }

  return interactiveTags.includes(tagName)
}

export function focusFirst(container: Element) {
  const elements = Array.from(container.querySelectorAll('input, select, textarea, button'))

  elements.sort((a, b) => {
    if (!(a instanceof HTMLElement)) { return 0 }
    if (!(b instanceof HTMLElement)) { return 0 }

    if (a.tabIndex != null && b.tabIndex != null) {
      return a.tabIndex - b.tabIndex
    } else {
      return 0
    }
  })


  for (const element of elements) {
    if (isInteractiveElement(element)) {
      element.focus()
      return
    }
  }
}

export function cloneElement(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement
  const prefix = uuidV4().slice(0, 8)

  // Prefix all IDs and url(#) references within (this fixes SVG masks getting messed up).
  for (const element of clone.querySelectorAll('[id]')) {
    const id = element.getAttribute('id')
    if (id == null) { continue }

    element.setAttribute('id', `${prefix}-${id}`)
  }

  for (const attribute of ['style', 'mask', 'fill']) {
    const selector = `[${attribute}*="url(\\"#"]`
    for (const element of clone.querySelectorAll(selector)) {
      const value = element.getAttribute(attribute)
      if (value == null) { continue }

      element.setAttribute(attribute, value.replace(/url\("#(.*?)"\)/g, (_, id) => `url("#${prefix}-${id}")`))
    }
  }

  return clone
}