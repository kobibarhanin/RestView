let express     = require("express");
let router      = express.Router();
let components  =  require("../models/components");


// Open the home page with top 10 restaurants.
router.get("/", function(req,res){
    components.getRestaurants("top").then(function(topRestaurants) {
        res.render("index", {restaurants:topRestaurants, alertMsg: null});
    }).catch(function(err){
        res.render("index", {alertMsg:"ERROR: unable to access db, please try again later."});
        console.log("error: " + err);
    });
});


// Open the about page
router.get("/about", function(req, res) {
    res.render("about");
});


// Indicates unused route
router.get("/*", function(req,res){
    res.send("Sorry! no one's here..:)");
});


module.exports = router;