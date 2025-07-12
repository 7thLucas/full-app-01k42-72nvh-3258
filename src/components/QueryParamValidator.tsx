import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface QueryParamValidatorProps {
  children: React.ReactNode;
}

const QueryParamValidator: React.FC<QueryParamValidatorProps> = ({
  children,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateParams = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const keyspace = urlParams.get("keyspace");
        const role = urlParams.get("role");
        const userId = urlParams.get("userId");

        if (!keyspace || !role || !userId) {
          const missing = [];

          if (!keyspace) missing.push("keyspace");
          if (!role) missing.push("role");
          if (!userId) missing.push("userId");

          setError(`Missing required query parameters: ${missing.join(", ")}`);
          setIsValid(false);
        } else {
          setError(null);
          setIsValid(true);
        }
      } catch (err) {
        setError("Error validating query parameters");
        setIsValid(false);
      }
    };

    validateParams();
  }, []);

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Required URL Parameters:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                <code className="bg-yellow-100 px-1 rounded">keyspace</code> -
                The keyspace identifier
              </li>
              <li>
                <code className="bg-yellow-100 px-1 rounded">role</code> - The
                role identifier
              </li>
              <li>
                <code className="bg-yellow-100 px-1 rounded">userId</code> - The
                user identifier
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Example URL:</h3>
            <code className="text-sm text-blue-700 break-all">
              {window.location.origin}
              {window.location.pathname}?keyspace=satudesa&role=dev&userId=3181
            </code>
          </div>

          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
