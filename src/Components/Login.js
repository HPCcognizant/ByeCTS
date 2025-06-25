import React, { useContext, useState } from "react";
import { StoreContext } from "../services/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from './Loader'; // Import the Loader component

const Login = () => {
  const { login } = useContext(StoreContext);
  const queryParams = new URLSearchParams(window.location.search);
  const redirectUrl = queryParams.get("redirect");
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Add loading state

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts

    try {
      const loginResult = await login(data.username, data.password);

      if (loginResult) {
        toast.success("Login successful!");

        if (loginResult.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (loginResult.role === "Agent") {
          navigate("/agent/dashboard");
        } else if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate("/");
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false); // Set loading to false when login is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <Loader /> // Show loader when loading
      ) : (
        <form
          onSubmit={onLogin}
          className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Your Username"
              value={data.username}
              onChange={onChangeHandler}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your Password"
              value={data.password}
              onChange={onChangeHandler}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
