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
router.route('/avatar').upload.single('avatar').patch(verifyJwt, updateAvatar)
router.route('/cover-image').upload.single('/coverImage').patch(verifyJwt, updateCoverImage)
router.route('/profile/:username').get(verifyJwt, getUserProfile)
router.route('/watch-history').get(verifyJwt, getWatchHistory)
export default router 