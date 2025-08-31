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

export const updateUserTweet = async (updatedContent, id) => {
    const data = await Tweet.findByIdAndUpdate(id, {
        $set: {
            content: updatedContent,
        },

    }, { new: true })
    return data
}
export const deleteUserTweet = async (id) => {
    const data = await Tweet.deleteOne(id)
    return data
}