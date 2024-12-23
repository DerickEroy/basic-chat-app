import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@src/common/config";
import { User } from "@src/common/types";

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
            password: {
                type: String,
                cast: 'must be a string',
                required: [true, 'required'],
                minLength: [8, 'too short']
            },
            role: {
                type: String,
                enum: ['user', 'admin'],
                cast: 'must be a string',
                default: 'user'
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

/** Hashes the password if document is new or password is modified */
userSchema.pre('save', function(next) {
    if (this.isDirectModified('auth.password') || this.isNew) {
        this.auth.password = bcrypt.hashSync(this.auth.password);
    }

    next();
});

/** Sets and returns the session token property */
userSchema.method('createSessionToken', async function() {
    const token = jwt.sign({ role: this.auth.role }, SECRET_KEY, { expiresIn: '24h', subject: this.id });

    this.auth.sessionToken = token;

    await this.save();

    return token;
});

export const UserModel = mongoose.model("User", userSchema);