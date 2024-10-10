'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VideoUploadForm from '@/app/components/VideoUploaderForm';

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload a New Video</h1>
      <VideoUploadForm />
    </div>
  );
}

