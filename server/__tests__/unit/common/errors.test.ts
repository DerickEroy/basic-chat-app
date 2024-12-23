import mongoose from "mongoose";
import { InternalError, ValidationError, transformMongooseValidationError, transformMongoServerError } from "@common/errors";

describe('COMMON Errors', () => {
    describe('transformMongooseValidationError', () => {
        it('should convert to validation error if given a mongoose validation error', () => {
            const validationError = new mongoose.Error.ValidationError();
            const validatorError = new mongoose.Error.ValidatorError({
                message: 'required',
                type: 'required',
                path: 'email',
                value: undefined,
                reason: undefined
            });
            const castError = new mongoose.Error.CastError('Boolean', 123, 'email');
            castError.message = 'must be a boolean';
            validationError.addError('email', validatorError);
            validationError.addError('auth.isAdmin', castError);
            
            const result = transformMongooseValidationError(validationError);
    
            expect(result).toBeInstanceOf(ValidationError);
            expect(result.toObject()).toMatchObject({
                name: 'ValidationError',
                isOperational: true,
                cause: [
                    {
                        path: ['email'],
                        value: undefined,
                        message: 'required'
                    },
                    {
                        path: ['auth', 'isAdmin'],
                        value: 123,
                        message: 'must be a boolean'
                    }
                ]
            });
        });
    });
    
    describe('transformMongoServerError', () => {
        it('should convert to duplicate error if given a mongo server error', () => {
            const serverError = new mongoose.mongo.MongoServerError({});
            serverError.keyValue = { email: 'example@mail.com' };
            serverError.code = 11000;
    
            const result = transformMongoServerError(serverError);
            
            expect(result).toMatchObject({
                name: 'DuplicateError',
                isOperational: true,
                cause: [{
                    path: ['email'],
                    value: 'example@mail.com'
                }]
            });
        });
    
        it('should convert to internal error if error code is not handled', () => {
            const serverError = new mongoose.mongo.MongoServerError({});
            serverError.code = -777;
    
            const result = transformMongoServerError(serverError);
    
            expect(result).toBeInstanceOf(InternalError);
        });
    });
});