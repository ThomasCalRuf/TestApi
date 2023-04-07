const postController = require("../controllers/postController");
const Post = require("../models/postModel");
const textApi = require("../providers/testApiProvider");

jest.mock("../models/postModel");
jest.mock("../providers/testApiProvider");

describe('listAllPost', () => {
  it('Doit faire apparraitre tous les posts', () => {
    const mockPosts = [{ title: 'post1', content: 'contentpost1'}];
    Post.find.mockImplementationOnce((query, callback) => {
      callback(null, mockPosts);
    });
    const mockRequest = { };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    postController.listAllPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPosts);
  });
    
  it('Doit retourner une erreur', () => {
    Post.find.mockImplementationOnce((query, callback) => {
      callback('error', null);
    });
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    postController.listAllPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe('updateAPost', ()=>{
  it('Doit mettre à jour un post', ()=>{
    const mockPost = {
      title: 'post1',
      content: 'contentpost1'
    };
    const mockRequest = { params: { post_id: '1234' }, body: mockPost };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Post.findByIdAndUpdate = jest.fn().mockImplementationOnce((id, update, options, callback) => {
      expect(id).toBe('1234');
      expect(update).toEqual(mockPost);
      expect(options).toEqual({ new: true });
      callback(null, mockPost);
    });
    postController.updateAPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
  })

  it('Doit renvoyer une erreur lors de la mise à jour ', () => {
    const mockRequest = { params: { post_id: '1234' }, body: {} };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Post.findByIdAndUpdate = jest.fn().mockImplementationOnce((id, update, options,callback) => {
      callback(new Error('Erreur de mise à jour'), null);
    });
    console.log = jest.fn();
    postController.updateAPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe('deleteAPost',()=>{
  it('Doit supprimer un post', () => {
    const mockPost = { _id: 'post1', title: 'post1', content: 'contentpost1' };
    Post.findByIdAndDelete.mockImplementationOnce((id, callback) => {
        callback(null, mockPost);
    });
    const mockRequest = { params: { post_id: 'post1' } };
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    postController.deleteAPost(mockRequest, mockResponse);
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith('post1', expect.any(Function));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Post supprimé avec succès" });
  }); 

  it('Doit retourner une erreur', () => {
      Post.findByIdAndDelete.mockImplementationOnce((id, callback) => {
          callback('error', null);
      });
      const mockRequest = { params: { post_id: 'post1' } };
      const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      postController.deleteAPost(mockRequest, mockResponse);
      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('post1', expect.any(Function));
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe('listAPost', () => {
  it('Doit renvoyer un post existant', () => {
    const mockPost = { title: 'post1', content: 'Post1' };
    Post.findById = jest.fn().mockImplementationOnce((id, callback) => {
      callback(null, mockPost);
    });
    const mockRequest = { params: { id: 'post1' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    postController.listAPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
  });

  it('Doit renvoyer une erreur si le post n\'existe pas', () => {
    Post.findById = jest.fn().mockImplementationOnce((id, callback) => {
      callback('error', null);
    });
    const mockRequest = { params: { post_id: 'post1' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    postController.listAPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Erreur serveur" });
  });
});

describe("createAPost", () => {
  it("Doit crée un post avec un texte aléatoire s'il n'y a pas de contenu fourni", async () => {
    const mockRandomText = "Contenu aléatoire";
    const mockPost = { title: "Titre du post" };
    const mockRequest = { body: mockPost };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    textApi.getRandomText.mockResolvedValue({ body: mockRandomText });

    await postController.createAPost(mockRequest, mockReponse);

    expect(textApi.getRandomText).toHaveBeenCalled();
  });

  it("Doit crée un post avec le contenu fourni s'il est présent", async  () => {
    const mockPost = { title: "Titre du post", content: "Contenu du post" };
    const mockRequest = { body: mockPost };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await postController.createAPost(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(201);
    
  });

  it("renvoie une erreur si la sauvegarde échoue", async () => {
    const mockPost = { title: "Titre du post" };
    const mockRequest = { body: mockPost };
    const mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockError = new Error("Erreur de sauvegarde");
    const mockSave = jest.fn().mockImplementationOnce((callback) => {
      callback(mockError, null);
    });
    Post.mockImplementationOnce(() => ({
      content: null,
      save: mockSave,
    }));

    await postController.createAPost(mockRequest, mockReponse);

    expect(mockReponse.status).toHaveBeenCalledWith(401);
    expect(mockReponse.json).toHaveBeenCalledWith({
      message: "Requête invalide.",
    });
  });
});