const express = require("express")
//inport express for the server
const userRouter = require("./users/router")


const server = express()
//create the server with express
const port = process.env.PORT || 5000
//set port to 5000 or to the port the environment might use
server.use(express.json())
server.use(userRouter)


server.use((err, req, res, next) => {
    console.log(err)

    res.status(500).json({
        message: "Something went wrong"
    })
})
//creating an error message for when res is an error

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
//always server to be started at the port and tells what port server is listening at