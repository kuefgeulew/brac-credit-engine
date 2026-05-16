import { useCallback, useEffect, useRef, useState } from 'react'

/** Triggers a file download from /public via root URL (Vercel-compatible). */
export function triggerOsmlDownload(filename: string, displayName: string) {
  const link = document.createElement('a')
  link.href = `/${filename}`
  link.download = displayName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const DOWNLOAD_DELAY_MS = 800

export function useOsmlDownload() {
  const [downloading, setDownloading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const downloadFile = useCallback((filename: string, displayName: string) => {
    if (busyRef.current) return
    busyRef.current = true
    setDownloading(true)
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      triggerOsmlDownload(filename, displayName)
      busyRef.current = false
      setDownloading(false)
      timerRef.current = null
    }, DOWNLOAD_DELAY_MS)
  }, [])

  return { downloading, downloadFile }
}
