import mongoose from "mongoose"

export default function validarId (id){
    //Devolvera verdadero en caso de que el id sea valido, sino devolvera false
    return mongoose.isValidObjectId(id)
}