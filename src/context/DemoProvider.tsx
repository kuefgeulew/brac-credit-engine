import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DemoContext, type DemoContextValue } from './demoContextState'

export function DemoProvider({ children }: { children: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [showProcessingAnimation, setShowProcessingAnimation] = useState(true)
  const [highlightCovenantBreach, setHighlightCovenantBreach] = useState(false)
  const [highlightIcrrScore, setHighlightIcrrScore] = useState(false)

  const togglePanel = useCallback(() => {
    setPanelOpen((o) => !o)
  }, [])

  const value = useMemo<DemoContextValue>(
    () => ({
      panelOpen,
      setPanelOpen,
      togglePanel,
      showProcessingAnimation,
      setShowProcessingAnimation,
      highlightCovenantBreach,
      setHighlightCovenantBreach,
      highlightIcrrScore,
      setHighlightIcrrScore,
    }),
    [
      panelOpen,
      togglePanel,
      showProcessingAnimation,
      highlightCovenantBreach,
      highlightIcrrScore,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
