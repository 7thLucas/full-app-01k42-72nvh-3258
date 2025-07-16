import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock, AlertCircle, LogIn } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect URL from location state, fallback to home
  const redirectTo = (location.state as { from?: string })?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!phone.trim()) {
        throw new Error("Phone number is required");
      }
      if (!password.trim()) {
        throw new Error("Password is required");
      }

      await login(phone, password);

      // Redirect to the intended page or home
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Welcome back
            </h2>
            <p className="text-secondary-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle
                    className="text-danger-500 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="text-danger-800 font-medium">
                      Login failed
                    </h4>
                    <p className="text-danger-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Phone Number Field */}
              <div>
                <label
                  className="block text-sm font-medium text-secondary-700 mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-secondary-400" size={20} />
                  </div>
                  <input
                    required
                    autoComplete="tel"
                    className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    id="phone"
                    placeholder="089503386642"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Enter your phone number without country code
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm font-medium text-secondary-700 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-secondary-400" size={20} />
                  </div>
                  <input
                    required
                    autoComplete="current-password"
                    className="block w-full pl-10 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" size={16} />
                    Sign in
                  </>
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  to="/register"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              className="inline-flex items-center text-sm text-secondary-600 hover:text-secondary-900 transition-colors"
              to="/"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
