function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-200 text-red-400">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>

      <p className="font-medium text-gray-700">
        Failed to load photos
      </p>

      <p className="text-sm text-gray-400">
        {message}
      </p>
    </div>
  )
}

export default ErrorMessage