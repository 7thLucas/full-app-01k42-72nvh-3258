import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const QueryParamDisplay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramObj: Record<string, string> = {};
    
    urlParams.forEach((value, key) => {
      paramObj[key] = value;
    });
    
    setParams(paramObj);
  }, []);

  if (!isVisible) {
    return (
      <button
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        onClick={() => setIsVisible(true)}
        title="Show Query Parameters"
      >
        <Eye size={16} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Query Parameters</h3>
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsVisible(false)}
        >
          <EyeOff size={14} />
        </button>
      </div>
      
      {Object.keys(params).length === 0 ? (
        <p className="text-xs text-gray-500">No query parameters found</p>
      ) : (
        <div className="space-y-1">
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="font-medium text-gray-600">{key}:</span>
              <span className="text-gray-900 ml-2 break-all">{value}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Required: keyspace, role, userId
        </p>
      </div>
    </div>
  );
};

export default QueryParamDisplay; 