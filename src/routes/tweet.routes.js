import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from '../controllers/tweet.controllers.js'
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJwt)

router.route('/').post(createTweet)
router.route('/').get(getUserTweets)
router.route('/').patch(updateTweet)
router.route('/').delete(deleteTweet)

export default router