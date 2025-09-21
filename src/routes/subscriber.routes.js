import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controlles.js";

const router = Router();

router.use(verifyJwt)

router.route('/subscriber/:subscriberId').get(getSubscribedChannels)
router.route('/subscribe/:channelId').post(toggleSubscription)
router.route('/channels/:channelId').get(getUserChannelSubscribers)

export default router
