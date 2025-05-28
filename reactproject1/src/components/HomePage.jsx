// HomePage.jsx
import { motion } from 'framer-motion';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

function HomePage() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-white py-10 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <motion.h1
                    className="text-5xl md:text-6xl font-extrabold text-green-800 mb-6"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Welcome to Greenpoint Afghanistan
                </motion.h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
                    Premium quality Afghan dry fruits exported with care and excellence. Explore our delicious range!
                </p>
            </div>
        </div>
    );
}

export default HomePage;
