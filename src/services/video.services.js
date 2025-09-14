import { Video } from "../models/video.models.js"

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
    const video = Video.findById(videoId)
    return video
}