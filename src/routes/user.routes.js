import { Router } from "express";
import { changePassword, getCurrentUser, getUserProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateUserInfo } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    , registerUser)
router.route('/login').post(loginUser)


// secured route
router.route('/logout').post(verifyJwt, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJwt, changePassword)
router.route('/current-user').get(verifyJwt, getCurrentUser)
router.route('/update-user').patch(verifyJwt, updateUserInfo)
router.route('/avatar').patch(verifyJwt, upload.single('avatar'), updateAvatar)
router.route('/cover-image').patch(verifyJwt, upload.single('/coverImage'), updateCoverImage)
router.route('/profile/:username').get(getUserProfile)
router.route('/watch-history').get(verifyJwt, getWatchHistory)
export default router 