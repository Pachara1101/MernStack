const router = require("express").Router()
const User = require("../model/User")
const Post = require("../model/Post")
const bcrypt = require("bcrypt")
// const { route } = require("./auth")

// update
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id){
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        
        try {
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {
                    new: true, // this just for postman
                }
            )
            res.status(200).json(updateUser)

        } catch(err) {
            res.status(500).json(err)
        }
    } else {
        res.status(401).json("You can update your account")
    }
})

// delete
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id) {
        // delete all post of user and user account

        try{
            const user = await User.findById(req.params.id)
            try {
                await Post.deleteMany({ username: user.username})

                // only delete user account
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("user has been delete...")
            } catch(err) {
                res.status(500).json(err)
            }
        } catch(err) {
            res.status(404).json("user not found...")
        }
    } else {
        res.status(401).json("You can delete only your account...")
    }
})

// get user
router.get("/:id", async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc
        res.status(200).json(other)

    } catch(err){
        res.status(400).json(other)
    }

})
module.exports = router