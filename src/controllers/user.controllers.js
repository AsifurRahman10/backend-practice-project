import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeUploadedFiles, uploadImageOnCloud } from "../utils/fileUploader.js";
import jwt from 'jsonwebtoken'


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
}


export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;
    console.log({ username, email, fullName, password });
    if ([username, email, fullName, password].some(field => field?.trim() === '')) {
        throw new ApiError(400, 'All field is required')
    }
    const userAlreadyExist = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userAlreadyExist) {
        removeUploadedFiles(req.files)
        throw new ApiError(409, 'User already exist')
    }
    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    } else {
        removeUploadedFiles(req.files);
        throw new ApiError(400, 'Avatar is required');
    }


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
            username: username.toLowerCase(), email: email.toLowerCase(), fullName, password, avatar: uploadAvatar.url, coverImage: uploadCoverImage?.url || '',
        }
    )

    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong')
    }
    res.status(201).json(new ApiResponse(201, createdUser, 'User created successfully'))
})

export const loginUser = asyncHandler(async (req, res) => {
    /*
    steps 
    1.get data
    2. verify data with user name or email
    3. find the user in db
    4.check the password
    5. generate access token refresh token
    6.send cookies
    */

    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new ApiError(404, "username or email required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(401, "This user is not register")
    }
    const isPasswordMatch = await user.isPasswordCorrect(password)
    if (!isPasswordMatch) {
        throw new ApiError(401, "User unauthorized")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    const option = {
        httpOnly: true,
        secure: true,
    }

    res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            })
        )

})

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined,

            }
        },
        { new: true }
    )

    const option = {
        httpOnly: true,
        secure: true,
    }
    res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(
        new ApiResponse(200, {}, "Logout successfully")
    )
})

export const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, 'unauthorized access')
    }

    try {
        const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decodeToken?._id)

        if (!user) {
            throw new ApiError(401, 'access token expired')
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'access token expired')
        }

        const { accessToken, newRefreshToken } = generateAccessTokenAndRefreshToken(user?._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(200, { accessToken, newRefreshToken }, "Access token updated")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "something went wrong")
    }
}



