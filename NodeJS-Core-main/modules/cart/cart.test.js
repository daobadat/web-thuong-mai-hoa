const request = require('supertest');
const app = require('../../index');

describe('Cart Module Integration Tests', () => {
  const sessionId = 'test-guest-session-12345';
  const productId = 'p0000000-0000-0000-0000-000000000001';

  it('should add item to guest cart successfully', async () => {
    const res = await request(app)
      .post('/cart/add')
      .set('x-session-id', sessionId)
      .send({
        product_id: productId,
        quantity: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id');
  });

  it('should fetch guest cart items', async () => {
    const res = await request(app)
      .get('/cart')
      .set('x-session-id', sessionId);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('items');
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
