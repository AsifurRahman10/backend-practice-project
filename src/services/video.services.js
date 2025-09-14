import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js";
import { removeUploadedFilesCloud, uploadImageOnCloud } from "../utils/fileUploader.js";

export const addVideoOnDB = async (payload) => {
    const data = await Video.create(payload);
    return data
}

export const fetchVideo = async ({ search,
    userId,
    sortBy = "createdAt",
    sortType = "desc",
    page,
    limit
}) => {
    const match = {}
    if (search) match.title = { $regex: search, $options: 'i' }
    if (userId) match.owner = userId

    const aggregate = Video.aggregate().match(match);

    const sortField = sortBy && sortBy.trim() ? sortBy : "createdAt";
    const sort = { [sortField]: sortType === "asc" ? 1 : -1 };


    const options = {
        page,
        limit,
        sort: { sort },
    };

    const result = await Video.aggregatePaginate(aggregate, options)
    return result
}

export const getVideoByID = async (videoId) => {
    // const video = await Video.findById(videoId).populate('owner', 'name username fullName, avatar,')
    const video = await Video.findById(videoId).populate('owner', 'name username fullName avatar');
    return video
}




export const updateVideoService = async ({ videoId, userId, body, file }) => {
    const video = await getVideoByID(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== userId) throw new ApiError(403, "Unauthorized");

    const updateData = {};
    ["title", "description"].forEach(f => {
        if (body[f] !== undefined) updateData[f] = body[f];
    });

    // Handle new thumbnail
    if (file) {
        const uploaded = await uploadImageOnCloud(file.path);
        if (!uploaded) throw new ApiError(500, "Thumbnail upload failed");

        updateData.thumbnail = uploaded;

        // Delete old thumbnail
        if (video.thumbnail?.public_id) {
            await removeUploadedFilesCloud(video.thumbnail.public_id);
        }
    }

    const result = await Video.findByIdAndUpdate(videoId, updateData, { new: true })
    return result;

}


export const deleteVideoService = async ({ videoId, userId }) => {
    const video = await getVideoByID(videoId);
    if (!video) throw new ApiError(404, "Video not found");
    if (video.owner.toString() !== userId) throw new ApiError(403, "Unauthorized");

    const deleteVideo = await Video.deleteOne({ _id: videoId })
    return deleteVideo
}

export const updatePublishService = async ({ videoId, userId, updateStatus }) => {
    const video = await getVideoByID({ _id: videoId });
    if (!video) throw new ApiError(404, "Video not found");
    // if (video.owner.toString() !== userId) throw new ApiError(403, "Unauthorized");

    const update = await Video.updateOne({ _id: videoId }, { $set: { isPublished: updateStatus } }, { new: true })
    return update
}