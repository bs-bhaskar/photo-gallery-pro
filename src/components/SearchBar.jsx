function SearchBar({ value, onChange, resultCount, totalCount }) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35"
            />
          </svg>
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by photographer name..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Search photos by author name"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {value && (
        <p className="mt-1.5 text-center text-xs text-gray-400">
          {resultCount === 0
            ? "No photographers match that name"
            : `Showing ${resultCount} of ${totalCount} photos`}
        </p>
      )}
    </div>
  )
}

export default SearchBar