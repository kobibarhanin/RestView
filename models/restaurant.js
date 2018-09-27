let mongoose = require("mongoose");

let restSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    website: String,
    grade: Number,
    graders: Number,
    totalGraders: Number,
    tags: [String],
    location: String,
    reviews:[{type: mongoose.Schema.Types.ObjectId, ref:"Review"}]
});

module.exports = mongoose.model("Restaurant", restSchema);