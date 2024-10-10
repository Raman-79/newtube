"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_controller_1 = require("../controllers/upload.controller");
//import { authenticateUser } from '../middleware/auth'; // You'll need to create this
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per chunk
    }
});
// Protect all routes with authentication
//router.use(authenticateUser);
// Upload routes
router.post('/initialize', upload.none(), upload_controller_1.initiateMultipartUpload);
router.post('/upload-part', upload.single('chunk'), upload_controller_1.uploadPart);
router.post('/complete', upload_controller_1.completeMultipartUpload);
router.post('/abort', upload_controller_1.abortMultipartUpload);
exports.default = router;
