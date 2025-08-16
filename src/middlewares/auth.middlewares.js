import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'


export const verifyJwt = asyncHandler(async (req, _, next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace('Bearer ', '');
    if (!token) {
        throw new ApiError(400, "Unauthorized access")
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decode?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(400, "Unauthorized access")
    }

    req.user = user;
    next()
})