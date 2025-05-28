import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import './OrderForm.css';

// Import the image from src/assets/images
import dryfruitBasket from './assets/images/dryfruit-basket.png';

export default function PlaceOrder({ isAdmin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        productId: '',
        quantity: 1,
        message: '',
    });

    const [status, setStatus] = useState({ error: '', success: '', loading: false });
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
        if (isAdmin) fetchOrders();
    }, [isAdmin]);

    async function fetchProducts() {
        const { data, error } = await supabase.from('products').select('id, title');
        if (!error) {
            setProducts(data);
        } else {
            console.error('Error fetching products:', error.message);
        }
    }

    async function fetchOrders() {
        setLoadingOrders(true);
        const { data, error } = await supabase
            .from('orders')
            .select()
            .order('id', { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setOrders(data);
        }
        setLoadingOrders(false);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function validate() {
        const { name, email, phone, productId, quantity } = formData;
        if (!name || !email || !phone || !productId) {
            setStatus({ error: 'Please fill in all required fields.', success: '', loading: false });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+\-\s()]{7,}$/;

        if (!emailRegex.test(email)) {
            setStatus({ error: 'Invalid email format.', success: '', loading: false });
            return false;
        }

        if (!phoneRegex.test(phone)) {
            setStatus({ error: 'Invalid phone number.', success: '', loading: false });
            return false;
        }

        if (quantity < 1) {
            setStatus({ error: 'Quantity must be at least 1.', success: '', loading: false });
            return false;
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: false });

        if (!validate()) return;

        setStatus({ loading: true, error: '', success: '' });

        const { error } = await supabase.from('orders').insert([
            {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                product_id: formData.productId.trim(),
                quantity: formData.quantity,
                message: formData.message.trim(),
            },
        ]);

        if (error) {
            setStatus({ error: 'Failed to place order. Try again.', success: '', loading: false });
        } else {
            setStatus({ success: 'Order placed successfully!', error: '', loading: false });
            setFormData({
                name: '',
                email: '',
                phone: '',
                productId: '',
                quantity: 1,
                message: '',
            });
            if (isAdmin) fetchOrders();
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this order?')) return;
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (!error) fetchOrders();
    }

    return (
        <div className="order-container">
            <div className="form-side">
                <h2>Place Your Order</h2>

                {status.error && <p className="error-msg">{status.error}</p>}
                {status.success && <p className="success-msg">{status.success}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder=" "
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="name">Name *</label>
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email *</label>
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder=" "
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="phone">Phone *</label>
                    </div>

                    <div className="form-group">
                        <select
                            name="productId"
                            id="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Product --</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.title} (ID: {product.id})
                                </option>
                            ))}
                        </select>
                        <label htmlFor="productId">Select Product *</label>
                    </div>

                    <div className="form-group">
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            placeholder=" "
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="quantity">Quantity *</label>
                    </div>

                    <div className="form-group">
                        <textarea
                            name="message"
                            id="message"
                            placeholder=" "
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                        />
                        <label htmlFor="message">Message (optional)</label>
                    </div>

                    <button type="submit" disabled={status.loading}>
                        {status.loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>

                {isAdmin && (
                    <div className="order-list" style={{ marginTop: '30px', color: 'white' }}>
                        <h2>Recent Orders</h2>
                        {loadingOrders ? (
                            <p>Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            <ul>
                                {orders.map((order) => (
                                    <li key={order.id} style={{ marginBottom: '15px' }}>
                                        <strong>{order.name}</strong> | {order.email} | {order.phone}
                                        <br />
                                        Product: {order['product-id']}, Qty: {order.quantity}
                                        <br />
                                        {order.message && <em>{order.message}</em>}
                                        <br />
                                        <button
                                            style={{
                                                backgroundColor: '#e74c3c',
                                                borderRadius: '8px',
                                                padding: '6px 10px',
                                                marginTop: '5px',
                                                cursor: 'pointer',
                                                border: 'none',
                                                color: 'white',
                                            }}
                                            onClick={() => handleDelete(order.id)}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className="image-side">
                <img src={dryfruitBasket} alt="Dry fruit side visual" />
            </div>
        </div>
    );
}

PlaceOrder.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};
