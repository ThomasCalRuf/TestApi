module.exports = (server) => {
    const commentController = require("../controllers/commentController");
    
    server.route("/posts/:post_id/comments")
    .get(commentController.listAllComments)
    .post(commentController.createComments);
    
    server.route("/comments/:comment_id")
    .get(commentController.listAComment)
    .put(commentController.updateAComment)
    .delete(commentController.deleteAComment);
}