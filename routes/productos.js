import express from "express"
const route = express.Router();
import productosController  from "../controller/productos.js"

route.get("/", productosController.getAll) //Consultar productos
route.get("/:id", productosController.getOne) //Consultar un producto
route.post("/", productosController.create) //Agregar un producto
route.put("/:id",productosController.update) //Modificar producto
route.delete("/:id", productosController.delete) // Borrar producto


export default route;