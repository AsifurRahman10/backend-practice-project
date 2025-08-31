import { Tweet } from "../models/tweet.models.js"


export const addTweet = async ({ id, content }) => {
    const payload = {
        owner: id,
        content: content
    }
    await Tweet.create(payload)
    return true
}

export const getUserTweet = async (id) => {
    const data = await Tweet.find({ owner: id }).populate("owner", "email");
    return data
}