const request = require('supertest');
const app = require('../../index');

describe('Product Module Integration Tests', () => {
  it('should fetch product list with pagination', async () => {
    const res = await request(app).get('/products?page=1&limit=5');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('products');
    expect(res.body.data).toHaveProperty('total');
    expect(Array.isArray(res.body.data.products)).toBe(true);
  });

  it('should fetch product detail by ID', async () => {
    const productId = 'p0000000-0000-0000-0000-000000000001'; // Rose Bouquet from seeders
    const res = await request(app).get(`/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', productId);
  });
});
