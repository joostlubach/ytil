import React from 'react'

export function isReactText(arg: any): arg is string | number {
  return typeof arg === 'string' || typeof arg === 'number'
}

export function renderElementOrComponent<P>(
  arg:    React.ReactElement<P> | React.ComponentType<P>,
  props?: P,
): React.ReactElement<P> {
  if (React.isValidElement<P>(arg)) {
    return arg
  } else {
    return React.createElement<any>(arg, props)
  }
}