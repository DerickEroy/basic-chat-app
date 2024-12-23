import supertest from "supertest";
import bcrypt from "bcryptjs";
import app from "@src/app";

describe('API User', () => {
    describe('register', () => {
        it('should respond with 201 status and a new user document if given a valid request body', async () => {
            const body = {
                fName: "User",
                lName: "Register",
                email: "userregistertest@email.com",
                password: "password@123"
            };

            const response = await supertest(app).post("/users/register").send(body);

            const isPasswordHashed = bcrypt.compareSync(body.password, response.body.auth.password);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                fName: "User",
                lName: "Register",
                email: "userregistertest@email.com",
                auth: {
                    // password already hashed
                    isAdmin: false,
                    sessionToken: null
                }
            });
            expect(isPasswordHashed).toBe(true);
        });
    });
});