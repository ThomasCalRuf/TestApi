const Comment = require('../models/commentModel');

exports.listAllComments = (req, res) => {
    Comment.find({post_id : req.params.post_id}, (error, posts) => {
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Erreur serveur"});
        }
        else{
            res.status(200);
            res.json(posts);        
        }
    })
}

exports.createComments = (req,res) => {
    let newComment = new Comment(req.body);
    newComment.post_id = req.params.post_id;

    newComment.save((error, post)=>{
        if(error){
            res.status(401);
            console.log(error);
            res.json({message: "Requête invalide."});
        }
        else {
            res.status(201);
            res.json(post);
        }
    })
}

exports.updateAComment = (req, res) => {
    Comment.findByIdAndUpdate( req.params.comment_id , req.body, { new: true }, (error, post) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "Erreur serveur" });
        } else {
            res.status(200);
            res.json(post);
        }
    });
};

exports.deleteAComment = (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (error, post) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "Erreur serveur" });
        } else {
            res.status(200);
            res.json({ message: "Post supprimé avec succès" });
        }
    });
};

exports.listAComment = (req, res) => {
    Comment.findById( req.params.comment_id, (error, post) => {
        if(error){
            res.status(500);
            console.log(error);
            res.json({message: "Erreur serveur"});
        }
        else{
            res.status(200);
            res.json(post);        
        }
    })
}