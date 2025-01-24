import mongoose from "mongoose"
import Producto from "../schema/productos.js"


class productosModel{


    async create (producto){
        return await Producto.create(producto)

    }

    async update(id, producto) {
        return await Producto.findByIdAndUpdate(
            id, // El ID directamente
            producto, // Los datos a actualizar
            { new: true, runValidators: true } // Opciones
        );
    }
    

    async delete(id){
        return await Producto.deleteOne({_id: new mongoose.Types.ObjectId(id)})

    }

    async getAll (){
        return await Producto.find()

    }

    async getOne(id){
        return await Producto.findById({_id: new mongoose.Types.ObjectId(id)})
 
    }

}


export default new productosModel;