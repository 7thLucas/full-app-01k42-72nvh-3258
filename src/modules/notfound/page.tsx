import { Link } from "react-router-dom";
import { Home, FileX, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileX className="text-secondary-400" size={48} />
          </div>
          <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-secondary-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-base text-secondary-600 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to a new location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
            to="/"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </Link>
          <button
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-secondary-200 text-secondary-900 hover:bg-secondary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-400"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
