import { getUserChannelService, getUserSubscriptionService, subscriptionService, } from "../services/subscription.services.js"
import { ApiError } from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscriberId = req.user.id;
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(401, "Channel ID not provided")
    }
    const result = await subscriptionService(channelId, subscriberId)
    res.status(201).json(new ApiResponse(201, result, 'Subscription toggled'))

})

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(401, "channel ID not provided")
    }
    const result = await getUserChannelService(channelId)
    res.status(201).json(new ApiResponse(201, result, 'Channel subscribers retrieve'))
})

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(401, "Subscription ID not provided")
    }
    const result = await getUserSubscriptionService(subscriberId)
    res.status(201).json(new ApiResponse(201, result, 'Subscriber retrieve'))
})