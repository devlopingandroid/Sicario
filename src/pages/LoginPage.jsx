import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import loginImg from "../assets/login.png";   // ✅ correct import

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL */}
       <div className="flex items-center justify-center bg-blue-50">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md p-10 rounded-2xl shadow-xl"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Login to your Siciario account
            </p>

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <div className="flex items-center border rounded-lg px-3 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 outline-none text-sm text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <div className="flex items-center border rounded-lg px-3 mt-1">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 outline-none text-sm text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={loginImg}
            alt="Login Illustration"
            className="max-w-[80%] drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
