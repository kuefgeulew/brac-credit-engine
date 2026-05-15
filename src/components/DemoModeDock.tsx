import { Play, X } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDemo } from '../context/useDemo'
import {
  DEMO_FIRM_OPTIONS,
  type DemoFirmKey,
} from '../context/demoModeConstants'

function DemoSwitch({
  checked,
  onCheckedChange,
  id,
  label,
}: {
  checked: boolean
  onCheckedChange: (next: boolean) => void
  id: string
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-card-white shadow transition-transform duration-200 ease-out ${
            checked ? 'translate-x-5' : ''
          }`}
          aria-hidden
        />
      </button>
    </div>
  )
}

export default function DemoModeDock() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    panelOpen,
    setPanelOpen,
    showProcessingAnimation,
    setShowProcessingAnimation,
    highlightCovenantBreach,
    setHighlightCovenantBreach,
    highlightIcrrScore,
    setHighlightIcrrScore,
  } = useDemo()

  const onResults = location.pathname === '/results'

  function goResults(firmKey: DemoFirmKey) {
    navigate('/results', { state: { firmKey }, replace: onResults })
  }

  useEffect(() => {
    if (!panelOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [panelOpen, setPanelOpen])

  return (
    <div className="demo-mode-dock print:hidden">
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-24 right-6 z-[999] inline-flex items-center gap-2 rounded-[24px] border-2 border-primary bg-card-white px-5 py-2.5 text-sm font-bold text-primary shadow-md transition-colors hover:bg-primary/5"
        aria-expanded={panelOpen}
        aria-controls="demo-control-panel"
      >
        <Play className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        Demo Mode
      </button>

      {panelOpen ? (
        <>
          <button
            type="button"
            aria-label="Close demo panel"
            className="fixed inset-0 z-[997] bg-text-primary/20"
            onClick={() => setPanelOpen(false)}
          />
          <aside
            id="demo-control-panel"
            className="fixed right-0 top-0 z-[998] flex h-full w-[280px] flex-col border-l border-border bg-card-white shadow-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
              <h2 className="text-base font-bold text-text-primary">Demo Controls</h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="main-scroll flex-1 overflow-y-auto px-4 py-4">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Quick Navigate
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-card-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface"
                    onClick={() => {
                      navigate('/')
                      setPanelOpen(false)
                    }}
                  >
                    Login Page
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-card-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface"
                    onClick={() => {
                      navigate('/dashboard')
                      setPanelOpen(false)
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-card-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface"
                    onClick={() => {
                      navigate('/new-review')
                      setPanelOpen(false)
                    }}
                  >
                    Start New Review
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-card-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface"
                    onClick={() => {
                      goResults('aqasem')
                      setPanelOpen(false)
                    }}
                  >
                    Show Results (RMG)
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-card-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface"
                    onClick={() => {
                      goResults('howladar')
                      setPanelOpen(false)
                    }}
                  >
                    Show Results (Flagged)
                  </button>
                </div>
              </section>

              <section className={`mt-8 ${onResults ? '' : 'opacity-40'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Switch Active Firm
                </h3>
                {!onResults ? (
                  <p className="mt-2 text-xs text-text-secondary">
                    Open the results page to switch borrower data.
                  </p>
                ) : null}
                <div className="mt-3 flex flex-col gap-2">
                  {DEMO_FIRM_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      disabled={!onResults}
                      className="rounded-lg border border-border bg-card-white px-3 py-2.5 text-left text-sm font-semibold text-text-primary transition-colors hover:border-primary/40 hover:bg-surface disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-card-white"
                      onClick={() => {
                        if (!onResults) return
                        goResults(key)
                        setPanelOpen(false)
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Highlight Features
                </h3>
                <div className="mt-3 space-y-4">
                  <DemoSwitch
                    id="demo-processing"
                    label="Skip ~7s processing animation"
                    checked={!showProcessingAnimation}
                    onCheckedChange={(skip) => setShowProcessingAnimation(!skip)}
                  />
                  <DemoSwitch
                    id="demo-covenant"
                    label="Highlight covenant breach"
                    checked={highlightCovenantBreach}
                    onCheckedChange={setHighlightCovenantBreach}
                  />
                  <DemoSwitch
                    id="demo-icrr"
                    label="Highlight ICRR score"
                    checked={highlightIcrrScore}
                    onCheckedChange={setHighlightIcrrScore}
                  />
                </div>
              </section>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  )
}
