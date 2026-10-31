import { useState } from 'react'

function CollectionsPanel({
  collections,
  dispatchCollections,
  isDarkMode,
  photos,
}) {
  const [collectionName, setCollectionName] = useState('')
  const [message, setMessage] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] =
    useState(null)

  const selectedCollection = collections.find(
    (collection) => collection.id === selectedCollectionId
  )

  const selectedPhotos = selectedCollection
    ? photos.filter((photo) =>
        selectedCollection.photoIds.includes(photo.id)
      )
    : []

  const handleCreateCollection = (event) => {
    event.preventDefault()

    const name = collectionName.trim()

    if (!name) {
      setMessage('Please enter a collection name.')
      return
    }

    const alreadyExists = collections.some(
      (collection) =>
        collection.name.toLowerCase() === name.toLowerCase()
    )

    if (alreadyExists) {
      setMessage('A collection with this name already exists.')
      return
    }

    dispatchCollections({
      type: 'CREATE_COLLECTION',
      name,
    })

    setCollectionName('')
    setMessage(`"${name}" collection created successfully!`)
  }

  const handleDeleteCollection = (event, collection) => {
    event.stopPropagation()

    const confirmed = window.confirm(
      `Delete "${collection.name}"? The photos will remain in your gallery.`
    )

    if (!confirmed) return

    dispatchCollections({
      type: 'DELETE_COLLECTION',
      collectionId: collection.id,
    })

    if (selectedCollectionId === collection.id) {
      setSelectedCollectionId(null)
    }

    setMessage(`"${collection.name}" collection deleted.`)
  }

  const handleRemovePhoto = (photoId) => {
    dispatchCollections({
      type: 'REMOVE_PHOTO',
      collectionId: selectedCollection.id,
      photoId,
    })
  }

  const panelText = isDarkMode
    ? 'text-gray-100'
    : 'text-gray-900'

  const mutedText = isDarkMode
    ? 'text-gray-400'
    : 'text-gray-500'

  return (
    <section
      className={`mt-8 mb-8 rounded-2xl border p-5 sm:p-6 ${
        isDarkMode
          ? 'border-gray-800 bg-gray-900'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold ${panelText}`}>
            My Collections
          </h2>

          <p className={`mt-1 text-sm ${mutedText}`}>
            Organize your favourite photos into personal albums.
          </p>
        </div>

        {selectedCollection && (
          <button
            type="button"
            onClick={() => setSelectedCollectionId(null)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              isDarkMode
                ? 'border-gray-700 hover:bg-gray-800'
                : 'border-gray-200 hover:bg-gray-100'
            }`}
          >
            ← All Collections
          </button>
        )}
      </div>

      {!selectedCollection && (
        <>
          <form
            onSubmit={handleCreateCollection}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={collectionName}
              onChange={(event) => {
                setCollectionName(event.target.value)
                setMessage('')
              }}
              placeholder="e.g. Nature, Travel, Inspiration"
              maxLength={50}
              aria-label="Collection name"
              className={`min-w-0 flex-1 rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-800 text-white placeholder:text-gray-500'
                  : 'border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400'
              }`}
            />

            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              + Create Collection
            </button>
          </form>

          {message && (
            <p
              role="status"
              className={`mt-3 text-sm ${
                message.includes('successfully') ||
                message.includes('deleted')
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6">
            {collections.length === 0 ? (
              <div
                className={`rounded-xl border border-dashed px-4 py-8 text-center ${mutedText} ${
                  isDarkMode
                    ? 'border-gray-700'
                    : 'border-gray-300'
                }`}
              >
                <span className="text-3xl" aria-hidden="true">
                  📁
                </span>

                <p className="mt-2 font-medium">
                  No collections yet
                </p>

                <p className="mt-1 text-sm">
                  Create your first collection to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className={`relative rounded-xl border p-4 transition ${
                      isDarkMode
                        ? 'border-gray-800 bg-gray-950'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCollectionId(collection.id)
                      }
                      aria-label={`Open ${collection.name} collection`}
                      className="flex w-full items-start gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <span className="text-3xl" aria-hidden="true">
                        📁
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block break-words font-semibold ${panelText}`}
                        >
                          {collection.name}
                        </span>

                        <span className={`mt-1 block text-sm ${mutedText}`}>
                          {collection.photoIds.length}{' '}
                          {collection.photoIds.length === 1
                            ? 'photo'
                            : 'photos'}
                        </span>

                        <span className="mt-2 block text-xs font-medium text-amber-500">
                          View collection →
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(event) =>
                        handleDeleteCollection(event, collection)
                      }
                      aria-label={`Delete ${collection.name} collection`}
                      title="Delete collection"
                      className="absolute right-2 top-2 rounded-lg px-2 py-1 text-sm text-red-500 transition hover:bg-red-500/10"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedCollection && (
        <div>
          <div className="mb-5">
            <h3 className={`text-lg font-semibold ${panelText}`}>
              📁 {selectedCollection.name}
            </h3>

            <p className={`mt-1 text-sm ${mutedText}`}>
              {selectedCollection.photoIds.length}{' '}
              {selectedCollection.photoIds.length === 1
                ? 'photo'
                : 'photos'}{' '}
              saved in this collection
            </p>
          </div>

          {selectedCollection.photoIds.length === 0 ? (
            <div
              className={`rounded-xl border border-dashed p-8 text-center ${mutedText} ${
                isDarkMode
                  ? 'border-gray-700'
                  : 'border-gray-300'
              }`}
            >
              This collection is empty. Use the folder button on a
              gallery photo to add one.
            </div>
          ) : selectedPhotos.length === 0 ? (
            <div
              className={`rounded-xl border border-dashed p-8 text-center ${mutedText} ${
                isDarkMode
                  ? 'border-gray-700'
                  : 'border-gray-300'
              }`}
            >
              These photos are saved, but they are not in the
              currently loaded gallery. Click Load More Photos to
              load additional photos, if available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedPhotos.map((photo) => (
                <article
                  key={photo.id}
                  className={`overflow-hidden rounded-xl border ${
                    isDarkMode
                      ? 'border-gray-800 bg-gray-950'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <img
                    src={`https://picsum.photos/id/${photo.id}/400/300`}
                    alt={`Photo by ${photo.author}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />

                  <div className="p-3">
                    <p className={`truncate text-sm font-medium ${panelText}`}>
                      {photo.author}
                    </p>

                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Photo ID: {photo.id}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="mt-3 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                    >
                      Remove from Collection
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default CollectionsPanel