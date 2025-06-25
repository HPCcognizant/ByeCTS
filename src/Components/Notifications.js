import React, { useState, useEffect } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const user = await fetch('https://localhost:7251/api/Customers/GetCustomerById', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure the token is included
                    }
                });
                const userData = await user.json();
                const response = await fetch(`https://localhost:7251/api/Notifications?id=${userData.customer_ID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Notifications fetched successfully:', data);
                    setNotifications(data); // Assuming the response is an array of notifications
                } else {
                    console.error('Failed to fetch notifications:', response.status, response.statusText);
                    setError('Failed to fetch notifications');
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('An error occurred while fetching notifications');
            }
        };

        fetchNotifications();
        
    }, []);

    return (
        <div className="p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-center">Notifications</h2>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            <div className="h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification.notificationID} className="bg-blue-100 p-4 rounded-md mb-4 shadow-md">
                            <h3 className="text-blue-800 font-bold">Notification</h3>
                            <p className="text-blue-600">{notification.message}</p>
                            <p className="text-gray-600 text-sm">{new Date(notification.datasent).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-center">No notifications available</p>
                )}
            </div>
        </div>
    );
};

export default Notifications;