import { Chance } from "chance";
import supertest from "supertest";
import app from "@src/app";

const chance = new Chance();

const registerTest = {
    endpoint: '/users/register',
    data: {
        fName: chance.first(),
        lName: chance.last(),
        email: chance.email(),
        password: chance.word({ length: 8 })
    }
}

const loginTest = {
    endpoint: '/users/login',
    data: {
        email: registerTest.data.email,
        password: registerTest.data.password
    }
}

export function userIntegrationTests() {
    describe('User', () => {
        describe('POST Register', () => {
            test('given a valid data', async () => {
                const response = await supertest(app).post(registerTest.endpoint).send(registerTest.data);

                expect(response.status).toBe(201)
            })

            describe('given an invalid data', () => {
                test('missing field', async () => {
                    const { email, ...invalidData } = registerTest.data;

                    const response = await supertest(app).post(registerTest.endpoint).send(invalidData);

                    expect(response.status).toBe(400)
                })

                test('invalid email', async () => {
                    const invalidData = {
                        ...registerTest.data,
                        email: 'invalidemail'
                    }

                    const response = await supertest(app).post(registerTest.endpoint).send(invalidData);

                    expect(response.status).toBe(400);
                })

                test('password too short', async () => {
                    const invalidData = {
                        ...registerTest.data,
                        password: 'short'
                    }

                    const response = await supertest(app).post(registerTest.endpoint).send(invalidData);

                    expect(response.status).toBe(400);
                })

                test('email in use', async () => {
                    const invalidData = registerTest.data;

                    const response = await supertest(app).post(registerTest.endpoint).send(invalidData);

                    expect(response.status).toBe(409);
                })
            })
        })

        describe('POST Login', () => {
            test('given a valid data', async () => {
                const response = await supertest(app).post(loginTest.endpoint).send(loginTest.data);

                expect(response.status).toBe(204);
            })

            describe('given an invalid data', () => {
                test('missing field', async () => {
                    const { email, ...invalidData } = loginTest.data;

                    const response = await supertest(app).post(loginTest.endpoint).send(invalidData);

                    expect(response.status).toBe(400)
                })

                test('invalid email', async () => {
                    const invalidData = {
                        ...loginTest.data,
                        email: 'invalidemail'
                    }

                    const response = await supertest(app).post(loginTest.endpoint).send(invalidData);

                    expect(response.status).toBe(400);
                })
            })
        })
    })
}