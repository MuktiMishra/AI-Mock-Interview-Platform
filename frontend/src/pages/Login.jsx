import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Brain } from "lucide-react";
import axios from 'axios'
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate(); 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/login",
      {
        email: form.email,
        password: form.password,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
        return navigate('/dashboard'); 
    } else {
        return alert('sorry failed to login')
    }
    
  } catch (error) {
    alert(error.response?.data?.message || "Invalid credentials");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
      >
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-500 p-3 rounded-full mb-3">
            <Brain className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AI Mock Interview</h1>
          <p className="text-gray-500 text-sm mt-1">Practice smarter. Get hired faster.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-600 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-purple-500" />
              Remember me
            </label>
            <a href="#" className="hover:text-purple-500">Forgot?</a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social Login */}
        <button className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-purple-50 transition">
          Continue with Google
        </button>

        {/* Signup */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?
          <a href="/signup" className="text-purple-500 hover:underline ml-1">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
}