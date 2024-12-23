import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@src/common/config";
import type { User } from "@src/common/types";

export const userSchema = new mongoose.Schema<User>({
    fName: {
        type: String,
        cast: 'must be a string',
        required: [true, 'required']
    },
    lName: {
        type: String,
        cast: 'must be a string',
        required: [true, 'required']
    },
    email: {
        type: String,
        cast: 'must be a string',
        required: [true, 'required'],
        unique: true
    },
    auth: {
        type: {
            role: {
                type: String,
                enum: ['user', 'admin'],
                cast: 'must be a string',
                default: 'user'
            },
            password: {
                type: String,
                cast: 'must be a string',
                required: [true, 'required'],
                minLength: [8, 'too short']
            },
            sessionToken: {
                type: String,
                cast: 'must be a string',
                default: null
            }
        },
        _id: false,
        required: [true, 'required']
    }
});

/** Sets and returns the hashed version of the password property*/
userSchema.method('hashPassword', async function(salt = 10) {
    const hashedPassword = bcrypt.hashSync(this.auth.password, salt);

    this.auth.password = hashedPassword;

    return hashedPassword;
});

/** Sets and returns the session token property */
userSchema.method('createSessionToken', async function() {
    const sessionToken = jwt.sign({ role: this.auth.role }, SECRET_KEY, { expiresIn: '24h', subject: this.id });

    this.auth.sessionToken = sessionToken;

    return sessionToken;
});

export const UserModel = mongoose.model("User", userSchema);