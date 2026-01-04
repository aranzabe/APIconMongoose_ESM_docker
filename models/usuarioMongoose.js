import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    nombre: { type: String },
    edad: { type: Number },
    tfno : { type: String }
}, { collection: 'usuarios' , versionKey: false, strict: false }); 
//versionKey: Mongoose no añadirá el campo __v en cada documento.
//sctrict: Si se establece en false, Mongoose permitirá almacenar en la base de datos campos que no estén definidos en el esquema.

const UserModel = mongoose.model('User', userSchema);

export default UserModel;

/*
Aunque no lo pongas en tu schema explícitamente, el campo id es único en la colección usuarios. ¿Por qué?

a) Índice único creado automáticamente

    Si alguna vez ejecutaste en MongoDB:

    db.usuarios.createIndex({ id: 1 }, { unique: true })

    MongoDB recuerda el índice aunque ya no lo declares en Mongoose



b) Índice definido en Mongoose (aunque no lo mostraste)

    En Mongoose puedes hacer:

    id: { type: Number, unique: true }


Esto crea un índice único automáticamente.

Si intentas insertar otra vez el mismo id, Mongo lo bloquea y lanza un error.
*/