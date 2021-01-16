const express = require("express")
const Users = require("./model")
const bcrypt = require("bcryptjs")
const {restrict} = require("./middleware")

const router = express.Router()

router.get("/users", restrict(), async (req, res, next) => {
    try {
        res.json(await Users.find())
    }
    catch(err) {
        next(err)
    }
})

router.post("/users", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findByUsername(username)

        if (user) {
            return res.status(409).json({
                message: "Username already exists."
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 12),
        })
        res.status(201).json(newUser)
    } 
    catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await Users.findByUsername(username)
        
        if (!user) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        req.session.user = user

        res.json({
            message: `Welcome, ${user.username}!`
        })
    } catch(err) {
        next(err)
    }
})

router.get("/logout", async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                next(err)
            } else {
                res.status(204).end()
            }
        })
    }
    catch (err) {
        next(err)
    }
})

module.exports = router