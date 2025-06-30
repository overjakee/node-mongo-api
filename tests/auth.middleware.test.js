const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middlewares/auth.middleware');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  it('should call next() if token is valid', () => {
    const token = 'valid.token.here';
    const req = {
      headers: { authorization: `Bearer ${token}` }
    };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockReturnValue({ userId: 'abc123' });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.user).toEqual({ userId: 'abc123' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is missing', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });
});
