import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export default function Billing() {
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentData, setPaymentData] = useState({ bkashNumber: '', transactionId: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await apiClient.get('/bills/my-bills');
            setBills(response.data.bills || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bills');
        }
        setLoading(false);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/payments', {
                bill: selectedBill._id,
                amount: selectedBill.totalAmount,
                bkashNumber: paymentData.bkashNumber,
                transactionId: paymentData.transactionId,
            });
            alert('Payment submitted for verification!');
            setSelectedBill(null);
            setPaymentData({ bkashNumber: '', transactionId: '' });
            fetchBills();
        } catch (err) {
            alert(err.response?.data?.message || 'Payment failed');
        }
    };

    return (
        <main className="container">
            <h1>My Bills</h1>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="grid">
                        {bills.map((bill) => (
                            <div key={bill._id} className="card">
                                <h3>{bill.month}/{bill.year}</h3>
                                <p>Rent: ৳{bill.rent}</p>
                                <p>Utilities: ৳{bill.utilities}</p>
                                <p>Service: ৳{bill.serviceCharge}</p>
                                <p className="text-primary"><strong>Total: ৳{bill.totalAmount}</strong></p>
                                <p className={bill.status === 'paid' ? 'text-success' : 'text-danger'}>
                                    Status: {bill.status}
                                </p>
                                {bill.status === 'pending' && (
                                    <button className="btn btn-primary" onClick={() => setSelectedBill(bill)}>Pay Now</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {selectedBill && (
                        <div className="modal-overlay" onClick={() => setSelectedBill(null)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>Pay Bill - ৳{selectedBill.totalAmount}</h2>
                                <form onSubmit={handlePayment}>
                                    <div className="form-group">
                                        <label>bKash Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={paymentData.bkashNumber}
                                            onChange={(e) => setPaymentData({ ...paymentData, bkashNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Transaction ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={paymentData.transactionId}
                                            onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit Payment</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedBill(null)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
