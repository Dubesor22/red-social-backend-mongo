const moongose = require ('mongoose'); //se usa mongoose para conectarnos
require("dotenv").config(); //al utilizar la variable de entrono importamos dotenv
const MONGO_URI = process.env.MONGO_URI // Usamos el objeto de variable de entorno


const dbConnection = async()=>{  //la función hace que conectemos con mongoose a través de nuestra variable de entorno
    try {
        await moongose.connect(MONGO_URI);
        console.log('Base de datos conectada con éxito')
    } catch (error) {
        console.error(error);
        throw new Error("Error a la hora de iniciar la base de datos");
    }
};

module.exports = {
    dbConnection,   
};