"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoById = getVideoById;
exports.getAllVideos = getAllVideos;
const db_1 = require("../db/db");
function getVideoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { video_id } = req.params;
            const data = yield db_1.db.video.findUnique({
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
            }
            else {
                res.status(404).json({ message: "No video found" });
            }
        }
        catch (err) {
            console.error("Error fetching video by ID:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function getAllVideos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield db_1.db.video.findMany();
            res.status(200).json({ data });
        }
        catch (err) {
            console.error("Error fetching all videos:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
