export const DEMO_FIRM_KEYS = ['aqasem', 'rrh', 'howladar', 'syful', 'islam'] as const
export type DemoFirmKey = (typeof DEMO_FIRM_KEYS)[number]

export const DEMO_FIRM_OPTIONS: { key: DemoFirmKey; label: string }[] = [
  { key: 'aqasem', label: 'A. Qasem & Co.' },
  { key: 'rrh', label: 'Rahman Rahman Huq' },
  { key: 'howladar', label: 'Howladar Yunus' },
  { key: 'syful', label: 'Syful Shamsul Alam' },
  { key: 'islam', label: 'Islam Afzal Parsons' },
]
