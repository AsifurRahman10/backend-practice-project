import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        try {
            fs.unlinkSync(localFilePath);
        } catch (e) {
            console.error('Failed to delete file:', e);
        }
        return response;
    } catch (error) {
        try {
            fs.unlinkSync(localFilePath);
        } catch (e) {
            console.error('Failed to delete file:', e);
        }
        return null;
    }
};

const deleteImageFromCloud = async(image)

const removeUploadedFiles = (files) => {
    if (!files) return;
    Object.values(files).forEach(fileArray => {
        fileArray.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('Failed to delete file:', err);
            }
        });
    });
};


export { uploadImageOnCloud, removeUploadedFiles }
