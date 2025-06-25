return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Your Profile</h2>
        {message && <p className="text-green-600 text-center mb-6 text-lg font-medium">{message}</p>}
        {error && <p className="text-red-600 text-center mb-6 text-lg font-medium">{error}</p>}

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: User Profile Details */}
            <div className="lg:w-1/3 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                {/* ...existing code... */}
            </div>

            {/* Right Column: Assigned Policies */}
            <div className="lg:w-2/3 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">My Policies</h3>

                <div className="text-center mb-6">
                    <button
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
                        onClick={togglePolicies}
                    >
                        {showPolicies ? 'Hide My Policies' : 'View My Policies'}
                    </button>
                </div>

                {showPolicies && (
                    <div className="mt-6">
                        {policies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {policies.map((policy) => {
                                    const customerPolicy = policy.customerPolicies?.[0]; // Only take the first entry

                                    return (
                                        <div key={policy.policyID} className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl border border-indigo-200">
                                            <h4 className="text-xl font-bold text-indigo-800 mb-3">{policy.policy_Name}</h4>
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-semibold">Premium:</span> ₹{policy.premiumAmount}
                                            </p>
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-semibold">Coverage:</span> {policy.coverageDetails}
                                            </p>
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-semibold">Validity:</span> {policy.validityPeriod}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Insured Value:</span> {policy.issuredValue}
                                            </p>

                                            {customerPolicy ? (
                                                <>
                                                    <p className="text-gray-700 mb-2">
                                                        <span className="font-semibold">Start Date:</span> {customerPolicy.startDate}
                                                    </p>
                                                    <p className="text-gray-700 mb-2">
                                                        <span className="font-semibold">End Date:</span> {customerPolicy.endDate}
                                                    </p>
                                                    <p className="text-gray-700 mb-2">
                                                        <span className="font-semibold">Renew Date:</span> {customerPolicy.renewDate}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Pending Amount:</span> {customerPolicy.pendingPAmount}
                                                        </p>
                                                        <button
                                                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                                                            onClick={() => handleRenew(policy.policyID)}
                                                        >
                                                            Renew
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-gray-500 mt-4 italic">No specific customer policy details available for this general policy.</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center text-lg mt-8">No policies assigned to your account yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
);

// Add the handleRenew function
const handleRenew = async (policyID) => {
    try {
        const response = await axios.post(`https://localhost:7251/api/Policies/RenewPolicy`, { policyID }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        setMessage("Policy renewed successfully!");
    } catch (error) {
        console.error('Error renewing policy:', error);
        setError("Failed to renew policy. Please try again later.");
    }
};
