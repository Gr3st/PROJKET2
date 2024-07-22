const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schemat dla użytkowników
const userSchema = new Schema({
    imie: {type: String, required: true},
    nazwisko: {type: String, required: true},
    email: {type: String, required: true},
    id: {type: String, required: true, unique: true},
    cena: {type: Number, required: true},  // Zmiana typu na Number dla lepszego przetwarzania cen
    entryDate: {type: Date, default: Date.now},
    exitDate: {type: Date},  // Data wyjścia
    countdown: {type: Number, required: true}  // countdown in seconds
});

// Schemat dla administratorów
const adminSchema = new Schema({
    imie: {type: String, required: true},
    nazwisko: {type: String, required: true},
    email: {type: String, required: true},
    entryDate: {type: Date, default: Date.now},
});

// Schemat dla cen
const cenaSchema = new Schema({
    timeRange: {type: String, required: true},  // Zakres czasu np. "30 minut", "1 godzina"
    cena: {type: String, required: true},  // Cena za dany zakres czasu
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
