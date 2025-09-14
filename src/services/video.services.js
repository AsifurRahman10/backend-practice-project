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
    const filter = {}
    if (search) filter.title = { $regex: search, $options: 'i' }
    if (userId) filter.owner = userId

    // sort
    const sortField = sortBy && sortBy?.trim() ? sortBy : "createdAt"
    const sort = { [sortField]: sortType === 'asc' ? 1 : -1 }
    // pagination
    const skip = (page - 1) * limit

    const videos = await Video.find(filter).sort(sort).skip(skip).limit(limit)
    return videos
}