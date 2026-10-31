const STORAGE_KEY = 'gallery_favourites'

export function initFavourites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      const parsed = JSON.parse(stored)

      if (Array.isArray(parsed)) {
        return new Set(parsed)
      }
    }
  } catch {
    // localStorage unavailable — start fresh
  }

  return new Set()
}

function persist(favourites) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...favourites])
    )
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const next = new Set(state)

      if (next.has(action.id)) {
        next.delete(action.id)
      } else {
        next.add(action.id)
      }

      persist(next)
      return next
    }

    case 'CLEAR': {
      persist(new Set())
      return new Set()
    }

    default:
      return state
  }
}