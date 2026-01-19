import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
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

    const formatCurrency = (value) => `৳${Number(value || 0).toLocaleString()}`;

    const generatePdf = (bill) => {
        const doc = new jsPDF();
        const line = (y) => {
            doc.setDrawColor(230);
            doc.line(15, y, 195, y);
        };

        doc.setFontSize(18);
        doc.text('HouseFit Billing Statement', 15, 20);
        doc.setFontSize(12);
        doc.text(`Month: ${bill.month}/${bill.year || ''}`, 15, 30);
        doc.text(`Status: ${bill.status}`, 15, 38);

        line(42);

        doc.setFontSize(11);
        const rows = [
            ['Rent', bill.rent],
            ['Utilities', bill.utilities],
            ['Service Charge', bill.serviceCharge],
            ['Discount', bill.discount || 0],
        ];

        let y = 50;
        rows.forEach(([label, value]) => {
            doc.text(label, 15, y);
            doc.text(formatCurrency(value), 170, y, { align: 'right' });
            y += 8;
        });

        line(y);
        y += 10;
        doc.setFontSize(13);
        doc.text('Total', 15, y);
        doc.text(formatCurrency(bill.totalAmount), 170, y, { align: 'right' });

        doc.save(`bill-${bill.month}-${bill.year || ''}.pdf`);
    };

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

    const paidCount = bills.filter((b) => b.status === 'paid').length;
    const pendingCount = bills.filter((b) => b.status !== 'paid').length;
    const latestTotal = bills[0]?.totalAmount || 0;

    const statusBadge = (status) => {
        const map = {
            paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
            pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
            unpaid: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
        };
        return map[status] || map.pending;
    };

    return (
        <main className="container py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Billing</h1>
                    <p className="text-gray-600 dark:text-gray-400">View, download, and pay your monthly statements.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold">Pending: {pendingCount}</div>
                    <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 font-semibold">Paid: {paidCount}</div>
                    <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold">Latest Total: {formatCurrency(latestTotal)}</div>
                </div>
            </div>

            {error && <div className="alert alert-error mb-4">{error}</div>}

            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center text-gray-600 dark:text-gray-300">Loading bills...</div>
            ) : bills.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center text-gray-600 dark:text-gray-300">No bills found.</div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {bills.map((bill) => (
                            <div key={bill._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-5 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Billing Month</p>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{bill.month}/{bill.year}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(bill.status)}`}>
                                        {bill.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <p>Rent: {formatCurrency(bill.rent)}</p>
                                    <p>Utilities: {formatCurrency(bill.utilities)}</p>
                                    <p>Service: {formatCurrency(bill.serviceCharge)}</p>
                                    {bill.discount ? <p className="text-emerald-600 dark:text-emerald-300">Discount: -{formatCurrency(bill.discount)}</p> : null}
                                </div>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-300 mt-1">Total: {formatCurrency(bill.totalAmount)}</p>
                                <div className="flex gap-2 mt-2">
                                    <button className="btn btn-secondary btn-sm" onClick={() => generatePdf(bill)}>Download PDF</button>
                                    {bill.status === 'pending' && (
                                        <button className="btn btn-primary btn-sm" onClick={() => setSelectedBill(bill)}>Pay Now</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedBill && (
                        <div className="modal-overlay" onClick={() => setSelectedBill(null)}>
                            <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-2xl font-bold mb-4">Pay Bill - {formatCurrency(selectedBill.totalAmount)}</h2>
                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div className="form-group">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">bKash Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={paymentData.bkashNumber}
                                            onChange={(e) => setPaymentData({ ...paymentData, bkashNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={paymentData.transactionId}
                                            onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="submit" className="btn btn-primary flex-1">Submit Payment</button>
                                        <button type="button" className="btn btn-secondary flex-1" onClick={() => setSelectedBill(null)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
