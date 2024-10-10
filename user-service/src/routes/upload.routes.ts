import { Router } from 'express';
import multer from 'multer';
import {
  initiateMultipartUpload,
  uploadPart,
  completeMultipartUpload,
  abortMultipartUpload,
} from '../controllers/upload.controller';
//import { authenticateUser } from '../middleware/auth'; // You'll need to create this

const router = Router();
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per chunk
  }
});

// Protect all routes with authentication
//router.use(authenticateUser);

// Upload routes
router.post('/initialize',upload.none(),initiateMultipartUpload);
router.post('/upload-part', upload.single('chunk'), uploadPart);
router.post('/complete', completeMultipartUpload);
router.post('/abort', abortMultipartUpload);

export default router;