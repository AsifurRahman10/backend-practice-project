import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"


export const updateUserPassword = async (oldPassword, newPassword, id) => {
    const user = await User.findById(id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "invalid password")
    }

    user.password = newPassword
    await user.save();
    return true
}

export const updateUserProfile = async (id, fullName, email) => {
    const user = await User.findByIdAndUpdate(id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select('-password')
    return user
}

export const updateAvatarImage = async (id, uploadImage) => {
    const user = await User.findByIdAndUpdate(id,
        { avatar: uploadImage?.url },
        { new: true }
    ).select('-password')
    return user
}

export const updateCoverImage = async (id, uploadImage) => {
    const user = await User.findByIdAndUpdate(id,
        { coverImage: uploadImage?.url },
        { new: true }
    ).select('-password')
    return user
}


export const userProfileInfo = async (username) => {
    const profile = await User.aggregate([
        // get the document from database
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        // get info


    ])
} 