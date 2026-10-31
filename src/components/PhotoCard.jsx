import { useState } from 'react'
import { copyPhotoLink, sharePhoto } from '../utils/sharePhoto'

function PhotoCard({
  photo,
  isFavourited,
  onToggleFavourite,
  onOpen,
  isDarkMode,
  collections,
  onAddToCollection,
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [shareMessage, setShareMessage] = useState('')

  const handleCopyLink = async (event) => {
    event.stopPropagation()

    try {
      await copyPhotoLink(photo)
      setShareMessage('Link copied!')

      setTimeout(() => setShareMessage(''), 2000)
    } catch (error) {
      console.error('Copy link failed:', error)
      setShareMessage('Could not copy link')
      setTimeout(() => setShareMessage(''), 2000)
    }
  }

  const handleShare = async (event) => {
    event.stopPropagation()

    try {
      const result = await sharePhoto(photo)
      setShareMessage(result === 'shared' ? 'Shared!' : 'Link copied!')

      setTimeout(() => setShareMessage(''), 2000)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error)
        setShareMessage('Sharing failed')
        setTimeout(() => setShareMessage(''), 2000)
      }
    }
  }

  const imageUrl = `https://picsum.photos/id/${photo.id}/400/300`

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
    <article className={`group relative rounded-xl shadow-sm transition-colors duration-300 hover:shadow-lg ${ isDarkMode ? 'bg-gray-900' : 'bg-white' }`}>
      <div
        className="relative overflow-visible rounded-t-xl bg-gray-100"
        style={{ aspectRatio: '4/3' }}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        {/* Click the image to open the viewer */}
        <button
          type="button"
          onClick={() => onOpen(photo)}
          aria-label={`View photo by ${photo.author}`}
          className="block h-full w-full cursor-zoom-in overflow-hidden rounded-t-xl"
        >
          <img
            src={imageUrl}
            alt={`Photo by ${photo.author}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </button>

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
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
            isFavourited
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white/90 text-gray-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100'
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={isFavourited ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
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
        </button>

        {/* Download button */}
        <button
          type="button"
          onClick={handleDownload}
          aria-label={`Download photo by ${photo.author}`}
          title="Download photo"
          className={`absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
            isDarkMode
              ? 'bg-gray-900/90 text-white hover:bg-gray-800'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
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
        </button>

        {/* Add to Collection button */}
        <div className="absolute left-2 top-14 z-20">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setShowCollections((previous) => !previous)
            }}
            aria-label="Add photo to collection"
            aria-expanded={showCollections}
            title="Add to Collection"
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition hover:scale-110 ${
              isDarkMode
                ? 'bg-gray-900/90 text-white hover:bg-gray-800'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            📁
          </button>

          {showCollections && (
            <div
              className={`absolute left-0 top-11 w-56 rounded-xl border p-3 shadow-xl ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-900'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="mb-2 text-sm font-semibold">
                Add to Collection
              </p>

              {collections.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Create a collection first.
                </p>
              ) : (
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {collections.map((collection) => {
                    const isAdded = collection.photoIds.includes(photo.id)

                    return (
                      <button
                        key={collection.id}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          onAddToCollection(collection.id, photo.id)
                          setShowCollections(false)
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                          isAdded
                            ? 'cursor-not-allowed opacity-60'
                            : isDarkMode
                              ? 'hover:bg-gray-800'
                              : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">
                          📁 {collection.name}
                        </span>

                        <span className="shrink-0 text-xs">
                          {isAdded ? '✓ Added' : '+ Add'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Copy photo link */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy photo link"
          title="Copy photo link"
          className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:scale-110 hover:bg-white"
        >
          🔗
        </button>

        {/* Share photo */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share photo"
          title="Share photo"
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:scale-110 hover:bg-white"
        >
          📤
        </button>

        {/* Feedback */}
        {shareMessage && (
          <p
            role="status"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
          >
            {shareMessage}
          </p>
        )}
      </div>



      {/* Photographer details */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <p className="mb-0.5 text-xs uppercase tracking-wider text-amber-500">
            Photographer
          </p>

          <p className={`truncate text-sm font-medium ${ isDarkMode ? 'text-gray-100' : 'text-gray-800' }`}>
            {photo.author}
          </p>
        </div>

        {isFavourited && (
          <span className="ml-2 shrink-0 rounded-full border border-amber-300 px-2 py-0.5 text-xs text-amber-500">
            Saved
          </span>
        )}
      </div>
    </article>
  )
}

export default PhotoCard