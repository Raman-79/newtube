'use client';
import {
  CredentialsSignInButton,
  GoogleSignInButton,
} from "@/app/components/authButtons";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/app/components/credentialsForm";
import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import VideoGrid from './components/VideoGrid';
import { Video } from './types'; 

export default function Home() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
 
  // Simulate fetching videos from an API
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      
      // Simulate a delay to fetch data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Replace this with an actual API call
      const fetchedVideos: Video[] = [
        // Mock video data
        { id: '1', title: 'Sample Video 1', url: '/videos/video1.mp4',userId:'a',thumbnailUrl:'https://imgs.search.brave.com/rx0dLeTj3qEkw-U2DAc23Y7YwHPBiPhLiZVSCdxKXp4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c3BvcnRwaG90b2dh/bGxlcnkuY29tL2Nv/bnRlbnQvaW1hZ2Vz/L2Ntc2ZpbGVzL3By/b2R1Y3QvMzIzNzIv/MzMwNTEtbGlzdC5q/cGc' },
        { id: '2', title: 'Sample Video 2', url: '/videos/video2.mp4', userId:'b',thumbnailUrl:'https://imgs.search.brave.com/Ap07XFYcZKzicSa3l1uLsgCtcGZizJlyupm7vRMvuDc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9vY2Mt/MC0xOTEtMjQzMy4x/Lm5mbHhzby5uZXQv/ZG5tL2FwaS92Ni9R/czAwbUtDcFJ2cmts/M0haQU41S3dFTDFr/cEUvQUFBQUJhdkR5/Z2tqUGp3dGtDV05m/UGdpdE1KV2lEOUZ6/UGJ5NXNGQ09takZE/V3VhVHZJVTU4QlRR/ekhUVjhzbmd0SVR6/R1ZkOFV6bUwteEZi/VDl3NjJ4bzI3TTV1/RFgyUnFoRU1PdzVu/OWI5NHNicDdwaXhr/N2hpVm1mS1V6S0c0/M2hHTWV1VHlRajNQ/S3JWWGMwaEY2bVdM/Zi1nTXNGem1QYi1E/a29BN3F1VWYzVU9y/aUk4MmN1RnBtRDBj/UFRrU2Q0WUVyYy1a/U0M2bnhrcmhqYTJS/aktKbUlNTDRqODBD/T0VKcEtfLWM0SC00/TFVSMy1Hb2pkQmJr/Vk92Ri1Mc2RVVHNE/SGIxTU1UdnI2YVgw/WGQ3MVUtSm1qUVhh/X05vOWJndENBMXVG/MDdsbFdaQ3ZvakRW/dVJQVFJFZlNEREty/SW4tQktXNFJXallU/WVAwWXUxYlJhdXVU/Zk14dGdtbmVFbzRv/QldBQWpqZk1xb25N/UnBNaURHMXkxazhH/bUFyUWRuZGNVbW9G/T0J1bnBLVEppck5k/ekZEQ1NnV1lLdGZ4/U1BVallCU1FmSGh0/dkNEUHcuanBnP3I9/YWY2' },
        { id: '3', title: 'Sample Video 3', url: '/videos/video3.mp4', userId:'c',thumbnailUrl:'https://imgs.search.brave.com/yPr3h5CZIOSU7EIuVnglKSDuwKZbCV-TaozBDd1FTBQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM3/MDkyOTM3Ny9waG90/by9jbG9zZS11cC1v/Zi1jb21wdXRlci1w/cm9ncmFtbWVyLWNv/ZGluZy5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9dmxvQkhr/d0I4azVfWUszTXRf/NUJvbG50VG1qUnFP/Z2tBSzUzMXlzM2hr/bz0' }
      ];
      
      setVideos(fetchedVideos); // Update state with the fetched videos
      setLoading(false); // Set loading to false once videos are fetched
    };

    fetchVideos();
  }, []); // Empty dependency array to run only on component mount

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Video Platform</h1>

      {!session ? (
       <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
       <div className="flex flex-col items-center mt-10 p-10 shadow-md">
         <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>
         <GoogleSignInButton />
         <span className="text-2xl font-semibold text-white text-center mt-8">
           Or
         </span>
         <CredentialsSignInButton />
         <CredentialsForm />
       </div>
     </div>
      ) : (
        
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}
