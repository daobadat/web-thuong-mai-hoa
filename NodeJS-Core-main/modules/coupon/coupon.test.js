const request = require('supertest');
const app = require('../../index');

describe('Coupon Module Integration Tests', () => {
  it('should apply valid coupon WELCOME10 successfully', async () => {
    const res = await request(app)
      .post('/coupons/apply')
      .send({
        code: 'WELCOME10',
        subtotal: 500000,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('discount_amount', 50000); // 10% of 500,000 = 50,000
  });

  it('should reject invalid coupon code', async () => {
    const res = await request(app)
      .post('/coupons/apply')
      .send({
        code: 'INVALIDCODE99',
        subtotal: 500000,
      });

    expect([400, 422]).toContain(res.statusCode);
  });
});
