import { FileDown, Loader2 } from 'lucide-react'
import { useOsmlDownload } from '../../utils/osmlDownload'

type OsmlDownloadButtonProps = {
  filename: string
  displayName: string
  label: string
  className?: string
}

const defaultClassName =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1A7C4A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#156542] disabled:cursor-not-allowed disabled:opacity-80'

export default function OsmlDownloadButton({
  filename,
  displayName,
  label,
  className = defaultClassName,
}: OsmlDownloadButtonProps) {
  const { downloading, downloadFile } = useOsmlDownload()

  return (
    <button
      type="button"
      onClick={() => downloadFile(filename, displayName)}
      disabled={downloading}
      className={className}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" strokeWidth={2} aria-hidden />
      ) : (
        <FileDown className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      )}
      {downloading ? 'Downloading...' : label}
    </button>
  )
}
