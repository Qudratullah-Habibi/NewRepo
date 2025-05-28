// ImageGallery.js

import React from 'react';
import { storage } from './firebase.config';  // Import Firebase storage

const ImageGallery = () => {
    const deleteImage = (imagePath) => {
        const storageRef = storage.ref(imagePath);

        storageRef
            .delete()
            .then(() => {
                console.log('File deleted successfully');
                // Optionally update UI or remove the image from the display
            })
            .catch((error) => {
                console.error('Error deleting file:', error);
            });
    };

    return (
        <div>
            {/* Example image path, replace with dynamic paths from your database */}
            <button onClick={() => deleteImage('images/product1.jpg')}>Delete Image</button>
        </div>
    );
};

export default ImageGallery;

