export interface Video {

  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoFile: string | null;
  userId: string;
  createdAt: Date;
}

  
export interface User{
  csrfToken: string;
  email:string;
  password:string;
}

