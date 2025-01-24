import  jsonwebtoken  from "jsonwebtoken";
import "dotenv/config"
//import { expires } from "mongoose/lib/utils";



function generarToken(email, role) {
    return jsonwebtoken.sign(
        { 
            email, 
            role  
        }, 
        process.env.JWT_TOKEN_SECRET, 
        { expiresIn: "1h" }
    )
}

export{ generarToken}