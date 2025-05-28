// src/UploadComponent.js
import { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import PropTypes from 'prop-types';
import './OrderForm.css';



function UploadComponent({ user }) {
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploads, setUploads] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) fetchUploads();
    }, [user]);

    const fetchUploads = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            alert('Error fetching uploads: ' + error.message);
        } else {
            setUploads(data);
        }
    };

    const handleUpload = async () => {
        // Ensure at least one file (image or video) is selected and the title is entered
        if (!imageFile && !videoFile) {
            alert('Please select at least an image or a video to upload.');
            return;
        }
        if (!title) {
            alert('Please enter a title.');
            return;
        }

        setUploading(true);

        let imageUrl = '';
        if (imageFile) {
            const imageFileName = `${Date.now()}_${imageFile.name}`;
            const { error: imageError } = await supabase.storage
                .from('product-images')
                .upload(imageFileName, imageFile);

            if (imageError) {
                alert('Image upload failed: ' + imageError.message);
                setUploading(false);
                return;
            }

            imageUrl = `https://folvsieyeswhknngwpvg.supabase.co/storage/v1/object/public/product-images/${imageFileName}`;
        }

        let videoUrl = '';
        if (videoFile) {
            const videoFileName = `${Date.now()}_${videoFile.name}`;
            const { error: videoError } = await supabase.storage
                .from('product-videos')
                .upload(videoFileName, videoFile);

            if (videoError) {
                alert('Video upload failed: ' + videoError.message);
                setUploading(false);
                return;
            }

            videoUrl = `https://folvsieyeswhknngwpvg.supabase.co/storage/v1/object/public/product-videos/${videoFileName}`;
        }

        const { error: dbError } = await supabase.from('products').insert({
            title,
            image_url: imageUrl,
            video_url: videoUrl,
        });

        if (dbError) {
            alert('Failed to insert into database: ' + dbError.message);
        } else {
            alert('Upload successful!');
            setTitle('');
            setImageFile(null);
            setVideoFile(null);
            fetchUploads();
        }

        setUploading(false);
    };

    const handleDelete = async (id, imageUrl, videoUrl) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;

        const imagePath = imageUrl?.split('/product-images/')[1];
        const videoPath = videoUrl?.split('/product-videos/')[1];

        if (imagePath) {
            await supabase.storage.from('product-images').remove([imagePath]);
        }
        if (videoPath) {
            await supabase.storage.from('product-videos').remove([videoPath]);
        }

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Failed to delete record: ' + error.message);
        } else {
            alert('Deleted successfully.');
            fetchUploads();
        }
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <h2>Upload New Product</h2>

            <label><strong>Select Image (required):</strong></label><br />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /><br /><br />

            <label><strong>Select Video (optional):</strong></label><br />
            <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} /><br /><br />

            <label><strong>Enter Title or Description:</strong></label><br />
            <textarea
                placeholder="Enter details of product,title or description"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={5}
                style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    resize: 'vertical',
                    marginTop: '8px',
                    marginBottom: '20px'
                }}
            /><br />

            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            <hr style={{ margin: '30px 0' }} />

            <h2>Uploaded Items</h2>
            {uploads.length === 0 ? (
                <p>No uploads yet.</p>
            ) : (
                uploads.map((item) => (
                    <div key={item.id} style={{ marginBottom: '20px' }}>
                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                width="200"
                                style={{ borderRadius: '8px', marginBottom: '10px' }}
                            />
                        )}
                        {item.video_url && (
                            <video
                                width="320"
                                height="240"
                                controls
                                style={{ borderRadius: '8px', marginBottom: '10px' }}
                            >
                                <source src={item.video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        <p><strong>{item.title}</strong></p>
                        <button onClick={() => handleDelete(item.id, item.image_url, item.video_url)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
}

UploadComponent.propTypes = {
    user: PropTypes.object,
};

export default UploadComponent;
