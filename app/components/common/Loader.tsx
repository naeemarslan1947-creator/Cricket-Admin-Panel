export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 h-vh flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

        <p className="text-sm font-medium text-gray-600">
          Loading<span className="animate-pulse">...</span>
        </p>
      </div>
    </div>
  );
}
