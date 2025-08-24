import mongoose from "mongoose"
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
    const oldUser = await User.findById(id).select('avatar');
    const user = await User.findByIdAndUpdate(id,
        {
            avatar: {
                url: uploadImage?.url,
                publicId: uploadImage?.public_id
            }
        },
        { new: true }
    ).select('-password')
    if (oldUser?.avatar?.public_id) {
        await deleteOldImage(oldUser.avatar.public_id);
    }
    return user
}

const deleteOldImage = async (publicId) => {
    if (!publicId) {
        throw new ApiError(400, "no public key found")
    }
    await cloudinary.uploader.destroy(publicId);
}

export const updateCoverImage = async (id, uploadImage) => {
    const user = await User.findByIdAndUpdate(id,
        {
            coverImage: {
                url: uploadImage?.url,
                publicId: uploadImage?.public_id
            }
        },
        { new: true }
    ).select('-password')
    await deleteOldImage(user?.coverImage?.public_id)
    return user
}


export const userProfileInfo = async (username, id) => {
    const profile = await User.aggregate([
        // get the document from database
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        // get info of who sub me
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber"
            }
        },
        // get info of whom i subscriber
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        // find count
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscriber"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [id, "$subscriber.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        // take only selective field
        {
            $project: {
                username: 1,
                fullName: 1,
                subscriberCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }



    ])

    return profile
}

export const getUserWatchHistory = async (id) => {
    const data = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }

                        }
                    }

                ]
            }
        }
    ])
    console.log(data, 'data');
    return data
}