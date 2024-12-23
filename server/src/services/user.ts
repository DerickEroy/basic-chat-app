import * as types from "@common/types";
import { UserModel } from "@models/user";

export async function register(body: types.RegisterUserDTO): Promise<types.User> {
    const user = new UserModel({
        ...body,
        auth: { password: body.password }
    });

    await user.save();

    return user.toObject();
}