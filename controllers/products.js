const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    // throw new Error('Testing Async Errors')

    /*
    const search = 'a' //simular query recibida
    const products = await Products.find({
        name: {$regex: search, $options: 'i'} //Options solo hay cosas puntuales, i= ignora mayusculas.
        // recibo todos los elementos que contengan almenos una 'a' en name
    })
    */


    /*
    Test de sorting
    const products = await Products.find({}).sort('-name price')//sorting parameters, mirar docs de mongoose...
    */

    /*
    Test de que elementos mostrar de cada item.
    const products = await Products.find({}).select('name price')
    */
    /* 
    Test limit 
    limit(cantidad de items q va a agarrar)
    skip(saltea cantidad de items) ej tengo 10, skip(1) va a mostrar del 2 al 10
    const products = await Products.find({}).select('name price').limit(10)
    */

    const products = await Products.find({})
    .sort('name')
    .select('name price')
    .limit(10)
    .skip(5)

    res.status(200).json({ nbHits: products.length, products})
}


const getAllProducts = async (req, res) => {
    // const products = await Products.find(req.query) Setup basica, se pasa toda la query recibida.
    const { featured, company, name, sort, fields} = req.query // una forma es destructurar la query recibida y solo manipular lo q necesitamos
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

    /*
    const products = await Products.find(queryObject) // de esta forma por mas quere recibamos una query con parametros que no nos sirven, podemos aceptarla ya que solo se tomaria como un objeto vacio, y devolvemos un valor por defecto.
    */

    let result = Products.find(queryObject) // Usamos let xq este result luego va a ser modificado por el sort/select

    //Sort
    if(sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        //valor por defecto en caso de no recibir sort
        result = result.sort('createdAt')
    }

    //Despues de sort
    //Select
    if(fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    else{
        //valor por defecto en caso de no recibir sort
        result = result.sort('createdAt')
    }

    //Despues del select
    //page/limit/skip
    //tanto page como limit, vienen por defecto en la request, por eso no hay que destructurarlo.
    const page = Number(req.query.page) || 1  //si no recibimos parametro de page por defecto sera 1.
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    //esta logica es para mostrar n cantidad de elementos por pagina.
    result = result.skip(skip).limit(limit)

    const products = await result

    res.status(200).json({nbHits: products.length, products})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}