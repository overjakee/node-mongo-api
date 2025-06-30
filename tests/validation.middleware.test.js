const validateRequest = require('../src/middlewares/validation.middleware');
const { validationResult } = require('express-validator');

jest.mock('express-validator');

describe('validateRequest middleware', () => {
  it('should call next() if no validation errors', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    validateRequest(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 with formatted error list if errors exist', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { param: 'email', msg: 'Invalid email', value: 'bad-email' },
        { param: 'name', msg: 'Name is required', value: '' },
      ],
    });

    validateRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: [
        { param: 'email', msg: 'Invalid email', value: 'bad-email' },
        { param: 'name', msg: 'Name is required', value: '' },
      ],
    });

    expect(next).not.toHaveBeenCalled();
  });
});
