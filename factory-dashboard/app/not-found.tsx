import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 text-2xl font-black">
        404
      </div>
      <h1 className="text-xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-sm text-muted max-w-sm mb-6">
        The operations portal page or record you requested could not be located on the factory network.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition"
      >
        Return to Command Center
      </Link>
    </div>
  );
}
