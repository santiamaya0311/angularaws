import express from "express"
const route = express.Router();
import usuariosController  from "../controller/usuarios.js"


route.post("/register", usuariosController.register) //Agregar un producto
route.post("/login", usuariosController.login)
route.get("/", usuariosController.getAll)
route.get("/:id", usuariosController.getUno)
route.delete("/:id", usuariosController.delete)
route.post("/code", usuariosController.verificacionCode)
route.put("/usuarios",usuariosController.update)


export default route;