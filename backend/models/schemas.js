const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    imie: {type:String, required: true},
    nazwisko: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    id: {type:String, required: true, unique: true},
    entryDate: {type:Date, default:Date.now}
})

const Users = mongoose.model('Users',userSchema,'users');
const mySchemas = {'Users':Users}

module.exports = mySchemas;