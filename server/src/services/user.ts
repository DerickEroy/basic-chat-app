import * as types from "@common/types";
import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";

export async function register(body: types.RegisterUserDTO): Promise<types.User> {
    const user = new UserModel({
        ...body,
        auth: { password: body.password }
    });

    await user.save();

    return user.toObject();
}

export async function login(body: types.LoginUserDTO): Promise<string> {
    const user = await UserModel.findOne({ email: body.email }).orFail(() =>{
        throw new AppError({
            message: 'User not found',
            isOperational: true,
            cause: [{
                path: ['email'],
                value: body.email
            }]
        });
    });

    const token = user.createSessionToken();

    return token;
}