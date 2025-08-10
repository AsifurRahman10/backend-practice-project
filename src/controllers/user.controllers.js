import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeUploadedFiles, uploadImageOnCloud } from "../utils/fileUploader.js";


export const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;
    if ([userName, email, fullName, password].some(field => field?.trim() === '')) {
        throw new ApiError(400, 'All field is required')
    }
    const userAlreadyExist = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (userAlreadyExist) {
        removeUploadedFiles(req.files)
        throw new ApiError(409, 'User already exist')
    }
    const avatarLocalPath = req.files?.avatar[0].path;

    let coverLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverLocalPath = req.files?.coverImage[0]?.path;
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar is required')
    }

    const uploadAvatar = await uploadImageOnCloud(avatarLocalPath)
    let uploadCoverImage
    if (coverLocalPath) {

        uploadCoverImage = await uploadImageOnCloud(coverLocalPath)
    }

    if (!uploadAvatar.url) {
        throw new ApiError(400, 'Server error')
    }

    const user = await User.create(
        {
            userName: userName.toLowerCase(), email: email.toLowerCase(), fullName, password, avatar: uploadAvatar.url, coverImage: uploadCoverImage?.url || '',
        }
    )

    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong')
    }
    res.status(201).json(new ApiResponse(201, createdUser, 'User created successfully'))
})