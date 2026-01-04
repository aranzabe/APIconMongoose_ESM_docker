
import Comentario from '../models/comentarioMongoose.js'
import UserModel from '../models/usuarioMongoose.js';

const controlador = {

    addComentario: async (req, res) => {
        try {
            //const userId = parseInt(req.params.id); //Convertimos el id de la URL a número.
            const { idU, comment } = req.body; //Extraemos el comentario y el idU del cuerpo de la petición.

            if (!comment || comment.trim() === "") { //Aunque esta validación sería mejor con express-validator.
                return res.status(400).json({ msg: "El comentario no puede estar vacío" });
            }

            //Verificamos si el usuario existe
            const usuario = await UserModel.findOne({ id: idU });

            if (!usuario) {
                console.log('‼️ Usuario no encontrado!');
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }

            //Si el usuario existe creamos el nuevo comentario
            const nuevoComentario = new Comentario({
                idU: idU,
                comment: comment,
                likes: 0, //Se inicia con 0 likes.
                timestamp: new Date() //Ponemos el timestamp. 
            });

            //Finalmente Guardamos en la base de datos.
            await nuevoComentario.save();

            console.log("🔵 Comentario añadido correctamente:", nuevoComentario);
            res.status(201).json({ msg: "Comentario añadido correctamente", comentario: nuevoComentario });

        } catch (error) {
            console.error("❌ Error al añadir comentario:", error);
            res.status(500).json({ msg: "Error al añadir comentario" });
        }
    },
    comentariosGet : async (req, res) => {
        try {
            const comentarios = await Comentario.find();
            if (comentarios.length > 0) {
                console.log(comentarios)
                console.log('🔵Listado correcto!');
                res.status(200).json(comentarios);
            } else {
                console.log('‼️ No hay registros!');
                res.status(200).json({ 'msg': 'No se han encontrado registros' });
            }
        } catch (error) {
            console.error('❌ Error al obtener comentarios:', error);
            res.status(500).json({ 'msg': 'Error al obtener comentarios' });
        }
    },
    comentariosGetAsignados : async (req, res) => {
        try {
            const comentariosPorUsuario = await Comentario.aggregate([
                {
                    $lookup: { //Unimos la colección 'usuarios' a 'comments'  por los campos indicados.
                        from: 'usuarios',  
                        localField: 'idU',
                        foreignField: 'id',
                        as: 'usuario'
                    }
                },
                {
                    $unwind: '$usuario'  //Como usuario es un array después del $lookup, usamos $unwind para convertirlo en un objeto normal.
                },
                {
                    $group: { //Agrupamos los comentarios usando _id: '$usuario.nombre', es decir, cada grupo tendrá el nombre del usuario.
                        _id: '$usuario.nombre',
                        comentarios: {
                            $push: { //$push agrega cada comentario dentro del array comentarios.
                                commentId: '$_id',
                                comment: '$comment',
                                likes: '$likes',
                                timestamp: '$timestamp'
                            }
                        }
                    }
                }
            ]);

            console.log(comentariosPorUsuario);
            res.status(200).json(comentariosPorUsuario);

        } catch (error) {
            console.error('❌ Error al obtener comentarios por usuario:', error);
            res.status(500).json({ 'msg': 'Error al obtener comentarios' });
        }     
    },
    comentarioGetAsignadoA : async (req, res) => {
        try {
            const userId = parseInt(req.params.id);  //Esto es necesario porque al usar $match se pone un poco tiquismiquis con los tipos y req.params.id no es int (que es como está definido).
            const comentariosPorUsuario = await Comentario.aggregate([
                {
                    $match: { //Filtramos por esa id.
                        idU: userId
                    }
                },
                {
                    $lookup: { //Unimos la colección 'usuarios' a 'comments'  por los campos indicados.
                        from: 'usuarios',  
                        localField: 'idU',
                        foreignField: 'id',
                        as: 'usuario'
                    }
                },
                {
                    $unwind: '$usuario' //Como usuario es un array después del $lookup, usamos $unwind para convertirlo en un objeto normal.
                },
                {
                    $group: { //Agrupamos los comentarios usando _id: '$usuario.nombre', es decir, cada grupo tendrá el nombre del usuario.
                        _id: '$usuario.nombre',
                        comentarios: {
                            $push: { //$push agrega cada comentario dentro del array comentarios.
                                commentId: '$_id',
                                comment: '$comment',
                                likes: '$likes',
                                timestamp: '$timestamp'
                            }
                        }
                    }
                }
            ]);

            console.log(comentariosPorUsuario);
            res.status(200).json(comentariosPorUsuario);

        } catch (error) {
            console.error('❌ Error al obtener comentarios por usuario:', error);
            res.status(500).json({ 'msg': 'Error al obtener comentarios' });
        }     
    }
}

export default controlador;  //Exportamos el controlador para poder usarlo en las rutas.