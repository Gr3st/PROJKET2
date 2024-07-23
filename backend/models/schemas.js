const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schemat dla użytkowników
const userSchema = new Schema({
    imie: { type: String, required: true },
    nazwisko: { type: String, required: true },
    email: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    cena: { type: Number, required: true },
    entryDate: { type: Date, default: Date.now },
    exitDate: { type: Date },
    countdown: { type: Number, required: true },
    elapsedTime: { type: Number, default: 0 }  // Elapsed time in seconds
  });
  

// userSchema.methods.updateExitDate = function() {
//     if (this.countdown > 0) {
//         this.exitDate = new Date(Date.now() + this.countdown * 1000);
//     }
// };

  
// Schemat dla administratorów
const adminSchema = new Schema({
    imie: { type: String, required: true },
    nazwisko: { type: String, required: true },
    email: { type: String, required: true },
    entryDate: { type: Date, default: Date.now },
});

// Schemat dla cen
const cenaSchema = new Schema({
    timeRange: { type: String, required: true },
    cena: { type: String, required: true },
});

const Users = mongoose.model('Users', userSchema, 'users');
const Admins = mongoose.model('Admins', adminSchema, 'admins');
const Ceny = mongoose.model('Ceny', cenaSchema, 'ceny');

const mySchemas = {
    Users: Users,
    Admins: Admins,
    Ceny: Ceny
};

module.exports = mySchemas;
