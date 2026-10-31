const STORAGE_KEY = 'photo_gallery_collections'

// Load collections from localStorage
export function initCollections() {
  try {
    const savedCollections = localStorage.getItem(STORAGE_KEY)

    if (!savedCollections) return []

    const parsedCollections = JSON.parse(savedCollections)

    if (!Array.isArray(parsedCollections)) return []

    // Validate stored collection data
    return parsedCollections.filter(
      (collection) =>
        collection &&
        typeof collection.id === 'string' &&
        typeof collection.name === 'string' &&
        Array.isArray(collection.photoIds)
    )
  } catch (error) {
    console.error('Failed to load collections:', error)
    return []
  }
}

// Manage collection actions
export function collectionsReducer(state, action) {
  switch (action.type) {
    case 'CREATE_COLLECTION': {
      const name = action.name.trim()

      if (!name) return state

      const alreadyExists = state.some(
        (collection) =>
          collection.name.toLowerCase() === name.toLowerCase()
      )

      if (alreadyExists) return state

      const newCollection = {
        id: crypto.randomUUID(),
        name,
        photoIds: [],
        createdAt: new Date().toISOString(),
      }

      return [...state, newCollection]
    }

    case 'ADD_PHOTO': {
      return state.map((collection) => {
        if (collection.id !== action.collectionId) {
          return collection
        }

        // Prevent duplicate photos in the same collection
        if (collection.photoIds.includes(action.photoId)) {
          return collection
        }

        return {
          ...collection,
          photoIds: [...collection.photoIds, action.photoId],
        }
      })
    }

    case 'REMOVE_PHOTO': {
      return state.map((collection) => {
        if (collection.id !== action.collectionId) {
          return collection
        }

        return {
          ...collection,
          photoIds: collection.photoIds.filter(
            (id) => id !== action.photoId
          ),
        }
      })
    }

    case 'RENAME_COLLECTION': {
      const name = action.name.trim()

      if (!name) return state

      const alreadyExists = state.some(
        (collection) =>
          collection.id !== action.collectionId &&
          collection.name.toLowerCase() === name.toLowerCase()
      )

      if (alreadyExists) return state

      return state.map((collection) =>
        collection.id === action.collectionId
          ? { ...collection, name }
          : collection
      )
    }

    case 'DELETE_COLLECTION': {
      return state.filter(
        (collection) => collection.id !== action.collectionId
      )
    }

    default:
      return state
  }
}