import { addTweet, deleteUserTweet, getUserTweet, updateUserTweet } from "../services/tweet.services.js";
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
    if (!content || !id) {
        throw new ApiError(400, "Content required")
    }
    const newTweet = await addTweet({ id, content });

    if (!newTweet) {
        throw new ApiError(500, "Failed to save tweet");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newTweet, "Tweet has been saved"));

})

export const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    /*
        1. need user id
        2. with that user id we need to find by id in DB
    */
    const id = req.user._id
    if (!id) {
        throw new ApiError(401, "Authentication error")
    }
    const userTweet = await getUserTweet(id)
    if (!userTweet) {
        throw new ApiError(500, "Failed to save tweet");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, userTweet, "User tweets has been retrieved"));
})

export const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { id, updatedContent } = req.body;
    if (!id) {
        throw new ApiError(401, "Need tweet id to update the tweet")
    }
    const updatedTweet = await updateUserTweet(updatedContent, id)
    if (!updatedTweet) {
        throw new ApiError(500, "Failed to update tweet");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, updatedTweet, "Tweet updated successfully"));
})

export const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const id = req.body;
    if (!id) {
        throw new ApiError(401, "Need tweet id to delete the tweet")
    }
    const deletedTweet = await deleteUserTweet(id)
    if (!deletedTweet) {
        throw new ApiError(500, "Failed to delete tweet");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, deletedTweet, "Tweets has been deleted"));
})
