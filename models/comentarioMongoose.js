import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
    idU: { type: Number, required: true }, 
    comment: { type: String, required: true },
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'comments' , versionKey: false });

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;