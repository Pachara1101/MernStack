const router = require("express").Router()
const { json } = require("express")
const Post = require("../model/Post")

// create post
router.post("/", async(req, res) => {
    const newPost = new Post(req.body)

    try {
        const savePost = await newPost.save()
        res.status(200).json(savePost)
    } catch(err) {
        res.status(500).json(err)
    }
})

// update post
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.username === req.body.username) {
            try {
                const updatePost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set : req.body
                    },
                    {
                        new: true,
                    }
                )
                res.status(200).json(updatePost)

            } catch(err) {
                res.status(200).json(err)
            }
        } else {
            res.status(401).json("You can update only your post!")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

// delete post
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post.username === req.body.username) {
            try {
                await post.deleteOne()
                res.status(200).json("Post Has been deleted!")
            } catch(err) {
                res.status(500).json(err)
            }
        } else {
            res.status(401).json("You can delete only your post!")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

// get one post
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)

    } catch(err) {
        res.status(404).json(err)
    }
})

// get all post
router.get("/", async(req, res) => {
    const username = req.query.user
    const catName = req.query.catName

    try{
        let posts
        if(username) {
            posts = await Post.find({username: username})
        } else if(catName) {
            posts = await Post.find({
                categories: {
                    $in: [catName],
                }
            })
        } else {
            posts = await Post.find()
        }
        res.status(404).json(posts)
    } catch(err) {
        res.status(404).json(err)
    }
})

module.exports = router