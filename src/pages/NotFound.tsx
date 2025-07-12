import { Link } from "react-router-dom";
import { Home, FileX, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh] py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="text-secondary-400" size={48} />
            </div>
            <h1 className="heading-1 text-secondary-900 mb-4">404</h1>
            <h2 className="heading-4 text-secondary-700 mb-4">
              Page Not Found
            </h2>
            <p className="body-medium text-secondary-600 mb-8">
              The page you're looking for doesn't exist or has been moved to a new location.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              className="btn btn-primary btn-lg"
              to="/"
            >
              <Home className="mr-2" size={20} />
              Go Home
            </Link>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
