let express     = require("express");
let router      = express.Router();
let components  =  require("../models/components");


// Search restaurants by name or tag, re-render index
router.post("/restaurants/search", function(req, res) {
    if(req.body.searchType=="searchByName"){
        components.findRestaurantsByName(req.body.searchTarget).then(function(foundRestaurants){
            res.render("index", {restaurants:foundRestaurants, alertMsg: null});
        }).catch(function(err){
            res.render("index", {alertMsg:"ERROR: unable to access db, please try again later."});
            console.log("error: " + err);
        });
    }
    else if(req.body.searchType=="searchByTag"){
        components.findRestaurantsByTag(req.body.searchTarget).then(function(foundRestaurants){
            res.render("index", {restaurants:foundRestaurants, alertMsg: null});
        }).catch(function(err){
            res.render("index", {alertMsg:"ERROR: unable to access db, please try again later."});
            console.log("error: " + err);
        });
    }
});


// Add a grade to a restaurant, redirect to index
router.post("/restaurants/grade",function(req, res) {
    
    let grade = req.body.grade;
    let restId = req.body.restId;
    
    components.findRestaurant(restId).then(function(foundRestaurant){
        components.updateGrade(foundRestaurant,grade).then(function(){
            res.redirect("/");
        }).catch(function(err){
            res.render("index", {alertMsg:"ERROR: unable to access db, please try again later."});
            console.log("error: " + err);
        }).catch(function(err){
            res.render("index", {alertMsg:"ERROR: unable to access db, please try again later."});
            console.log("error: " + err);
        });
    });
});


// Add a review to a restaurant, redirect to restaurants page
router.post("/restaurant/review/", function(req, res) {
    let date = new Date();
    let dateFormatted = date.toLocaleTimeString() +" , "+date.toDateString(); 
    components.createReview(req.body.Name, req.body.review, dateFormatted).then(function(review){
        components.findRestaurant(req.body.restId).then(function(foundRestaurant){
            foundRestaurant.reviews.push(review);
            components.saveRestaurant(foundRestaurant).then(function(){
                components.logEvent(review, "Review.create", foundRestaurant._id).then(function(){
                    res.redirect("/restaurant/"+foundRestaurant._id);
                }).catch(function(err){
                    console.log("error: " + err);
                });
            }).catch(function(err){
                console.log("error: " + err);
            });
        }).catch(function(err){
            console.log("error: " + err);
        });
    }).catch(function(err){
        console.log("error: " + err);
    });
});


// Add a tag to a restaurant, redirect to restaurants page
router.post("/restaurant/tag/", function(req, res) {
    let newTag = req.body.newTag;
    let restId = req.body.restId;
    components.findRestaurant(restId).then(function(foundRestaurant){
        foundRestaurant.tags.push(newTag);
        components.saveRestaurant(foundRestaurant).then(function(){
            components.logEvent(foundRestaurant, "Restaurant.tag", newTag).then(function(){
                res.redirect("/restaurant/"+foundRestaurant._id);
            }).catch(function(err){
                console.log("error: " + err);
            });
        }).catch(function(err){
            console.log("error: " + err);
        });
    }).catch(function(err){
        console.log("error: " + err);
    });
});


module.exports = router;