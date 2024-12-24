import bcrypt from "bcryptjs";
import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";
import type { User, RegisterUserDTO, LoginUserDTO } from "@common/types";

export async function registerUseCase(body: RegisterUserDTO, model: typeof UserModel): Promise<User> {
    const existingUser = await model.findOne({ email: body.email });

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

    const user = new model({
        ...body,
        auth: { password: body.password }
    });

    await user.validate();

    user.hashPassword();

    await user.save();

    return user.toObject();
}

export async function loginUseCase(body: LoginUserDTO, model: typeof UserModel): Promise<string> {
    const user = await model.findOne({ email: body.email });

    if (!user) {
        throw new AppError({
            message: 'User could not found',
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

    await user.save();

    return token;
}