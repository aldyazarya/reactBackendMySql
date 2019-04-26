const express = require('express')
const userRouter = require ('../src/routers/userRouter')
const tasksRouter = require ('../src/routers/taskRouter')

//library node.js
const app = express()
const port = 2010

app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)


app.listen(port, () => {
    console.log("Running at ", port);
    
})