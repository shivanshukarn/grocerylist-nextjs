'use client';

import { useState, useEffect } from 'react';

export default function AvatarUpload({ currentAvatar, onUpload }) {
  const [preview, setPreview] = useState(currentAvatar); // Show existing avatar if available
  const [file, setFile] = useState(null);

  useEffect(() => {
    setPreview(currentAvatar); // Update when avatar changes
  }, [currentAvatar]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); // Preview the selected file
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onUpload(data.avatarUrl); // Update the parent component with the new avatar URL
        setPreview(data.avatarUrl); // Update the preview
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full border overflow-hidden">
        {preview ? (
          <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="avatarInput" />
      <label htmlFor="avatarInput" className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
        Choose Image
      </label>
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Upload
      </button>
    </div>
  );
}
