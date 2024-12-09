/*
const mongoose = require('mongoose');
const FormDataSchema = new mongoose.Schema({
    user_email:String,

    title: String,
    description: String,
    une: Number,
    latitude: Number,
    longitude: Number,
    
})
*/

const mongoose = require("mongoose");
const FormDataSchema = new mongoose.Schema({
    email: String,
    title: String,
    description: String,
    une: Number,
    latitude: Number,
    longitude: Number,
    images: [String],
    zaalnii_bolomjuud: [String],
});

const FormDataModel1 = mongoose.model("job_details", FormDataSchema); //Энэ хэсэгт Collection нэрийг зааж өгнө

module.exports = FormDataModel1; //  <---   Export хийснээр өөр кодонд ашиглах боломжтой болно