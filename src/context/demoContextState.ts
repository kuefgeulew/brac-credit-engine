import { createContext } from 'react'

export type DemoContextValue = {
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  showProcessingAnimation: boolean
  setShowProcessingAnimation: (value: boolean) => void
  highlightCovenantBreach: boolean
  setHighlightCovenantBreach: (value: boolean) => void
  highlightIcrrScore: boolean
  setHighlightIcrrScore: (value: boolean) => void
}

export const DemoContext = createContext<DemoContextValue | null>(null)
