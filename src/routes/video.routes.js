import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controllers.js";
import { updatePublishService } from "../services/video.services.js";

const router = Router();

router.use(verifyJwt);

router.route('/').post(
    upload.fields([
        {
            name: 'videoFile',
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]), publishAVideo
)
router.route('/videos').get(verifyJwt, getAllVideos)
router.route('/:videoId').get(verifyJwt, getVideoById);
router.route('/:videoId').patch(
    upload.single('thumbnail'),
    updateVideo
)
router.route('/:videoId').delete(verifyJwt, deleteVideo);
router.route('/publish/:videoId').patch(verifyJwt, togglePublishStatus);

export default router