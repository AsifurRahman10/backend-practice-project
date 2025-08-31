import { Tweet } from "../models/tweet.models.js"


export const addTweet = async (payload) => {
    await Tweet.create(payload)
    return true
}