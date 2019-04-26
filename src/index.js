const express = require('express')
const userRouter = require ('../src/routers/userRouter')

//library node.js
const app = express()
const port = 2010

app.use(express.json())
app.use(userRouter)


app.listen(port, () => {
    console.log("Running at ", port);
    
})