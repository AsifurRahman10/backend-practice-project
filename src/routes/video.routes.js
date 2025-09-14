import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { getAllVideos, publishAVideo } from "../controllers/video.controllers.js";

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

export default router