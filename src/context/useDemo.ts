import { useContext } from 'react'
import { DemoContext, type DemoContextValue } from './demoContextState'

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext)
  if (!ctx) {
    throw new Error('useDemo must be used within DemoProvider')
  }
  return ctx
}
