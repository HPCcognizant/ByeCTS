import React, { useState } from 'react';
import axios from 'axios';

const RenewPolicy = ({ customerId, policyID, pendingAmount, onRenewSuccess }) => {
    const [error, setError] = useState(''); // State to store backend error messages

    const handleRenewPolicy = async () => {
        try {
            const response = await axios.put( // Changed to PUT based on potential backend requirements
                `https://localhost:7251/api/CustomerPolicies/UpdateTheRenewDate?customerId=${customerId}&policyId=${policyID}`,
                {}, // Empty body since the parameters are passed in the URL
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                alert("Policy renewed successfully!");
                setError(''); // Clear previous errors
                onRenewSuccess(); // Callback to refresh policies or update UI
            } else {
                const backendMessage = response.data?.message || "Failed to renew policy. Please try again later.";
                setError(backendMessage);
            }
        } catch (error) {
            console.error("Error renewing policy:", error);
            const backendMessage = error.response?.data || "An unexpected error occurred while renewing the policy.";
            setError(backendMessage); // Set backend error message or fallback
        }
    };

    return (
        <div className="flex flex-col items-start">
            <div className="flex items-center justify-between w-full">
                <p className="text-gray-700">
                    <span className="font-semibold">Pending Amount:</span> ₹{pendingAmount}
                </p>
                <button
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                    onClick={handleRenewPolicy}
                >
                    Renew
                </button>
            </div>
            {error && (
                <p className="text-red-600 mt-2 text-sm">
                    {error} {/* Display backend error message */}
                </p>
            )}
        </div>
    );
};

export default RenewPolicy;