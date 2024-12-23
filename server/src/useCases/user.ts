import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";
import bcrypt from "bcryptjs";
import type { User, RegisterUserDTO, LoginUserDTO } from "@common/types";

export async function registerUseCase(body: RegisterUserDTO): Promise<User> {
    const existingUser = await UserModel.findOne({ email: body.email });

    if (existingUser) {
        throw new AppError({
            message: 'Email already in use',
            statusCode: 409,
            isOperational: true,
            cause: [{
                path: ['email'],
                value: body.email
            }]
        });
    }

    const user = new UserModel({
        ...body,
        auth: { password: body.password }
    });

    user.hashPassword();

    return user.toObject();
}

export async function loginUseCase(body: LoginUserDTO): Promise<string> {
    const user = await UserModel.findOne({ email: body.email });

    if (!user) {
        throw new AppError({
            message: 'User not found',
            statusCode: 404,
            isOperational: true,
            cause: [{
                path: ['email'],
                value: body.email
            }]
        });
    }

    const isPasswordCorrect = bcrypt.compareSync(body.password, user.auth.password);

    if (!isPasswordCorrect) {
        throw new AppError({
            message: 'Incorrect password',
            statusCode: 403,
            isOperational: true,
            cause: [{
                path: ['password'],
                value: body.password
            }]
        });
    }

    const token = user.createSessionToken();

    return token;
}