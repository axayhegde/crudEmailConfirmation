var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    customerEmail: { type: String, required: true,unique:true },
    customerToken: { type: String, required: true},
    customerVerified: { type: Boolean}


});

module.exports = mongoose.model('Customer',customerSchema);