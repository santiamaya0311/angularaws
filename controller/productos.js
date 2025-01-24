import productosModel from "../model/productos.js"


class productosController {
    constructor() {
    }

    async create(req,res){

        try {
            const data = await productosModel.create(req.body);

            res.status(201).json(data)
            
        } catch (e) {
            res.status(500).send(e.message)
            
        }
   
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const datos = req.body;
    
            console.log('ID recibido:', id);
            console.log('Datos recibidos para actualizar:', datos);
    
            // Busca el producto existente
            const productoExistente = await productosModel.getOne(id); // O directamente Producto.findById(id)
            if (!productoExistente) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
    
            console.log('Producto existente antes de actualizar:', productoExistente);
    
            // Actualiza el producto
            const productoActualizado = await productosModel.update(id, datos);
    
            console.log('Producto actualizado:', productoActualizado);
    
            res.status(200).json(productoActualizado);
        } catch (e) {
            console.error('Error al actualizar producto:', error);
            res.status(500).send(e.message)
        }
    }
    
    
    
    
    
    
    
    async delete(req,res){

        try {
            const {id}= req.params
            const data = await productosModel.delete(id);
            res.status(201).json(data)
            
        } catch (e) {
            res.status(500).send(e.message)
            
        }
        
    }
    async getAll(req,res){

        try {
            const data = await productosModel.getAll();
            res.status(201).json(data)
            
        } catch (e) {
            res.status(500).send(e.message)
            
        }
        
    }
    async getOne(req,res){

        try {
            const {id} = req.params
            const data = await productosModel.getOne(id);

            res.status(201).json(data)
            
        } catch (e) {
            res.status(500).send(e.message)
            
        }
        
    }
}



export default new productosController();