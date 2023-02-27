module.exports = (server) => {
    const postController = require("../controllers/postController");
    
    server.route("/posts")
    .get(postController.listAllPosts)
    .post(postController.createAPost);
    
    server.route("/posts/:post_id")
    .get(postController.listAPost)
    .put(postController.updateAPost)
    .delete(postController.deleteAPost);
}