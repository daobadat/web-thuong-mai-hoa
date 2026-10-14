const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../database/models');

describe('Auth API', () => {
  beforeAll(async () => {
    // You might want to sync db here if using a test database
  });

  afterAll(async () => {
    // Close connection so jest doesn't hang
    await sequelize.close();
  });

  describe('POST /api/auth/login', () => {
    it('should return 422 for invalid credentials payload', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email' });
      
      expect(response.status).toBe(422);
    });

    it('should return 401 for wrong credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
    });
  });
});
