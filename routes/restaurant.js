let express     = require("express");
let router = express.Router();
let components  =  require("../models/components");


// Open a restaurants page.
router.get("/restaurant/:Id", function(req, res) {
    let restId = req.params.Id;
    components.findRestaurant(restId).then(function(foundRestaurant){
        res.render("restaurantPage", {restaurant:foundRestaurant, alertMsg:null});
    }).catch(function(err){
        res.render("restaurantPage", {restaurant: {name:"undefined"}, alertMsg:"ERROR: unable to access db, please try again later."});
        console.log("error: " + err);
    });
    
});


// Generate the add restaurants form page.
router.get("/restaurants/new", function(req,res){
    res.render("new");
});


// Add a new restaurant to db.
router.post("/restaurants", function(req,res){

    let newRestaurant = {name: req.body.name,
                        image:req.body.imageUrl,
                        description:req.body.description,
                        graders: 0,
                        totalGraders: 0,
                        tags: [],
                        location: req.body.location,
                        website: req.body.webUrl
    };
    
    components.createRestaurant(newRestaurant).then(function(restaurant){
        return components.logEvent(restaurant, "Restaurant.create", restaurant.name);
    }).then(function(){
        res.redirect("/");
    }).catch(function(err){
        console.log("error: " + err);
    });
    
});


module.exports = router;