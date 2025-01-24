import mongoose from "mongoose";

const usuariosSchema = mongoose.Schema(

    {
        email:{
            type: String, 
            required: true, //requerido obligatorio
            unique: true, // clave primaria
            trim: true //Quitar espacios en blanco
        },

        nombre:{
            type:String,
            required: false,
            trim: true,
        },

        role:{
            type:String,
            required: false,
            enum:["admin", "user"],
            default: "user"

        },

        telefono:{
            type: String,
            required: false
        },

        clave:{
            type: String,
            required: false
        },

        verificacionCode:{
            type: String,
            required: false
        },
        fechaCreacion:{
            type: Date,
            default: Date.now,
            index: { expires: '2m' }
        }
    }
);


// Metodo solo para valdiacion del registro



export default mongoose.model("usuarios", usuariosSchema)