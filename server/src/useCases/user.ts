import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";
import type { User, RegisterUserDTO, LoginUserDTO } from "@common/types";

export async function registerUseCase(body: RegisterUserDTO): Promise<User> {
    const user = new UserModel({
        ...body,
        auth: { password: body.password }
    });

    await user.save();

    return user.toObject();
}

export async function loginUseCase(body: LoginUserDTO): Promise<string> {
    const user = await UserModel.findOne({ email: body.email }).orFail(() =>{
        throw new AppError({
            message: 'User not found',
            statusCode: 404,
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