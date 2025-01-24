import express from "express"
import "dotenv/config"
import routesProductos  from "./routes/productos.js"
import routesUsuarios from "./routes/usuarios.js"
import bodyParser from "body-parser";
import dbClient from "./config/dbClient.js";
import cors from 'cors';

const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(express.json());

app.use("/productos", routesProductos)
app.use("/usuarios", routesUsuarios)


try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,()=> console.log("La api esta conectada al puerto"+ " "+ PORT));
} catch (error) {  
    
    res.status(500).send(error.message)

}

process.on("SIGINT", async()=>{
    dbClient.cerrarBD();
    process.exit(0)
})