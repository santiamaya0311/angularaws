import usuariosModel from "../model/usuarios.js";
import bcrypt from "bcryptjs";
import { generarToken } from "../helpers/autenticacion.js";
import nodemailer from "nodemailer"
import Usuarios from "../schema/usuarios.js"

class usuariosController {



  constructor() { 
    this.transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    } 
  });
  this.verificacionCode = this.verificacionCode.bind(this);
}

  


  async verificacionCode(req, res) {
    const { email, clave, nombre, telefono } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    if (!clave) {
      return res.status(400).json({ message: "La clave es obligatorio" });
    }

    if (!nombre) {
      return res.status(400).json({ message: "Es nombre es obligatorio" });
    }

    const usuarioE= await usuariosModel.getOne({email});
    if(usuarioE){
      return res.status(400).json("El usuario ya existe")
    }
  
    try {
      const verificacionCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(verificacionCode);
  
      let user = await usuariosModel.getOne({ email });
      if (!user) {
        console.log("Usuario no existe, creando uno nuevo");
        user = await usuariosModel.create({
          email,
          clave,
          nombre,
          telefono,
          verificacionCode,
          fechaCreacion: new Date()
        });
        console.log(user);
      } else {
        user.verificacionCode = verificacionCode;
        user.nombre= nombre;
        user.clave = clave
        user.telefono = telefono
        user.fechaCreacion = new Date()
        await user.save();
      }
      console.log(user);
  
      console.log("Enviado al correo", email);
  
      await this.transporter.sendMail({
        from: `Codigo de verificacion <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Codigo de verificacion",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <!-- Encabezado -->
      <h2 style="color: #27ae60; text-align: center;">¡Bienvenido a CampiFresh! 🌱</h2>
      <p style="text-align: center; color: #555;">De la naturaleza a tu mesa, frescura garantizada.</p>

      <!-- Cuerpo principal -->
      <p>Hola, ${nombre}</p>
      <p>Gracias por unirte a <strong>CampiFresh</strong>. Para completar tu registro, utiliza el siguiente código de verificación:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; background-color: #ffffff; padding: 15px 30px; font-size: 22px; font-weight: bold; color: #27ae60; border: 2px solid #27ae60; border-radius: 5px;">
          ${verificacionCode}
        </span>
      </div>
      <p>Este código es válido por <strong>10 minutos</strong>. Si no fuiste tú quien solicitó este código, por favor ignora este correo.</p>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

      <!-- Firma corporativa -->
      <div style="text-align: center; font-size: 14px; color: #555;">
        <p style="margin: 0; font-weight: bold; font-size: 16px;">CampiFresh</p>
        <p style="margin: 5px 0;">🌱 <strong>Tu tienda de frescura natural</strong></p>
        <p style="margin: 0;">📍 Calle 123, Ciudad Verde, País</p>
        <p style="margin: 0;">📧 <a href="mailto:soporte@campifresh.com" style="color: #27ae60; text-decoration: none;">soporte@campifresh.com</a> | 📞 <a href="tel:+1234567890" style="color: #27ae60; text-decoration: none;">+123 456 7890</a></p>
        <p style="margin: 10px 0;">
          <a href="https://facebook.com/campifresh" style="margin-right: 10px; text-decoration: none; color: #27ae60;">Facebook</a> |
          <a href="https://instagram.com/campifresh" style="margin-left: 10px; text-decoration: none; color: #27ae60;">Instagram</a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #999;">© 2025 CampiFresh. Todos los derechos reservados.</p>
      </div>
    </div>
  `
      });
  
      console.log("Correo enviado exitosamente");
      res.status(200).json({ message: "Codigo de verificacion enviado" });
  
    } catch (error) {
      console.error("Error al enviar el codigo de verificacion:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }
  
  

  async register(req, res) {
    const { email,  clave, verificacionCode } = req.body;
    if(!email || !verificacionCode){
      return res.status(400).json({error: "Error en correo o codigo de verficacion"})
    }

    if (!clave) { 
      return res.status(400).json({ error: "Clave es obligatoria" }); } 
      
    
    try {
      console.log("Email recibido:", email);

      const usuarioExiste = await usuariosModel.getOne({ email });
      if (!usuarioExiste || usuarioExiste.verificacionCode !== verificacionCode ) {
        return res.status(400).json({ error: "Codigo de verficacion incorrecto" });
      }

      const claveEncryptada = await bcrypt.hash(clave, 10);
      usuarioExiste.clave=claveEncryptada
      usuarioExiste.verificacionCode=null
      usuarioExiste.fechaCreacion=null
      await usuarioExiste.save()

      res.status(201).json(usuarioExiste);
    } catch (error) {
      res.status(500).send( error.message);
      console.log(e);
    }
  }

  async login(req, res) {
    console.log("datos recibidos", req.body);

    const { email, clave } = req.body;

    try {
      // Verifica si los datos necesarios están presentes
      if (!email || !clave) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }

      // Verifica si el usuario existe
      const usuarioExiste = await usuariosModel.getOne({ email }); // Buscar por email
      if (!usuarioExiste) {
        return res.status(400).json({ error: "El usuario no existe" });
      }

      // Verifica la contraseña
      const claveValida = await bcrypt.compare(clave, usuarioExiste.clave);
      if (!claveValida) {
        return res.status(400).json({ error: "Clave inválida" });
      }

      // Genera el token (deberías tener una función generarToken)
      const token = generarToken(email);

      // Respuesta exitosa
      return res.status(200).json({ message: "Usuario válido", token, role: usuarioExiste.role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message  });
    }
  }

  async getAll(req, res) {
    try {
      const data = await usuariosModel.getAll();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send( error.message);
    }
  }

      async getUno(req,res){
  
          try {
              const {id} = req.params
              const data = await usuariosModel.getUno(id);
  
              res.status(201).json(data)
              
          } catch (error) {
              res.status(500).send( error.message)
              
          }
          
      }

  async delete(req, res) {
    const { id } = req.params;
    const data = await usuariosModel.delete(id);
    res.status(201).json(data);
  }
  catch(error) {
    res.status(500).send( error.message);
  }

  async update (req, res) {
    try {
      const {id} = req.params;
      const data = await usuariosModel.update(id,req.body);
      res.status(200).json(data);
  
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
}





export default new usuariosController();
