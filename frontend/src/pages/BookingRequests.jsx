import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function BookingRequests() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await apiClient.get('/bookings');
            setBookings(response.data.bookings || []);
        } catch (err) {
            console.error('Bookings fetch error:', err);
        }
        setLoading(false);
    };

    return (
        <main className="container">
            <h1>My Booking Requests</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="card">
                            <h3>Flat {booking.flat?.flatNumber}</h3>
                            <p>{booking.flat?.building?.name}</p>
                            <p className={booking.status === 'approved' ? 'text-success' : booking.status === 'rejected' ? 'text-danger' : 'text-warning'}>
                                Status: {booking.status}
                            </p>
                            <p className="text-muted">
                                Requested: {new Date(booking.requestedDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
