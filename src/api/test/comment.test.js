const commentController = require("../controllers/commentController");
const Comment = require("../models/commentModel");

jest.mock("../models/commentModel");

describe('listAllComments', () => {
  it('Doit faire apparraitre tous les commentaires d\'un post', () => {
    const mockComments = [{ name: 'comment1', post_id: 'post1', message: 'comment text' }];
    Comment.find.mockImplementationOnce((query, callback) => {
      callback(null, mockComments);
    });
    const mockRequest = { params: { post_id: 'post1' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    commentController.listAllComments(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockComments);
  });
    
  it('Doit retourner une erreur', () => {
    Comment.find.mockImplementationOnce((query, callback) => {
      callback('error', null);
    });
    const mockRequest = { params: { post_id: 'post1' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    commentController.listAllComments(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe('createComments', () => {
  it('Doit créer un commentaire d\'un post', () => {
    const mockComment = { name: 'comment1', post_id: 'post1', message: 'comment text' };
    Comment.mockImplementationOnce(() => {
      return {
        save: jest.fn().mockImplementationOnce((callback) => {
          callback(null, mockComment);
        }),
      };
    });
    const mockRequest = { params: { post_id: 'post1' }, body: mockComment };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    commentController.createComments(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockComment);
  });

  it('Doit retourner une erreur', () => {
    Comment.mockImplementationOnce(() => {
      return {
        save: jest.fn().mockImplementationOnce((callback) => {
          callback('error', null);
        }),
      };
    });
    const mockRequest = { params: { post_id: 'post1' }, body: { message: 'comment text' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    commentController.createComments(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Requête invalide." });
  });
});

describe('updateAComments', ()=>{
  it('Doit mettre à jour un commentaire', ()=>{
    const mockComment = {
      name: 'comment1',
      message: 'nouveau message',
      post_id: 'post1'
    };
    const mockRequest = { params: { comment_id: '1234' }, body: mockComment };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Comment.findByIdAndUpdate = jest.fn().mockImplementationOnce((id, update, options, callback) => {
      expect(id).toBe('1234');
      expect(update).toEqual(mockComment);
      expect(options).toEqual({ new: true });
      callback(null, mockComment);
    });
    commentController.updateAComment(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockComment);
  })

  it('Doit renvoyer une erreur lors de la mise à jour ', () => {
    const mockRequest = { params: { comment_id: '1234' }, body: {} };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Comment.findByIdAndUpdate = jest.fn().mockImplementationOnce((id, update, options,callback) => {
      callback(new Error('Erreur de mise à jour'), null);
    });
    console.log = jest.fn();
    commentController.updateAComment(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe('deleteAComment',()=>{
  it('Doit supprimer un commentaire', () => {
    const mockComment = { _id: 'comment1', name: 'comment1', post_id: 'post1', message: 'comment text' };
    Comment.findByIdAndDelete.mockImplementationOnce((id, callback) => {
        callback(null, mockComment);
    });
    const mockRequest = { params: { comment_id: 'comment1' } };
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    commentController.deleteAComment(mockRequest, mockResponse);
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment1', expect.any(Function));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Post supprimé avec succès" });
  }); 

  it('Doit retourner une erreur', () => {
      Comment.findByIdAndDelete.mockImplementationOnce((id, callback) => {
          callback('error', null);
      });
      const mockRequest = { params: { comment_id: 'comment1' } };
      const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      commentController.deleteAComment(mockRequest, mockResponse);
      expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment1', expect.any(Function));
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe('listAComment', () => {
  it('Doit renvoyer un commentaire existant', () => {
    const mockComment = { name: 'comment1', post_id: 'post1', message: 'comment text' };
    Comment.findById = jest.fn().mockImplementationOnce((commentId, callback) => {
      callback(null, mockComment);
    });
    const mockRequest = { params: { comment_id: 'comment1' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    commentController.listAComment(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockComment);
  });

  it('Doit renvoyer une erreur si le commentaire n\'existe pas', () => {
    Comment.findById = jest.fn().mockImplementationOnce((commentId, callback) => {
      callback('error', null);
    });
    const mockRequest = { params: { comment_id: 'comment1' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    commentController.listAComment(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});