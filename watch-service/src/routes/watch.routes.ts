import {Router} from 'express';
import {getAllVideos,getVideoById} from '../controllers/watch.controller';

const router = Router();
router.get('/video-id',getVideoById);
router.get('/',getAllVideos)
export default router;