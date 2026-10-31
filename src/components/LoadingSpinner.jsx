function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />

        <div className="spinner absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500" />
      </div>

      <p className="text-sm text-gray-400">
        Loading photos…
      </p>
    </div>
  )
}

export default LoadingSpinner