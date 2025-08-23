import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError"


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