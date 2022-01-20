const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')

app.use(bodyParser.json())
app.use('/users',userRouter)

//Error handeler
app.use((err,req,res,next)=>{
    res.status(err.status).send(err.message)
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})