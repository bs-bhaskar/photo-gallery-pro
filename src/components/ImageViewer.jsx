import { useEffect } from 'react'

function ImageViewer({
  photo,
  onClose,
  onPrevious,
  onNext,
  isFavourited,
  onToggleFavourite,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'ArrowLeft') {
        onPrevious()
      }

      if (event.key === 'ArrowRight') {
        onNext()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onPrevious, onNext])

  if (!photo) return null

  const imageUrl = `https://picsum.photos/id/${photo.id}/1200/900`

  const handleDownload = async (event) => {
    event.stopPropagation()

    try {
        const response = await fetch(
        `https://picsum.photos/id/${photo.id}/1200/900`
        )

        if (!response.ok) {
        throw new Error('Failed to download image')
        }

        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `photo-${photo.id}.jpg`

        document.body.appendChild(link)
        link.click()
        link.remove()

        URL.revokeObjectURL(blobUrl)
    } catch (error) {
        console.error('Download failed:', error)
        window.open(
        `https://picsum.photos/id/${photo.id}/1200/900`,
        '_blank',
        'noopener,noreferrer'
        )
    }
    }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
      >
        &times;
      </button>

      {/* Previous button */}
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 sm:left-5"
      >
        &#8249;
      </button>

      {/* Image and information */}
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col items-center">
        <img
            src={imageUrl}
            alt={`Photo by ${photo.author}`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        <div className="mt-4 flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-amber-400">
              Photographer
            </p>

            <p className="truncate font-medium">{photo.author}</p>

            <p className="mt-1 text-xs text-gray-300">
              Photo ID: {photo.id}
            </p>
          </div>

          {/* Favourite button */}
          <button
            type="button"
            onClick={() => onToggleFavourite(photo.id)}
            aria-label={
              isFavourited
                ? 'Remove from favourites'
                : 'Add to favourites'
            }
            aria-pressed={isFavourited}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              isFavourited
                ? 'bg-amber-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill={isFavourited ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>

            {isFavourited ? 'Saved' : 'Save'}
          </button>

          {/* Download button */}
            <button
            type="button"
            onClick={handleDownload}
            aria-label={`Download photo by ${photo.author}`}
            title="Download photo"
            className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
            <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
                />
            </svg>

            Download
            </button>
        </div>
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20 sm:right-5"
      >
        &#8250;
      </button>
    </div>
  )
}

export default ImageViewer