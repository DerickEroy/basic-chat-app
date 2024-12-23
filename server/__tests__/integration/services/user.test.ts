import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { register } from "@services/user";

describe('SERVICES User', () => {
    describe('register', () => {
        it('should return a new user document if given a valid request body', async () => {
            const validBody = {
                fName: 'User',
                lName: 'Register',
                email: 'userregistertest@email.com',
                password: 'password@123'
            }
            
            const result = await register(validBody);
            const isPasswordHashed = bcrypt.compareSync(validBody.password, result.auth.password);

            expect(result).toMatchObject({
                fName: 'User',
                lName: 'Register',
                email: 'userregistertest@email.com',
                auth: {
                    // password already hashed
                    role: 'user',
                    sessionToken: null
                }
            });
            expect(isPasswordHashed).toBe(true);
        });

        it('should throw a mongoose validation error if given an invalid request body', async () => {// missing lName and password too short
            const invalidBody = {
                fName: 'User',
                email: 'userregistertest@email.com',
                password: 'short'
            }

            await expect(register(invalidBody as any)).rejects.toThrow(mongoose.Error.ValidationError);
        });
    });
});