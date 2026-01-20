import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signin`, {
        username,
        password
      });
      console.log(res.data);

      // login successful → dashboard me username bhej do
      navigate("/dashboard", { state: { username: res.data.username } });
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
              />
            </div>
            
            {error && <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-lg">{error}</div>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
