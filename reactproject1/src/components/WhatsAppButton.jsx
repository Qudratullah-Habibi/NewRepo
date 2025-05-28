import { FaWhatsapp } from 'react-icons/fa';

function WhatsAppButton() {
    const phoneNumber = '+93700123456'; // Change this to your actual WhatsApp number

    const handleClick = () => {
        const message = encodeURIComponent("Hello! I'm interested in your dry fruits.");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50"
            aria-label="Contact us on WhatsApp"
        >
            <FaWhatsapp size={24} />
        </button>
    );
}

export default WhatsAppButton;
