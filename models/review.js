let mongoose = require("mongoose");

let reviewSchema = mongoose.Schema({
    Name: String, 
    Body: String, 
    Time: String
});

module.exports = mongoose.model("Review", reviewSchema);