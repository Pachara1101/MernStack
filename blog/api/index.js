const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
dotenv.config()
app.use(express.json())

mongoose.connect(process.env.CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))
    app.use("/auth", authRoute)

app.listen("5000", () => {
    console.log("server run on port:5000")
})