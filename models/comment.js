const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    article: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
    }
});



module.exports = mongoose.model('Comment', CommentSchema);