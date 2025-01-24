import "dotenv/config"
import mongoose from "mongoose";


class dbClient {
    constructor(){
        this.conectarBD();
    }


    async conectarBD() {

        const queryString =`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/tienda?retryWrites=true&w=majority`
        await mongoose.connect(queryString) 
        console.log("Conectado a la base de datos de MONGODB online");
         
    }

    async cerrarBD(){
        try {
            await mongoose.disconnect();
            console.log("Conexion a la base de datos cerrada");
            
            
        } catch (e) {
            console.log("Erroe al cerrar la conexion", e.message);
            
            
        }
    }


}

export default new dbClient();