const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBeDefined();
    })

    test('returns correct userId value', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBe("1");
    })

    test('returns message "Valid User"', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.message).toBe("Valid User"); 
    })

    test('response content type is json', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toMatch(/json/);
    })
})

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('response has error message "Invalid User"', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe("Invalid User");
    })

    test('does not return userId on invalid input', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined();
    })

    test('invalid when username too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'usr',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('invalid when username has disallowed characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'User!name',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('invalid when password missing number or uppercase', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'password',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('invalid when password contains special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password1!',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('invalid when email is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(400)
    })

    test('invalid when username is missing', async () => {
        const response = await request(app).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('invalid when password is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })
})