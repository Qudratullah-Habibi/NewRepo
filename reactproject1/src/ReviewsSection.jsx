// src/ReviewsSection.jsx
import { useState, useEffect } from 'react';

import supabase from './supabaseClient';

function ReviewsSection() {

    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error.message);
        } else {
            setReviews(data);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async () => {
        if (!name || !comment) {
            alert('fill_fields');
            return;
        }

        setLoading(true);
        const { error } = await supabase.from('reviews').insert([
            { name, comment, rating }
        ]);

        if (error) {
            alert('failed_to_submit' + ': ' + error.message);
        } else {
            alert('thanks_feedback');
            setName('');
            setComment('');
            setRating(5);
            fetchReviews();
        }

        setLoading(false);
    };

    return (
        <div style={{ marginTop: 40 }}>
            <h2>{'Reviews'}</h2>

            <div style={{ marginBottom: 30 }}>
                <input
                    type="text"
                    placeholder={'name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <textarea
                    placeholder={'comment'}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <div style={{ marginBottom: '10px' }}>
                    <label>{'Rating'}: </label>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                                fontSize: 24,
                                cursor: 'pointer',
                                color: (hoverRating || rating) >= star ? '#f39c12' : '#ccc'
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'submitting' : 'submit'}
                </button>
            </div>

            {reviews.length === 0 ? (
                <p>{'no_reviews'}</p>
            ) : (
                reviews.map((r) => (
                    <div key={r.id} style={{ borderBottom: '1px solid #ccc', marginBottom: 20, paddingBottom: 10 }}>
                        <p><strong>{r.name}</strong></p>
                        <p style={{ color: '#f39c12' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                        <p>{r.comment}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default ReviewsSection;
