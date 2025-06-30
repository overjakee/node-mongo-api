const userController = require('../src/controllers/user.controller');
const userService = require('../src/services/user.service');

// mock userService ทั้งหมด
jest.mock('../src/services/user.service');

describe('user.controller', () => {

  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('getUsers', () => {
    it('should return user list with pagination', async () => {
      req.query = { page: '2', limit: '5' };

      userService.getUsers.mockResolvedValue({
        users: [{ name: 'Alice' }, { name: 'Bob' }],
        total: 12,
        page: 2,
        limit: 5
      });

      await userController.getUsers(req, res, next);

      expect(userService.getUsers).toHaveBeenCalledWith(2, 5);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Array),
        pagination: expect.objectContaining({
          total: 12,
          page: 2,
          limit: 5,
          totalPages: 3
        })
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      userService.getUsers.mockRejectedValue(new Error('DB error'));

      await userController.getUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getUserById', () => {
    it('should return user data if found', async () => {
      req.params = { id: '123' };
      userService.getUserById.mockResolvedValue({ name: 'Charlie' });

      await userController.getUserById(req, res, next);

      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { name: 'Charlie' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: '123' };
      userService.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      req.params = { id: '123' };
      userService.getUserById.mockRejectedValue(new Error('DB error'));

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createUser', () => {
    it('should create user and return 201', async () => {
      req.body = { name: 'David', email: 'david@example.com' };
      userService.createUser.mockResolvedValue({ id: 'abc', ...req.body });

      await userController.createUser(req, res, next);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'abc', ...req.body }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if duplicate email', async () => {
      req.body = { name: 'Eve', email: 'eve@example.com' };
      const error = new Error('duplicate');
      error.code = 11000;
      userService.createUser.mockRejectedValue(error);

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already exists'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next on other errors', async () => {
      const error = new Error('other error');
      userService.createUser.mockRejectedValue(error);

      await userController.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // สามารถเขียน test updateUser และ deleteUser ในลักษณะเดียวกัน
});
