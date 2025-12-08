"use client";

import { useSigninMutation } from "@/state/api";
import { setAdmin } from "@/state";
import { useAppDispatch } from "@/app/redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Signin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signin, { isLoading, error }] = useSigninMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.data?.message || "Sign in failed";
      setErrorMsg(errorMessage);
    }
  }, [error]);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      const result = await signin({ email, password }).unwrap();
      if (result.success) {
        dispatch(setAdmin(result.admin));
        router.push("/dashboard");
      }
    } catch (err) {
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mnas</h1>
            <p className="text-gray-400">Inventory Management System</p>
          </div>

          {/* Sign In Title */}
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Sign In
          </h2>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 mt-6"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 text-center mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-gray-300 text-center">
              Super Admin or Moderator Email
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; 2024 Inventory Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signin;
