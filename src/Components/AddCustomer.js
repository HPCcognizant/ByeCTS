import React, { useState, useContext } from "react";
import axios from "axios"; // Import axios for API calls
import { StoreContext } from "../services/StoreContext"; // Import StoreContext for token management
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
 
const AddCustomer = () => {
    const { token } = useContext(StoreContext); // Access token from StoreContext
    const [formData, setFormData] = useState({
        customer_Name: "",
        customer_Phone: "",
        customer_Address: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate for redirection
 
    // Validation function
    const validate = () => {
        let tempErrors = {};
 
        // Customer Name validation
        if (!formData.customer_Name.trim()) {
            tempErrors.customer_Name = "Customer Name is required!";
        } else if (!/^[A-Za-z ]+$/.test(formData.customer_Name)) {
            tempErrors.customer_Name = "Customer Name can only contain alphabets!";
        }
 
        // Customer Phone validation
        if (!formData.customer_Phone || isNaN(formData.customer_Phone)) {
            tempErrors.customer_Phone = "Valid Phone Number is required!";
        }
 
        // Customer Address validation
        if (!formData.customer_Address.trim()) {
            tempErrors.customer_Address = "Customer Address is required!";
        }
 
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
 
    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
 
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        if (!validate()) return;
 
        try {
            const response = await axios.post("https://localhost:7251/api/Customers", formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                },
            });
 
            setMessage("Customer added successfully!");
            setFormData({
                customer_Name: "",
                customer_Phone: "",
                customer_Address: "",
            }); // Reset form fields
            setErrors({});
            navigate("/Dashboard"); // Redirect to Dashboard after successful addition
        } catch (error) {
            console.error("Backend Error Response:", error.response);
            if (error.response && error.response.data) {
                const backendMessage = error.response.data.message || "Customer phone number already exists. Please use a different phone number.";
                setMessage(backendMessage);
                setErrors({ customer_Phone: backendMessage });
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }
        }
    };
 
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-lg font-bold mb-4 text-center">Enter Customer Details</h2>
                {message && <p className={`text-center ${message.startsWith("Customer phone") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
               
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="customer_Name"
                        placeholder="Customer Name"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.customer_Name}
                        required
                    />
                    {errors.customer_Name && <p style={{ color: "red" }}>{errors.customer_Name}</p>}
 
                    <input
                        type="number"
                        name="customer_Phone"
                        placeholder="Customer Phone"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.customer_Phone}
                        required
                    />
                    {errors.customer_Phone && <p style={{ color: "red" }}>{errors.customer_Phone}</p>}
 
                    <input
                        type="text"
                        name="customer_Address"
                        placeholder="Customer Address"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.customer_Address}
                        required
                    />
                    {errors.customer_Address && <p style={{ color: "red" }}>{errors.customer_Address}</p>}
 
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                        Add Customer
                    </button>
                </form>
            </div>
        </div>
    );
};
 
export default AddCustomer;