const express = require('express')
const userRouter = require ('../src/routers/userRouter')
const tasksRouter = require ('../src/routers/taskRouter')
const cors = require ('cors')

//library node.js
const app = express()
const port = process.env.PORT


app.get('/', (req, res) => {
    res.send(`<h1>API Running on Heroku port ${port}</h1>`)
})

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(tasksRouter)


app.listen(port, () => {
    console.log("Running at ", port);
    
})