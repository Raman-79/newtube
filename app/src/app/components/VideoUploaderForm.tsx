'use client';


//TODO: Add file size check which should be 1GB only
import { useState, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

//NOTE: Make this dynamic to have only 100 requests
const CHUNK_SIZE = 5 * 1024 * 1024;

interface UploadPart{
  ETag:string;
  PartNumber:number;
}
export default function VideoUploadForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null as File | null,
    thumbnail: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file: File) => {
    try {
      // Step 1: Initiate multipart upload
      const initiateResponse = await fetch('http://localhost:8080/upload/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          userId: 'user-id', // Replace with actual user ID from your auth system
        }),
      });

      if (!initiateResponse.ok) throw new Error('Failed to initiate upload');
      
      const { uploadId, key } = await initiateResponse.json();

      // Step 2: Upload parts
      const parts: UploadPart[] = [];
      const chunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let partNumber = 1; partNumber <= chunks; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Create form data for this chunk
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId',uploadId);
        formData.append('partNumber', partNumber.toString()); // Strings are expected for form data
        formData.append('key', key);
        
        const uploadPartResponse = await fetch('http://localhost:8080/upload/upload-part', {
          method: 'POST',
          body: formData,
        });


        if (!uploadPartResponse.ok) {
          await fetch('http://localhost:8080/upload/abort',{
            method:'POST',
            body:JSON.stringify({
              uploadId,
              key
            })
          })
          .then(()=>{alert('Error in upload a specific part of the video')});
          throw new Error(`Failed to upload part ${partNumber}`);
        }
        else{
        const { ETag } = await uploadPartResponse.json();
        parts.push({ ETag, PartNumber: partNumber });
        // Update progress
        setUploadProgress((partNumber / chunks) * 100);
        }
      }

      // Step 3: Complete multipart upload
      const completeResponse = await fetch('http://localhost:8080/upload/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId,
          key,
          parts,

        }),
      });

      if (!completeResponse.ok) throw new Error('Failed to complete upload');

      return await completeResponse.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.videoFile) {
        throw new Error('No video file selected');
      }

      // Upload video file
      const uploadResult = await uploadFile(formData.videoFile);

      // Upload thumbnail if exists
      let thumbnailLocation = null;
      if (formData.thumbnail) {
        const thumbnailResult = await uploadFile(formData.thumbnail);
        thumbnailLocation = thumbnailResult.location;
      }

      //  video metadata to database
      // uploadResult.location and thumbnailLocation

      router.push('/');
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Video File</label>
        <input
          type="file"
          accept="video/*"
          required
          className="mt-1 block w-full"
          onChange={(e) => setFormData({
            ...formData,
            videoFile: e.target.files ? e.target.files[0] : null,
          })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          className="mt-1 block w-full"
          onChange={(e) => setFormData({
            ...formData,
            thumbnail: e.target.files ? e.target.files[0] : null,
          })}
        />
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Upload Video'}
      </button>
    </form>
  );
}