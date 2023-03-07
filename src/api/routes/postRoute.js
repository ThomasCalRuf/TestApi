module.exports = (server) => {
    const postController = require("../controllers/postController");
    const JWTMiddleware = require("../middlewares/jwtMiddleware.js")
    
    server.route("/posts")
    .get(postController.listAllPosts)
    .post(JWTMiddleware.verifyToken,postController.createAPost);
    
    server.route("/posts/:post_id")
    .all(JWTMiddleware.verifyToken)
    .get(postController.listAPost)
    .put(postController.updateAPost)
    .delete(postController.deleteAPost);
}