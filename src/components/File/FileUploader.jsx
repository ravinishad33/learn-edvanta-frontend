// components/FileUploader.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiFile, FiImage, FiVideo, FiTrash2, FiLoader } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FileUploader = ({ 
  type = 'image', 
  onUploadComplete, 
  existingUrl,
  maxSize = 5, // MB
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.mov', '.avi']
  }
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState(existingUrl || '');
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Create preview
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Upload file
    await uploadFile(file);
  }, [type, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    maxFiles: 1,
    disabled: uploading
  });

  const uploadFile = async (file) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await axios.post(`${API_URL}/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setFileUrl(response.data.url);
      if (onUploadComplete) {
        onUploadComplete(response.data.url);
      }

      toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = () => {
    setFileUrl('');
    setPreview(null);
    if (onUploadComplete) {
      onUploadComplete('');
    }
  };

  const getFileIcon = () => {
    if (type === 'image') return <FiImage className="w-12 h-12 text-blue-500" />;
    if (type === 'video') return <FiVideo className="w-12 h-12 text-purple-500" />;
    return <FiFile className="w-12 h-12 text-gray-500" />;
  };

  return (
    <div className="w-full">
      {fileUrl ? (
        <div className="relative">
          {type === 'image' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Uploaded {type === 'image' ? 'Image' : 'Video'}
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
              <img
                src={preview || fileUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-2 text-sm text-gray-500 truncate">
                {fileUrl.split('/').pop()}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileUrl('');
                  setPreview(null);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Change {type === 'image' ? 'Image' : 'Video'}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Uploaded Video
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <FiVideo className="w-16 h-16 text-white mx-auto mb-2" />
                <div className="text-white font-medium">Video Ready</div>
                <div className="text-gray-300 text-sm truncate">
                  {fileUrl.split('/').pop()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFileUrl('')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Change Video
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-3">
              <FiLoader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
              <div className="text-sm font-medium text-gray-700">
                Uploading {progress}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              {getFileIcon()}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700">
                  {isDragActive ? (
                    'Drop the file here'
                  ) : (
                    <>
                      <span className="text-blue-600 hover:text-blue-800">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {type === 'image' ? (
                    <>JPG, PNG, GIF, WEBP (Max {maxSize}MB)</>
                  ) : (
                    <>MP4, WebM, MOV (Max {maxSize}MB)</>
                  )}
                </div>
                {type === 'image' && (
                  <div className="text-xs text-gray-400 mt-1">
                    Recommended: 1280×720px
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;