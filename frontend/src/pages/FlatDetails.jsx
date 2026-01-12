import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../hooks/useAuth';

export default function FlatDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [flat, setFlat] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');

    useEffect(() => {
        fetchFlat();
    }, [id]);

    useEffect(() => {
        if (flat) {
            getPrediction();
        }
    }, [flat]);

    const fetchFlat = async () => {
        try {
            const response = await apiClient.get(`/flats/${id}`);
            setFlat(response.data.data.flat);
        } catch (err) {
            setError('Flat not found');
            console.error('Flat fetch error:', err);
        }
        setLoading(false);
    };

    const getPrediction = async () => {
        try {
            const response = await apiClient.post('/predict/flat-price', {
                bedrooms: flat.bedrooms,
                bathrooms: flat.bathrooms,
                area: flat.area,
                floor: flat.floor,
                location: flat.buildingId?.address || 'Dhaka',
            });
            setPrediction(response.data.data.prediction);
        } catch (err) {
            console.error('Prediction error:', err);
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            setBookingMessage('Please login to book a flat');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        try {
            const response = await apiClient.post('/bookings', {
                flatId: id,
                message: 'I am interested in this flat',
                requestedDate: new Date(),
            });
            setBookingMessage('Booking request submitted! Admin will review shortly.');
        } catch (err) {
            setBookingMessage(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <main className="container"><p>Loading...</p></main>;
    if (error) return <main className="container"><p className="alert alert-error">{error}</p></main>;
    if (!flat) return <main className="container"><p>Flat not found</p></main>;

    return (
        <main className="container">
            <div className="card">
                <h1>Flat {flat.flatNumber}</h1>
                <h3>{flat.buildingId?.name || 'Building'}</h3>
                <p>{flat.buildingId?.address}</p>

                <div className="grid" style={{ marginTop: '20px', gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                        <p><strong>Type:</strong> {flat.flatType === 'bachelor' ? 'Bachelor' : 'Family'}</p>
                        <p><strong>Bedrooms:</strong> {flat.bedrooms}</p>
                        <p><strong>Bathrooms:</strong> {flat.bathrooms}</p>
                        <p><strong>Washrooms:</strong> {flat.washrooms || flat.bathrooms}</p>
                        <p><strong>Area:</strong> {flat.area} sq ft</p>
                        <p><strong>Floor:</strong> {flat.floor}</p>
                        <p><strong>Orientation:</strong> {flat.orientation || 'N/A'}</p>
                        <p><strong>Balconies:</strong> {flat.balconies || 0}</p>
                        <p><strong>Kitchens:</strong> {flat.kitchens || 1}</p>
                    </div>
                    <div>
                        <p className="text-primary"><strong>Monthly Rent:</strong> ৳{flat.rent}/month</p>
                        {prediction && (
                            <div className="alert alert-success">
                                <strong>AI Predicted Price:</strong> ৳{prediction.estimatedRent}/month<br />
                                <small>Range: ৳{prediction.range?.min} - ৳{prediction.range?.max}</small><br />
                                <small>Confidence: {prediction.confidence}</small>
                            </div>
                        )}
                        <p className={flat.status === 'available' ? 'text-success' : 'text-danger'}>
                            <strong>Status:</strong> {flat.status === 'available' ? 'Available' : flat.status === 'occupied' ? 'Occupied' : 'Maintenance'}
                        </p>
                        {bookingMessage && <div className="alert alert-info">{bookingMessage}</div>}
                        <button
                            className="btn btn-primary"
                            onClick={handleBooking}
                            disabled={flat.status !== 'available'}
                        >
                            {flat.status === 'available' ? 'Book Now' : 'Not Available'}
                        </button>
                    </div>
                </div>

                {flat.amenities?.length > 0 && (
                    <>
                        <h3>Amenities</h3>
                        <ul>
                            {flat.amenities.map((amenity, i) => <li key={i}>{amenity}</li>)}
                        </ul>
                    </>
                )}

                {flat.description && (
                    <>
                        <h3>Description</h3>
                        <p>{flat.description}</p>
                    </>
                )}
            </div>
        </main>
    );
}
