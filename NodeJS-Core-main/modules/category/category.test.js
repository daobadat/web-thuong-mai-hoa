const request = require('supertest');
const app = require('../../index');

describe('Category Module Integration Tests', () => {
  it('should fetch category list successfully', async () => {
    const res = await request(app).get('/categories');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch category detail by ID', async () => {
    const categoryId = 'b0000000-0000-0000-0000-000000000001'; // Hoa Sinh Nhật from seeders
    const res = await request(app).get(`/categories/${categoryId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', categoryId);
  });
});
