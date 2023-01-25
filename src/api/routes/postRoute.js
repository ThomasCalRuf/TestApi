module.exports = (server) => {
    const postController = require("../controllers/postController");
    
    server.route("/posts")
    .get(postController.listAllPosts)
    .post(postController.createAPost);
}