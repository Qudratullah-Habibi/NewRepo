import { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import emailjs from 'emailjs-com'; // ✅ Added for EmailJS

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmingOrderId, setConfirmingOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setOrders(data);
        }
        setLoading(false);
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm('Are you sure you want to delete this order?');
        if (!confirmDelete) return;

        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) {
            alert('Failed to delete order: ' + error.message);
        } else {
            setOrders(orders.filter((order) => order.id !== id));
        }
    }

    async function handleConfirm(order) {
        setConfirmingOrderId(order.id);
        try {
            const { email, name, product_id, quantity, id } = order;

            const templateParams = {
                to_name: name,
                to_email: email,
                product_name: product_id,
                quantity: quantity,
                order_id: id,
            };

            const response = await emailjs.send(
                'service_n3z3slf',     // 🔁 Replace with your actual service ID
                'template_ssuxxyc',    // 🔁 Replace with your template ID
                templateParams,
                'ewaP-3x7cHUHAAaV8'      // 🔁 Replace with your public key from EmailJS
            );

            console.log('Email sent!', response.status, response.text);
            alert('Confirmation email sent successfully!');
        } catch (err) {
            console.error('Email error:', err);
            alert('Error sending confirmation email: ' + err.message);
        } finally {
            setConfirmingOrderId(null);
        }
    }

    return (
        <div className="app">
            <div className="container">
                <div className="section">
                    <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                        Orders Management
                    </h2>

                    {loading && <p>Loading orders...</p>}
                    {error && <p className="error-text">{error}</p>}
                    {!loading && orders.length === 0 && <p>No orders found.</p>}

                    {!loading && orders.length > 0 && (
                        <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#e6fffa' }}>
                                    <th style={headerCellStyle}>Name</th>
                                    <th style={headerCellStyle}>Email</th>
                                    <th style={headerCellStyle}>Phone</th>
                                    <th style={headerCellStyle}>Product ID</th>
                                    <th style={headerCellStyle}>Quantity</th>
                                    <th style={headerCellStyle}>Message</th>
                                    <th style={headerCellStyle}>Date</th>
                                    <th style={headerCellStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={bodyCellStyle}>{order.name}</td>
                                        <td style={bodyCellStyle}>{order.email}</td>
                                        <td style={bodyCellStyle}>{order.phone}</td>
                                        <td style={bodyCellStyle}>{order.product_id}</td>
                                        <td style={bodyCellStyle}>{order.quantity}</td>
                                        <td style={bodyCellStyle}>{order.message || '-'}</td>
                                        <td style={bodyCellStyle}>
                                            {new Date(order.created_at).toLocaleString()}
                                        </td>
                                        <td style={bodyCellStyle}>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="logout-button"
                                                style={{ padding: '6px 10px', marginRight: '5px', marginBottom: '4px' }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleConfirm(order)}
                                                disabled={confirmingOrderId === order.id}
                                                className="confirm-button"
                                                style={{
                                                    padding: '6px 6px',
                                                    backgroundColor: confirmingOrderId === order.id ? '#9ae6b4' : '#2f855a',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: confirmingOrderId === order.id ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                {confirmingOrderId === order.id ? 'Confirming...' : 'Confirm'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const headerCellStyle = {
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '2px solid #2f855a',
    color: '#2f855a',
    fontWeight: '600',
};

const bodyCellStyle = {
    padding: '10px 8px',
    fontSize: '0.95rem',
    color: '#333',
};

export default AdminOrders;
