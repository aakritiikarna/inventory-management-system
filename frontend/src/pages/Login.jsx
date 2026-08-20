import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        email,
        password,
      }
    );

    if (data.success) {
      localStorage.removeItem("pos-token");
      localStorage.removeItem("pos-user");

      login(data.user, data.token);

      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } else {
      setError(data.message);
    }
  } catch (err) {
    console.log(err);

    if (err.response) {
      setError(err.response.data.message);
    } else {
      setError("Unable to connect to server.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen
      bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800"
    >
      <h1 className="text-4xl font-bold text-white mb-8">
        Inventory Management System
      </h1>

      <div className="bg-white shadow-2xl rounded-xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 border border-red-300 rounded p-2 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;