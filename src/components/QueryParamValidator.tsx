import { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface QueryParamValidatorProps {
  children: ReactNode;
}

const QueryParamValidator: React.FC<QueryParamValidatorProps> = ({
  children,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const keyspace = urlParams.get("keyspace");
  const role = urlParams.get("role");
  const userId = urlParams.get("userId");

  const isValid = keyspace && role && userId;
  const error = !isValid
    ? "Missing required URL parameters. Please ensure keyspace, role, and userId are provided."
    : null;

  if (!isValid) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="mx-auto mb-4 text-primary-500" size={64} />
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            Configuration Error
          </h1>
          <p className="text-secondary-600 mb-6">{error}</p>

          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-secondary-800 mb-2">
              Required URL Parameters:
            </h3>
            <ul className="text-sm text-secondary-700 space-y-1">
              <li>
                <code className="bg-secondary-100 px-1 rounded">keyspace</code> -
                The keyspace identifier
              </li>
              <li>
                <code className="bg-secondary-100 px-1 rounded">role</code> - The
                role identifier
              </li>
              <li>
                <code className="bg-secondary-100 px-1 rounded">userId</code> - The
                user identifier
              </li>
            </ul>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-primary-800 mb-2">Example URL:</h3>
            <code className="text-sm text-primary-700 break-all">
              {window.location.origin}
              {window.location.pathname}?keyspace=satudesa&role=dev&userId=3181
            </code>
          </div>

          <button
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2" size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryParamValidator;
