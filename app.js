const express = require('express')
const app = express()
const errorMiddleware = require('./middlewares/error')
const product = require('./routes/productRoute')
const user = require('./routes/userRoute')

app.use(express.json())




app.use('/api/v1',product)
app.use('/api/v1',user)

//Middleware for handling errors use it here only otherwise it won't work (don't know why)
app.use(errorMiddleware)


module.exports = app;