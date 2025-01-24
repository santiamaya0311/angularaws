import mongoose from "mongoose";
const productoSchema = new mongoose.Schema(

    {
        nombre:{
            type: String,
            required: true
        },

        tipo:{
            type: String,
            required: true
        },

        precio:{
            type: Number,
            required: true
        },

        stock:{
            type: Number,
            required: true
        },

        descripcion:{
            type: String,
            required: true
        },

        imagen:{
            type: String,
            required: true
        }


    }, {Timestamp: true}



);

export default mongoose.model("productos", productoSchema)

