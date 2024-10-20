import { Request, Response } from "express";
import { db } from '../db/db';

export async function getVideoById(req: Request, res: Response) {
  try {
    const { video_id } = req.params;
    const data = await db.video.findUnique({
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
    
    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "No video found" });
    }
  } catch (err) {
    console.error("Error fetching video by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllVideos(req: Request, res: Response) {
  try {
    const data = await db.video.findMany();
    res.status(200).json({ data });
  } catch (err) {
    console.error("Error fetching all videos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
