import { addVideoOnDB, deleteVideoService, fetchVideo, getVideoByID, updatePublishService, updateVideoService } from "../services/video.services.js"
import { ApiError } from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadImageOnCloud } from "../utils/fileUploader.js"

export const getAllVideos = asyncHandler(async (req, res) => {
    const { page, limit, search, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    const result = await fetchVideo({
        search,
        userId,
        sortBy,
        sortType,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    })
    if (!result) {
        throw new ApiError(401, "No videos found")
    }
    res.status(201)
        .json(
            new ApiResponse(201, result, "Video retrieved successfully")
        )
})

export const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const id = req.user._id
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description) {
        throw new ApiError(400, 'All field is required')
    }
    const videoFileLocalPath = req?.files?.videoFile[0]?.path;
    const thumbnailFileLocalPath = req?.files?.thumbnail[0]?.path;

    const uploadVideo = await uploadImageOnCloud(videoFileLocalPath);
    const uploadImage = await uploadImageOnCloud(thumbnailFileLocalPath);
    const duration = uploadVideo?.duration
    const videoFile = {
        url: uploadVideo?.url,
        public_id: uploadVideo?.public_id
    }
    const thumbnail = {
        url: uploadImage?.url,
        public_id: uploadImage?.public_id
    }

    const payload = {
        videoFile, thumbnail, owner: id, title, description, duration
    }


    const postVideo = await addVideoOnDB(payload)
    if (!postVideo) {
        throw new ApiError(401, "Server error")
    }

    res.status(201).json(
        new ApiResponse(201, postVideo, "Video posted successfully")
    )





})

export const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(401, "Video id is not provided")
    }
    const result = await getVideoByID(videoId)
    res
        .status(201).
        json(new ApiResponse(201, result, "video retrieve successfully"))
})

export const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user.id
    //TODO: update video details like title, description, thumbnail
    const result = await updateVideoService({
        videoId,
        userId,
        body: req.body,
        file: req.file
    })
    if (!result) {
        throw new ApiError(401, "Server Error")
    }
    res.status(201)
        .json(new ApiResponse(200, result, 'Video details updated'))

})

export const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req?.params
    const userId = req.user.id
    //TODOj: delete video
    if (!videoId) {
        throw new ApiError(401, "videoID not found")
    }
    const result = await deleteVideoService({ videoId, userId })

    if (result?.deletedCount === 0) {
        throw new ApiError(401, "videoID not found")
    }
    res.status(201)
        .json(
            new ApiResponse(200, result, "Video deleted successfully")
        )

})

export const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user.id
    const { updateStatus } = req.body;
    if (!videoId) {
        throw new ApiError(401, "videoID not found")
    }
    console.log('hit');
    const result = await updatePublishService({ videoId, userId, updateStatus })
    res.status(201)
        .json(
            new ApiResponse(200, result, "Video status has been changed")
        )

})