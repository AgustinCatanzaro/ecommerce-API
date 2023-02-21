//Path for DB Token + Db Connection
const path = require('path');
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'})
const connectDB = require('./db/connect')

// async errors
require('express-async-errors') //Nos ahorra tener que crear Wrappers de try/catch.

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')



//Express
const express = require('express')
const app = express()

// Routes Init
const productsRouter = require('./routes/products')



// middleware
app.use(express.json())

app.use('/api/v1/products', productsRouter)



// routes
app.get('/', (req, res) => {
    res.send('<h1>StoreApi</h1><a href="/api/v1/products">products route</a>')
})

// products route --- Error Handlers tienen que estar despues de las routes/midleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000

const start = async () => {
    try {
        //connect DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server listening port: ${port}`))
    } catch (error) {
        
    }
}

start()