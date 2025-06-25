


import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from "../services/StoreContext"; // Import StoreContext for token management
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
 
const AddPolicyForm = () => {
    const { token } = useContext(StoreContext); // Access token from StoreContext
    const navigate = useNavigate(); // Initialize useNavigate for redirection
 
    const [formData, setFormData] = useState({
        policy_Name: "",
        issuredValue: "",
        premiumAmount: "",
        coverageDetails: "",
        validityPeriod: "",
        agentID: "",
    });
 
    const [agents, setAgents] = useState([]); // State to store agents fetched from API
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
 
    // Fetch agents from API
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch("https://localhost:7251/api/Agents", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Include token in Authorization header
                    },
                });
 
                if (response.ok) {
                    const agentsData = await response.json();
                    setAgents(agentsData); // Set agents data
                } else {
                    console.error("Failed to fetch agents:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };
 
        fetchAgents();
    }, [token]);
 
    // Validation function
    const validate = (data = formData) => {
        let tempErrors = {};
 
        // Validate Policy Name
        if (!data.policy_Name.trim()) {
            tempErrors.policy_Name = "Policy Name is required!";
        } else if (!/^[A-Za-z]/.test(data.policy_Name)) {
            tempErrors.policy_Name = "Policy Name must start with a letter!";
        } else if (data.policy_Name.trim().length < 3) {
            tempErrors.policy_Name = "Policy Name must have at least 3 characters!";
        }
 
        // Validate Issured Value
        if (!data.issuredValue || isNaN(data.issuredValue)) {
            tempErrors.issuredValue = "Valid Issured Value is required!";
        } else if (data.issuredValue <= 0) {
            tempErrors.issuredValue = "Issured Value must be greater than 0!";
        }
 
        // Validate Premium Amount
        if (!data.premiumAmount || isNaN(data.premiumAmount)) {
            tempErrors.premiumAmount = "Valid Premium Amount is required!";
        } else if (data.premiumAmount < 500) {
            tempErrors.premiumAmount = "Premium Amount must be at least 500!";
        }
 
        // Validate Coverage Details
        if (!data.coverageDetails.trim()) {
            tempErrors.coverageDetails = "Coverage Details are required!";
        }
 
        // Validate Validity Period
        if (!data.validityPeriod.trim()) {
            tempErrors.validityPeriod = "Validity Period is required!";
        }
 
        // Validate Agent ID
        if (!String(data.agentID).trim() || isNaN(data.agentID)) {
            tempErrors.agentID = "Valid Agent ID is required!";
        }
 
        return tempErrors;
    };
 
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
 
        // Validate only the field being updated
        const tempErrors = { ...errors };
 
        switch (name) {
            case "coverageDetails":
                if (!value.trim()) {
                    tempErrors.coverageDetails = "Coverage Details are required!";
                } else {
                    delete tempErrors.coverageDetails; // Remove error if valid
                }
                break;
 
            default:
                break;
        }
 
        setErrors(tempErrors);
    };
 
    // Handle form submission with fetch API
    const handleSubmit = async (e) => {
        e.preventDefault();
        const tempErrors = validate();
        setErrors(tempErrors);
        if (Object.keys(tempErrors).length > 0) return;
 
        try {
            const response = await fetch("https://localhost:7251/api/Policies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                },
                body: JSON.stringify(formData),
            });
 
            const responseData = await response.text(); // Parse plain text response
            console.log("Server Response:", responseData);
 
            if (response.ok) {
                setMessage("Policy added successfully!");
                setFormData({
                    policy_Name: "",
                    issuredValue: "",
                    premiumAmount: "",
                    coverageDetails: "",
                    validityPeriod: "",
                    agentID: "",
                }); // Reset form fields
                setErrors({});
                navigate("/admin/policies"); // Redirect to PolicyFeatch.js (view list)
            } else {
                setMessage(`Error adding policy: ${responseData}`);
            }
        } catch (error) {
            console.error("Error submitting policy:", error);
            setMessage("Error adding policy: " + error.message);
        }
    };
 
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-2/3">
                <h2 className="text-lg font-bold mb-4 text-center">Add Policy</h2>
                {message && <p className={`text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
 
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="policy_Name"
                        placeholder="Policy Name"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.policy_Name}
                        required
                    />
                    {errors.policy_Name && <p style={{ color: "red" }}>{errors.policy_Name}</p>}
 
                    <input
                        type="number"
                        name="issuredValue"
                        placeholder="Issured Value"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.issuredValue}
                        min="1"
                        required
                    />
                    {errors.issuredValue && <p style={{ color: "red" }}>{errors.issuredValue}</p>}
 
                    <input
                        type="number"
                        name="premiumAmount"
                        placeholder="Premium Amount"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.premiumAmount}
                        min="1"
                        required
                    />
                    {errors.premiumAmount && <p style={{ color: "red" }}>{errors.premiumAmount}</p>}
 
                    <textarea
                        name="coverageDetails"
                        placeholder="Enter the coverage details of the policy"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.coverageDetails}
                        rows="5"
                        required
                    />
                    {errors.coverageDetails && <p style={{ color: "red" }}>{errors.coverageDetails}</p>}
 
                    <select
                        name="validityPeriod"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.validityPeriod}
                        required
                    >
                        <option value="" disabled>Select Validity Period</option>
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="half yearly">Half Yearly</option>
                    </select>
                    {errors.validityPeriod && <p style={{ color: "red" }}>{errors.validityPeriod}</p>}
 
                    <select
                        name="agentID"
                        className="w-full px-4 py-2 border rounded-md"
                        onChange={handleChange}
                        value={formData.agentID}
                        required
                    >
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                            <option key={agent.agentID} value={agent.agentID}>
                                {agent.agent_Name} (Id: {agent.agentID})
                            </option>
                        ))}
                    </select>
                    {errors.agentID && <p style={{ color: "red" }}>{errors.agentID}</p>}
 
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                        Add Policy
                    </button>
                </form>
            </div>
        </div>
    );
};
 
export default AddPolicyForm;