import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft, RefreshCw, FileX } from "lucide-react";

export default function RouteError() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = 500;
  let errorStatusText = "Internal Server Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorStatusText = error.statusText;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const is404 = errorStatus === 404;

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {is404 ? (
              <FileX className="text-secondary-400" size={48} />
            ) : (
              <AlertTriangle className="text-danger-500" size={48} />
            )}
          </div>
          
          <h1 className="text-6xl font-bold text-secondary-900 mb-4">
            {errorStatus}
          </h1>
          
          <h2 className="text-2xl font-semibold text-secondary-700 mb-4">
            {is404 ? "Page Not Found" : errorStatusText}
          </h2>
          
          <p className="text-secondary-600 mb-8 leading-relaxed">
            {is404
              ? "The page you're looking for doesn't exist or has been moved to a new location."
              : errorMessage}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && !is404 && error instanceof Error && (
          <details className="mb-8 text-left bg-white rounded-lg p-4 shadow-sm">
            <summary className="cursor-pointer text-sm font-medium text-secondary-700 mb-2">
              Error Details (Development)
            </summary>
            <div className="bg-secondary-50 rounded p-3 text-xs text-secondary-800 overflow-auto max-h-32">
              <div className="font-medium mb-1">Error:</div>
              <div className="mb-2">{error.message}</div>
              {error.stack && (
                <>
                  <div className="font-medium mb-1">Stack:</div>
                  <pre className="whitespace-pre-wrap text-xs">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            to="/"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </Link>
          
          <button
            className="inline-flex items-center px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
          
          {!is404 && (
            <button
              className="inline-flex items-center px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2" size={20} />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 