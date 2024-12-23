import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const userSchema = new mongoose.Schema({
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
            isAdmin: {
                type: Boolean,
                cast: 'must be a boolean',
                default: false
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

userSchema.pre('save', function(next) {
    if (this.isDirectModified('auth.password') || this.isNew) {
        this.auth.password = bcrypt.hashSync(this.auth.password);
    }

    next();
});

export const UserModel = mongoose.model("User", userSchema);