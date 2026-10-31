import { useState, useEffect, useCallback, useRef } from 'react'

function useFetchPhotos(limit = 12) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [loadMoreError, setLoadMoreError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const requestInProgress = useRef(false)

  // Fetch the first page
  useEffect(() => {
    let cancelled = false

    const fetchInitialPhotos = async () => {
      setLoading(true)
      setError(null)
      setLoadMoreError(null)
      setPhotos([])
      setPage(1)
      setHasMore(true)
      requestInProgress.current = false

      try {
        const response = await fetch(
          `https://picsum.photos/v2/list?page=1&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch photos (${response.status})`)
        }

        const data = await response.json()

        if (!cancelled) {
          setPhotos(data)
          setPage(1)
          setHasMore(data.length === limit)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof TypeError
              ? 'Network error. Please check your internet connection.'
              : err.message || 'Something went wrong.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchInitialPhotos()

    return () => {
      cancelled = true
    }
  }, [limit])

  // Fetch the next page
  const loadMore = useCallback(async () => {
    if (
      requestInProgress.current ||
      loading ||
      !hasMore
    ) {
      return
    }

    requestInProgress.current = true
    setLoadingMore(true)
    setLoadMoreError(null)

    const nextPage = page + 1

    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${nextPage}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error(`Failed to load more photos (${response.status})`)
      }

      const data = await response.json()

      // Avoid adding duplicate photos
      setPhotos((previousPhotos) => {
        const existingIds = new Set(
          previousPhotos.map((photo) => photo.id)
        )

        const newPhotos = data.filter(
          (photo) => !existingIds.has(photo.id)
        )

        return [...previousPhotos, ...newPhotos]
      })

      setPage(nextPage)
      setHasMore(data.length === limit)
    } catch (err) {
      setLoadMoreError(
        err instanceof TypeError
          ? 'Network error. Please try again.'
          : err.message || 'Could not load more photos.'
      )
    } finally {
      requestInProgress.current = false
      setLoadingMore(false)
    }
  }, [page, limit, hasMore, loading])

  return {
    photos,
    loading,
    error,
    loadingMore,
    loadMoreError,
    hasMore,
    loadMore,
  }
}

export default useFetchPhotos