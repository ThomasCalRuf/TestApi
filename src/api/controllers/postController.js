const Post = require('../models/postModel');

const textApi = require('../providers/testApiProvider');

exports.listAllPosts = (req, res) => {
    Post.find({}, (error, posts) => {
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

exports.createAPost = (req,res) => {
    let newPost = new Post(req.body);

    if(!newPost.content){
        let randomText = textApi.getRandomText();
        // newPost.content = randomText;

        randomText.then((result)=>{
            newPost.content = result.body;
            newPost.save((error, post)=>{
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
        })
    }else{
        newPost.save((error, post)=>{
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

}

exports.updateAPost = (req, res) => {
    Post.findByIdAndUpdate( req.params.post_id , req.body, { new: true }, (error, post) => {
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

exports.deleteAPost = (req, res) => {
    Post.findByIdAndDelete(req.params.post_id, (error, post) => {
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

exports.listAPost = (req, res) => {
    Post.findById( req.params.post_id, (error, post) => {
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