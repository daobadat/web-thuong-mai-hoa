const request = require('supertest');
const app = require('../../index');

describe('Auth Module Integration Tests', () => {
  const testUser = {
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123',
    full_name: 'Test Jest User',
    phone: '0988776655',
  };

  let token = '';

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('should fail login with invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
  });

  it('should get current user profile using JWT token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });
});
