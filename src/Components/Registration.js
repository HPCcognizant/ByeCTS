import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    alphabet: false,
    number: false,
    specialChar: false,
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();
 
  const validate = useCallback(() => {
    const tempErrors = {};
    const { username, email, password } = formData;
 
    // Username validation
    if (!username.trim()) {
      tempErrors.username = "Full Name is required!";
    } else if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(username)) {
      tempErrors.username = "Username must start with an alphabet and can contain alphanumeric characters and underscores.";
    }
 
    // Email validation
    if (!email.trim()) {
      tempErrors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Invalid email format!";
    }
 
    // Password validation
    if (!password.trim()) {
      tempErrors.password = "Password is required!";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long!";
    } else if (!/[A-Za-z]/.test(password)) {
      tempErrors.password = "Password must contain at least one letter!";
    } else if (!/[0-9]/.test(password)) {
      tempErrors.password = "Password must contain at least one number!";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      tempErrors.password = "Password must contain at least one special character!";
    }
 
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [formData]);
 
  const handlePasswordChange = useCallback((password) => {
    setFormData((prevFormData) => ({ ...prevFormData, password }));
 
    // Update password validation status
    setPasswordValidation({
      length: password.length >= 6,
      alphabet: /[A-Za-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, []);
 
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "password") {
      handlePasswordChange(value);
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  }, [handlePasswordChange]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
 
    try {
      const response = await axios.post("https://localhost:7251/register", formData);
      setMessage("Registration Successfully");
      setFormData({ username: "", email: "", password: "" });
      setErrors({});
      navigate("/Login");
    } catch (error) {
      console.error("Backend Error Response:", error.response);
      if (error.response && error.response.data) {
        const backendMessage = error.response.data || "An error occurred during registration.";
        setMessage(`${backendMessage}`);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-lg font-bold mb-4 text-center">Register</h2>
        {message && <p className={`text-center ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="User Name"
            className="w-full px-4 py-2 border rounded-md"
            onChange={handleChange}
            value={formData.username}
            required
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
 
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            onChange={handleChange}
            value={formData.email}
            required
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
 
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md"
            onFocus={() => setShowInstructions(true)}
            onBlur={() => setShowInstructions(false)}
            onChange={handleChange}
            value={formData.password}
            required
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
 
          {showInstructions && (
            <div className="text-sm mt-2">
              <p style={{ color: passwordValidation.length ? "green" : "red" }}>At least 6 characters</p>
              <p style={{ color: passwordValidation.alphabet ? "green" : "red" }}>At least one letter</p>
              <p style={{ color: passwordValidation.number ? "green" : "red" }}>At least one number</p>
              <p style={{ color: passwordValidation.specialChar ? "green" : "red" }}>At least one special character (@,#,$)</p>
            </div>
          )}
 
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default RegistrationForm;