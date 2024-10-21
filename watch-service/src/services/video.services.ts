import { db } from '../db/db';

export const findVideoById = async (video_id: string) => {
  return db.video.findUnique({
    where: { id: video_id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const findAllVideos = async () => {
  return db.video.findMany();
};