const userController = require('../controllers/userController');
const User = require('../models/userModel');
const jsonwebtoken = require('jsonwebtoken');

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

describe('register', () => {
  test('Doit retourné utilisateur est créer', () => {
    const mockRequest = { body: { email: 'test@example.com', password: 'password' } };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const user = new User(mockRequest.body);
    User.mockReturnValueOnce({
      save: jest.fn().mockImplementationOnce(callback => {
        callback(null, user);
      }),
    });

    userController.userRegister(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(201);
    expect(mockReponse.json).toHaveBeenCalledWith({
      message: `Utilisateur crée : ${user.email} `,
    });
  });

  test('Doit retourner une erreur message car l\' utilisateur', () => {
    const mockRequest = { body: { email: 'test@example.com', password: 'password' } };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    User.mockReturnValueOnce({
      save: jest.fn().mockImplementationOnce(callback => {
        callback("Requête invalide.", null);
      }),
    });

    userController.userRegister(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(500);
    expect(mockReponse.json).toHaveBeenCalledWith({ message: "Requête invalide." });
  });
});

describe('login', () => {
  test('returns success message and token if credentials are valid', () => {
    const mockRequest = { body: { email: 'test@example.com', password: 'password' } };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const user = {
      email: 'test@example.com',
      password: 'password',
      _id: 'user_id',
    };
    User.findOne.mockImplementationOnce((query, callback) => {
      callback(null, user);
    });
    jsonwebtoken.sign.mockImplementationOnce((payload, secret, options, callback) => {
      callback(null, 'token');
    });

    userController.userLogin(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(200);
    expect(mockReponse.json).toHaveBeenCalledWith({
      token: 'token',
    });
  });

  test('returns an error message when user is not found', () => {
    const mockRequest = { body: { email: 'test@example.com', password: 'password' } };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    User.findOne.mockImplementationOnce((query, callback) => {
      callback('Utilisateur inconnue', null);
    });

    userController.userLogin(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(500);
    expect(mockReponse.json).toHaveBeenCalledWith({ message: 'Utilisateur inconnue' });
  });

  test('returns an error message when password is incorrect', () => {
    const mockRequest = { body: { email: 'test@example.com', password: 'wrong_password' } };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const user = {
      email: 'test@example.com',
      password: 'password',
      _id: 'user_id',
    };
    User.findOne.mockImplementationOnce((query, callback) => {
      callback(null, user );
    });

    userController.userLogin(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(401);
    expect(mockReponse.json).toHaveBeenCalledWith({ message: 'Email ou Mot de passe incorrect' });
    });
});
