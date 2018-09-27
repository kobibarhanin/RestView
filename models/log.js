let mongoose = require("mongoose");

let logSchema = mongoose.Schema({
    Time: Date, 
    Type: String, 
    pointer: String,
    additional: String
});

module.exports = mongoose.model("Log", logSchema);