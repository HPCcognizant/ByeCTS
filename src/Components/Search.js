import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import PolicyCard from './Policy'; 
import { FaSearch, FaTimes } from 'react-icons/fa'; 
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); 
    const [policies, setPolicies] = useState([]);
    const [filteredPolicies, setFilteredPolicies] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    // Fetch policies from API
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axios.get("https://localhost:7251/api/Policies");
                setPolicies(response.data);
                setFilteredPolicies(response.data);
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies();
    }, []);

    // Filter policies based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPolicies([]);
            setShowPopup(false);
        } else {
            const results = policies.filter(policy =>
                policy.policy_Name?.toLowerCase().includes(searchTerm.toLowerCase())
            );            
            setFilteredPolicies(results);
            setShowPopup(true);
        }
    }, [searchTerm, policies]);


    // Handle view details action
    const handleViewDetails = (policyId) => {
        navigate(`/policy-details/${policyId}`); // Navigate to details page with Policy ID
      };

    return (
        <div className="w-full px-4">
            <div className="flex items-center gap-3 border border-gray-300 rounded-md p-2 bg-white shadow-md">
                <FaSearch className="text-gray-500" /> {/* Search Icon */}
                <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none bg-transparent"
                />
                {searchTerm && (
                    <FaTimes
                        className="text-gray-500 cursor-pointer"
                        onClick={() => setSearchTerm('')}
                    />
                )}
            </div>

            {showPopup && (
                <div className="absolute bg-white shadow-lg border rounded-md mt-2 p-4 left-0 z-10 w-screen">
                    <div className="flex flex-wrap gap-3">
                        {filteredPolicies.length > 0 ? (
                            filteredPolicies.map((policy, index) => (
                                <PolicyCard
                                    key={index}
                                    policyName={policy.policy_Name}
                                    policyPremium={policy.premiumAmount}
                                    policyId={policy.policyID}
                                    imageUrl={`/img/${policy.policyName}.png`} 
                                    onViewDetails={handleViewDetails} 
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center w-full">No policies found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
