'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AvatarUpload() {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      
      await fetch('/api/users/avatar', {
        method: 'PUT',
        body: JSON.stringify({ avatar: data.secure_url })
      });
      
      await update({ avatar: data.secure_url });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <img 
        src={session?.user?.avatar || '/default-avatar.png'} 
        className="w-16 h-16 rounded-full"
        alt="Avatar"
      />
      <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
        {loading ? 'Uploading...' : 'Change Avatar'}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}