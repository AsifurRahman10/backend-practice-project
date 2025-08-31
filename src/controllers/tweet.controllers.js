import { addTweet } from "../services/tweet.services.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    /* 
    1.get the tweet content
    2. get user info (req)
    3.save all the info to DB
    */

    const { content } = req.body;
    const id = req?.user?._id;
    if (!content && !id) {
        throw new ApiError(400, "Content required")
    }
    const newTweet = await addTweet({ userId, content });

    if (!newTweet) {
        throw new ApiError(500, "Failed to save tweet");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newTweet, "Tweet has been saved"));

})

export const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

export const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

export const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})
