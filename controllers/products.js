const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    // throw new Error('Testing Async Errors')

    const search = 'a' //simular query recibida
    const products = await Products.find({
        name: {$regex: search, $options: 'i'} //Options solo hay cosas puntuales, i= ignora mayusculas.
        // recibo todos los elementos que contengan almenos una 'a' en name
    })
    res.status(200).json({ nbHits: products.length, products})
}


const getAllProducts = async (req, res) => {
    // const products = await Products.find(req.query) Setup basica, se pasa toda la query recibida.
    const { featured, company, name } = req.query // una forma es destructurar la query recibida y solo manipular lo q necesitamos
    const queryObject = {}

    if (featured) { // si existe el parametro featured(no importa si es t o f), creamos un nuevo parametro en el objeto queryObject
        queryObject.featured = featured === 'true'? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    
    // console.log(queryObject);
    const products = await Products.find(queryObject) // de esta forma por mas quere recibamos una query con parametros que no nos sirven, podemos aceptarla ya que solo se tomaria como un objeto vacio, y devolvemos un valor por defecto.
    res.status(200).json({nbHits: products.length, products})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}