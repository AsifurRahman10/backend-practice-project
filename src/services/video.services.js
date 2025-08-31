import { Video } from "../models/video.models.js"

export const addVideoOnDB = async (payload) => {
    const data = await Video.create(payload);

    return data
}