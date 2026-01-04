import UserModel from '../models/usuarioMongoose.js';


const controlador = {

    usuariosGet : async (req, res) => {
        try {
            const personas = await UserModel.find().lean();
            //const personas = await UserModel.find();  //Sin .lean() devuelve documentos de Mongoose, con .lean() devuelve objetos JS puros. Al ser datos más ligeros, mejora el rendimiento en lecturas ya que no se necesitan las funcionalidades de JSON.stringify que son llamadas automáticamente al enviar la respuesta.
            
            if (personas.length > 0) {
                console.log(personas)
                console.log('🔵 Listado correcto!');
                res.status(200).json(personas);
            } else {
                console.log('‼️ No hay registros!');
                res.status(200).json({ 'msg': 'No se han encontrado registros' });
            }
        } catch (error) {
            console.error('❌ Error al obtener usuarios:', error);
            res.status(500).json({ 'msg': 'Error al obtener usuarios' });
        }
    },
    usuarioGet : async (req, res) => {

        try {
            const usuario = await UserModel.find({id: req.params.id});
            if (usuario.length > 0)  {
                console.log('🔵 Usuario encontrado!');
                res.status(200).json(usuario);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al obtener usuario por ID:', error);
            res.status(500).json({ 'msg': 'Error al obtener usuario por ID' });
        }
    },
    usuariosPost : async (req, res) => {
        const { id, nombre, edad, tfno } = req.body;

        try {
            //En lugar de body podemos usar los campos, para un mayor control y coherencia. También podremos combinar con validator y middlewares.
            // UserModel.create({ id, nombre, edad, tfno }  , (err, usuario) => {
            const usuario = await UserModel.create(req.body);

            console.log('🔵 Usuario registrado correctamente!');
            res.status(201).json(usuario);

            //O también...
            //const nuevoUsuario = new UserModel({ id, nombre, edad, tfno });
            //await nuevoUsuario.save();
            //console.log('Usuario registrado correctamente!');
            //res.status(201).json(nuevoUsuario);
        } catch (error) {
            console.error('❌ Error al registrar usuario:', error);
            res.status(500).json({ 'msg': 'Error al registrar usuario' });
        }
    },
    usuariosPut : async (req, res) => {
        const { nombre, edad, tfno } = req.body;

        try {
            //const usuarioActualizado = await UserModel.updateOne({id : req.params.id}, { nombre, edad, tfno });
            const usuarioActualizado = await UserModel.findOneAndUpdate({id : req.params.id}, req.body, { new: true }); //{ new: true }   <-- Devuelve el documento actualizado
            if (usuarioActualizado) {
                console.log('🔵 Usuario actualizado correctamente!');
                res.status(200).json(usuarioActualizado);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al actualizar usuario:', error);
            res.status(500).json({ 'msg': 'Error al actualizar usuario' });
        }
    },
    usuariosDelete : async (req, res) => {

        try {
            const usuarioEliminado = await UserModel.deleteOne({id:req.params.id});
            if (usuarioEliminado.deletedCount > 0) {
                console.log('🔵 Usuario eliminado correctamente!');
                res.status(200).json(usuarioEliminado);
            } else {
                console.log('‼️ Usuario no encontrado!');
                res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('❌ Error al eliminar usuario:', error);
            res.status(500).json({ 'msg': 'Error al eliminar usuario' });
        }
    }
}

export default controlador;  //Exportamos el controlador para poder usarlo en las rutas.