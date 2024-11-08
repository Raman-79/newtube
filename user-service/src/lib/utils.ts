import { db } from '../db/db';

export async function addVideoToDB(originalUrl: string, title: string, description: string, userId: string): Promise<string> {
  try {
   const data = await db.video.create({
      data: {
        
        userId: 'ada2a70f-0eff-48c4-bcd2-973aa91086b2',
        title,
        description,
        url: originalUrl,
      },

    });
    return data.id;
  } catch (err) {
    console.error("Error adding video to DB:", err);
    return '';
  }
}
