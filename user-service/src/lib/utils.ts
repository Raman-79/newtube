import { db } from '../db/db';

export async function addVideoToDB(originalUrl: string, title: string, description: string, userId: string): Promise<string> {
  try {
   const data = await db.video.create({
      data: {
        userId: '271b0106-526c-4799-af1f-f78a1796c7d3',
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
