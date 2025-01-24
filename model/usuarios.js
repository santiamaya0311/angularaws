import mongoose from "mongoose"
import Usuario from "../schema/usuarios.js"


class usuariosModel{


    async create (usuario){
        return await Usuario.create(usuario)
        
    }

    async update(id, usuario){
        return await Usuario.findByIdAndUpdate({_id: new mongoose.Types.ObjectId(id)});


    }

    async delete(id){
        return await Usuario.deleteOne({_id: new mongoose.Types.ObjectId(id)},{new: true})

    }

    async getAll (){
        return await Usuario.find()

    }

    async getOne(query) {
        if (query._id && mongoose.Types.ObjectId.isValid(query._id)) {
            query._id = new mongoose.Types.ObjectId(query._id); // Convertir solo si es válido
        } else if (query._id) {
            throw new Error('Invalid ObjectId format');
        }
    
        return await Usuario.findOne(query); // Usar findOne para soportar cualquier campo
    }

        async getUno(id){
            return await Usuario.findById({_id: new mongoose.Types.ObjectId(id)})
     
        }
    

}


export default new usuariosModel;