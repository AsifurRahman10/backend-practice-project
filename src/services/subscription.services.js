import mongoose from "mongoose"
import { Subscription } from "../models/subscription.models.js"

export const getUserSubscriptionService = async (subscriptionId) => {
    console.log(subscriptionId);
    const result = await Subscription.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(subscriptionId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [{
                    $project: {
                        username: 1,
                        fullName: 1,
                        avatar: 1,
                    }
                }]
            }
        },
        {
            $addFields: {
                channel: { $first: "$channel" }
            }
        },
        {
            $facet: {
                data: [{ $match: {} }],
                totalCount: [{ $count: "count" }]
            }
        }
    ]);
    return result
}

export const subscriptionService = async (channelId, subscriberId) => {
    // check if user already subscribed to the channel
    const isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId   // check by both
    });
    if (isSubscribed) return isSubscribed;

    // if not subscribed, create a new subscription
    const newSubscription = await Subscription.create({
        channel: channelId,
        subscriber: subscriberId   // <-- must add this
    });
    return newSubscription;
};


export const getUserChannelService = async (channelId) => {
    const result = await Subscription.find({ channel: channelId }).populate('subscriber', "username fullName avatar")
    return result
        .filter(sub => sub.subscriber)
        .map(sub => ({
            _id: sub._id,
            username: sub.subscriber?.username,
            fullName: sub.subscriber?.fullName,
            avatar: sub.subscriber.avatar?.url || null
        }));
}