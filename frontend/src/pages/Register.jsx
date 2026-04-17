import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lab_tech");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role },
      );
      login(data);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-blue-600 text-white rounded-lg p-2 font-bold text-lg">
          QC
        </div>
        <span className="text-white text-xl font-bold">QC Tracker</span>
      </div>
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-400 text-center mb-8">
          Sign up for your account
        </h2>
        {error && (
          <p className="bg-red-900 text-red-300 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full name"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            >
              <option value="lab_tech">Lab Technician</option>
              <option value="quality_officer">Quality Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <p className="text-right text-gray-400 text-sm mb-6">
            Have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
