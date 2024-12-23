import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { register } from "@services/user";

describe('SERVICES User', () => {
    describe('register', () => {
        it('should return a new user document if given a valid request body', async () => {
            const body = {
                fName: 'User',
                lName: 'Register',
                email: 'userregistertest@email.com',
                password: 'password@123'
            }

            const result = await register(body);
            const isPasswordHashed = bcrypt.compareSync(body.password, result.auth.password);

            expect(result).toMatchObject({
                fName: 'User',
                lName: 'Register',
                email: 'userregistertest@email.com',
                auth: {
                    // password already hashed
                    isAdmin: false,
                    sessionToken: null
                }
            });
            expect(isPasswordHashed).toBe(true);
        });

        it('should throw a mongoose validation error if given an invalid request body', async () => {
            try {
                // missing lName and password too short
                const invalidBody = {
                    fName: 'User',
                    email: 'userregistertest@email.com',
                    password: 'short'
                }
    
                await register(invalidBody as any);
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
            }
        });
    });
});