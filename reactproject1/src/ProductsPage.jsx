// src/ProductsPage.jsx
import { useEffect, useState } from 'react';
import supabase from './supabaseClient';

function ProductsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error.message);
        } else {
            setProducts(data);
        }
    };

    return (
        <div className="px-4 py-8 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                Available Dry Fruits
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-500">No products available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center transition hover:shadow-lg"
                            >
                                {/* Title and Description at the top */}
                                <h3 className="product-title">{product.title}</h3>
                                <p className="product-description">{product.description}</p>

                                <div className="product-media w-full">
                                    {product.image_url && (
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-full h-48 sm:h-56 object-cover rounded-md mb-4"
                                        />
                                    )}
                                    {product.video_url && (
                                        <video controls className="w-full rounded-md mb-4">
                                            <source src={product.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>

                                <a
                                    href="https://wa.me/93793283133"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-order-btn mt-auto"
                                >
                                    Contact to Order
                                </a>
                            </div>
                        ))}

                </div>
            )}

            {/* Contact Us Section */}
            <div className="mt-12 bg-gray-100 rounded-xl p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">📞 Contact Us</h2>
                <p className="mb-4 text-sm sm:text-base">
                    Have questions or want to place an order? Reach out to us:
                </p>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                    <li>
                        <strong>📧 Email:</strong>{' '}
                        <a href="mailto:greenpointafghanistan@gmail.com" className="text-blue-600 hover:underline break-words">
                            greenpointafghanistan@gmail.com
                        </a>
                    </li>
                    <li>
                        <strong>📱 WhatsApp:</strong>{' '}
                        <a href="tel:+93793283133" className="text-blue-600 hover:underline">
                            +93793283133
                        </a>
                    </li>
                    <li><strong>📍 Address:</strong> Kabul, Afghanistan</li>
                </ul>
            </div>
        </div>
    );
}

export default ProductsPage;
