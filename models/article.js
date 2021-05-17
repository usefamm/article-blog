const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
     
    }, 
    image:{
        type:String,
        default:""
    },
    text: {
        type: String,
        required: true,
        
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});



module.exports = mongoose.model('Article', ArticleSchema);