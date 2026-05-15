/** ICRR band pill/badge classes — all 5 bands for demo and future borrowers. */
export function icrrBandClass(band: string): string {
  const b = band.trim().toLowerCase()
  if (b === 'strong') {
    return 'border-[#1A7C4A]/40 bg-[#1A7C4A]/15 text-[#1A7C4A]'
  }
  if (b === 'good') {
    return 'border-[#0052A5]/40 bg-[#0052A5]/15 text-[#0052A5]'
  }
  if (b === 'acceptable') {
    return 'border-[#B45309]/40 bg-[#B45309]/15 text-[#B45309]'
  }
  if (b === 'marginal') {
    return 'border-[#C2410C]/40 bg-[#C2410C]/15 text-[#C2410C]'
  }
  if (b === 'weak') {
    return 'border-[#B91C1C]/40 bg-[#B91C1C]/15 text-[#B91C1C]'
  }
  return 'border-border bg-surface text-text-secondary'
}

export function icrrBandTextClass(band: string): string {
  const b = band.trim().toLowerCase()
  if (b === 'strong') return 'text-[#1A7C4A]'
  if (b === 'good') return 'text-[#0052A5]'
  if (b === 'acceptable') return 'text-[#B45309]'
  if (b === 'marginal') return 'text-[#C2410C]'
  if (b === 'weak') return 'text-[#B91C1C]'
  return 'text-text-secondary'
}

export function icrrBandBarClass(band: string): string {
  const b = band.trim().toLowerCase()
  if (b === 'strong') return 'bg-[#1A7C4A]'
  if (b === 'good') return 'bg-[#0052A5]'
  if (b === 'acceptable') return 'bg-[#B45309]'
  if (b === 'marginal') return 'bg-[#C2410C]'
  if (b === 'weak') return 'bg-[#B91C1C]'
  return 'bg-border'
}
