const { Schema } = require("mongoose");

// schema of the bling data
const pedidosSchema = new Schema({
    numero: Number,
    data: Date,
    data_inc: {type: Date, default: Date.now },
    valor: Number
});

module.exports = pedidosSchema;