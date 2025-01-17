const {Schema, model} = require('mongoose')

const booksSchema = new Schema({
    id: { 
        type: String, 
        required: true 
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    favorite: {
        type: String,
        default: "",
    },
    fileCover: {
        type: String,
        default: "",
    },
    fileName: {
        type: String,
        default: "",
    }
})

module.exports = model('Books', todoSchema)