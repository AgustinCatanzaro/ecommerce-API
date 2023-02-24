const path = require('path');
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'})
const connectDB = require('./db/connect')

const Product = require('./models/product')

const jsonProducts = require('./products.json')







const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany() //Borra todos los elementos en Productos, asi nos aseguramos que solo esta el Schema cargado
        await Product.create(jsonProducts) //Cargamos el Schema creado con los elementos.
        console.log('Success');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)

    }
}

start()