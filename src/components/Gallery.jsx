import {
  useReducer,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'

import {
  collectionsReducer,
  initCollections,
} from '../hooks/collectionsReducer'

import useFetchPhotos from '../hooks/useFetchPhotos'
import CollectionsPanel from './CollectionsPanel'

import {
  favouritesReducer,
  initFavourites,
} from '../hooks/favouritesReducer'

import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import ImageViewer from './ImageViewer'

function Gallery() {
  // Fetch photos from the Picsum API
  const {
    photos,
    loading,
    error,
    loadingMore,
    loadMoreError,
    hasMore,
    loadMore,
  } = useFetchPhotos(12)

  // Manage favourites
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    initFavourites
  )

  const [collections, dispatchCollections] = useReducer(
    collectionsReducer,
    undefined,
    initCollections
  )

  useEffect(() => {
    localStorage.setItem(
      'photo_gallery_collections',
      JSON.stringify(collections)
    )
  }, [collections])

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false)

  const [sortBy, setSortBy] = useState('default')

  // Currently selected photo
  const [selectedPhotoId, setSelectedPhotoId] = useState(null)

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('gallery_theme') === 'dark'
  })

  // Search handler
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value)
  }, [])

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode((previous) => {
      const next = !previous

      localStorage.setItem(
        'gallery_theme',
        next ? 'dark' : 'light'
      )

      return next
    })
  }, [])

  // Toggle favourite status
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE', id })
  }, [])

  const handleAddToCollection = useCallback(
    (collectionId, photoId) => {
      dispatchCollections({
        type: 'ADD_PHOTO',
        collectionId,
        photoId,
      })
    },
    []
  )

  // Open and close image viewer
  const handleOpenViewer = useCallback((photo) => {
    setSelectedPhotoId(photo.id)
  }, [])

  const handleCloseViewer = useCallback(() => {
    setSelectedPhotoId(null)
  }, [])

  // Filter photos based on search and favourites
  const filteredPhotos = useMemo(() => {
    let result = [...photos]

    // Filter favourites
    if (showFavouritesOnly) {
      result = result.filter((photo) => favourites.has(photo.id))
    }

    // Search by photographer name
    const query = searchQuery.trim().toLowerCase()

    if (query) {
      result = result.filter((photo) =>
        photo.author.toLowerCase().includes(query)
      )
    }

    // Sorting
    switch (sortBy) {
      case 'author-asc':
        result.sort((a, b) => a.author.localeCompare(b.author))
        break

      case 'author-desc':
        result.sort((a, b) => b.author.localeCompare(a.author))
        break

      case 'favourites':
        result.sort(
          (a, b) =>
            Number(favourites.has(b.id)) -
            Number(favourites.has(a.id))
        )
        break

      case 'id-asc':
        result.sort((a, b) => Number(a.id) - Number(b.id))
        break

      case 'id-desc':
        result.sort((a, b) => Number(b.id) - Number(a.id))
        break

      default:
        break
    }

    return result
  }, [photos, searchQuery, showFavouritesOnly, favourites, sortBy])

  // Find the selected photo in the currently filtered gallery
  const selectedIndex = filteredPhotos.findIndex(
    (photo) => photo.id === selectedPhotoId
  )

  const selectedPhoto =
    selectedIndex !== -1 ? filteredPhotos[selectedIndex] : null

  // Navigate to previous photo
  const handlePreviousPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return

    const currentIndex = filteredPhotos.findIndex(
      (photo) => photo.id === selectedPhotoId
    )

    if (currentIndex === -1) return

    const previousIndex =
      (currentIndex - 1 + filteredPhotos.length) %
      filteredPhotos.length

    setSelectedPhotoId(filteredPhotos[previousIndex].id)
  }, [filteredPhotos, selectedPhotoId])

  // Navigate to next photo
  const handleNextPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return

    const currentIndex = filteredPhotos.findIndex(
      (photo) => photo.id === selectedPhotoId
    )

    if (currentIndex === -1) return

    const nextIndex = (currentIndex + 1) % filteredPhotos.length

    setSelectedPhotoId(filteredPhotos[nextIndex].id)
  }, [filteredPhotos, selectedPhotoId])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 border-b shadow-sm transition-colors duration-300 ${
          isDarkMode
            ? 'border-gray-800 bg-gray-900'
            : 'border-gray-100 bg-white'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Logo and title */}
            <div className="shrink-0">
              <h1 className={`text-xl font-bold ${ isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Photo Gallery
              </h1>

              <p className={`text-xs ${ isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                Powered by Picsum Photos
              </p>
            </div>

            {/* Search */}
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                resultCount={filteredPhotos.length}
                totalCount={photos.length}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <label
                htmlFor="photo-sort"
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Sort:
              </label>

              <select
                id="photo-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className={`max-w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <option value="default">Default</option>
                <option value="author-asc">Photographer: A–Z</option>
                <option value="author-desc">Photographer: Z–A</option>
                <option value="favourites">Favourites first</option>
                <option value="id-asc">Photo ID: Low to High</option>
                <option value="id-desc">Photo ID: High to Low</option>
              </select>
            </div>

            {/* Favourites filter */}
            <button
              type="button"
              onClick={() =>
                setShowFavouritesOnly((previous) => !previous)
              }
              aria-pressed={showFavouritesOnly}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                showFavouritesOnly
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill={showFavouritesOnly ? 'currentColor' : 'none'}
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

              Saved {favourites.size > 0 && `(${favourites.size})`}
            </button>

            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 text-amber-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span aria-hidden="true">
                {isDarkMode ? '☀️' : '🌙'}
              </span>

              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <CollectionsPanel
          collections={collections}
          dispatchCollections={dispatchCollections}
          isDarkMode={isDarkMode}
          photos={photos}
        />
        {loading && <LoadingSpinner />}

        {error && !loading && <ErrorMessage message={error} />}

        {/* Empty state */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className={`rounded-xl border border-dashed px-6 py-16 text-center ${isDarkMode? 'border-gray-700 bg-gray-900': 'border-gray-300 bg-white'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {showFavouritesOnly
                ? 'No saved photos found'
                : 'No photos found'}
            </h2>

            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {showFavouritesOnly
                ? 'Save a photo using the heart button to see it here.'
                : `No photographers match "${searchQuery}". Try another search.`}
            </p>

            {(showFavouritesOnly || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setShowFavouritesOnly(false)
                  setSearchQuery('')
                }}
                className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
              >
                Show all photos
              </button>
            )}
          </div>
        )}

        {/* Photo grid */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="card-enter"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <PhotoCard
                  photo={photo}
                  isFavourited={favourites.has(photo.id)}
                  onToggleFavourite={handleToggleFavourite}
                  onOpen={handleOpenViewer}
                  isDarkMode={isDarkMode}
                  collections={collections}
                  onAddToCollection={handleAddToCollection}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <p
            className={`mt-8 mb-3 text-center text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
            aria-live="polite"
          >
            Showing {photos.length} photos
          </p>
        )}
        
        {/* Load More Photos */}
        {!loading && !error && photos.length > 0 && hasMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className={`rounded-xl px-6 py-3 font-semibold shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDarkMode
                ? 'bg-amber-500 text-gray-950 hover:bg-amber-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            >
              {loadingMore ? 'Loading photos...' : 'Load More Photos'}
            </button>

            {loadMoreError && (
              <div className="text-center">
                <p className="mb-2 text-sm text-red-500">
                  {loadMoreError}
                </p>

                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-sm font-medium text-blue-600 underline disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* API attribution */}
        {!loading && !error && photos.length > 0 && (
          <p className="mt-10 text-center text-xs text-gray-400">
            Photos provided by{' '}
            <a
              href="https://picsum.photos"
              target="_blank"
              rel="noreferrer"
              className="text-amber-500 underline underline-offset-2 hover:text-amber-600"
            >
              Picsum Photos
            </a>
          </p>
        )}
      </main>

      {/* Full-screen image viewer */}
      {selectedPhoto && (
        <ImageViewer
          photo={selectedPhoto}
          onClose={handleCloseViewer}
          onPrevious={handlePreviousPhoto}
          onNext={handleNextPhoto}
          isFavourited={favourites.has(selectedPhoto.id)}
          onToggleFavourite={handleToggleFavourite}
        />
      )}
    </div>
  )
}

export default Gallery