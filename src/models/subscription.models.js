import mongoose, { Schema } from "mongoose"

const SubscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //the subscriber 
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, //the channel to subscribe
        ref: "User"
    }

}, {
    timestamps: true
})

export const Subscription = mongoose.model("Subscription", SubscriptionSchema)