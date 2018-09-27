let express     = require("express");
let router      = express.Router();
let components  =  require("../models/components");


// Open map view in location (default: haifa)
router.get("/restaurants/map/:target", function(req,res){
    let target = req.params.target;
    let mapCenter = "haifa";
    if(target == "target") mapCenter = req.query.mapCenter;
    components.getRestaurants().then(function(restaurants) {
        let mapInfo = {
            restaurantsLocations: [],
            restaurantsImages: [],
            restaurantsIds: [],
            restaurantsNames: [],
            restaurantsTags: [],
            restaurantsGrades: [],
        };
        
        for(let i =0; i<restaurants.length; i++){
            mapInfo.restaurantsLocations.push(restaurants[i].location);
            mapInfo.restaurantsImages.push(restaurants[i].image);
            mapInfo.restaurantsIds.push(restaurants[i]._id);
            mapInfo.restaurantsNames.push(restaurants[i].name);
            mapInfo.restaurantsTags.push(restaurants[i].tags + ";");
            mapInfo.restaurantsGrades.push(restaurants[i].grade);
        }
        res.render("restaurantsMap", {
            restaurants:restaurants, 
            mapCenter: mapCenter,
            restaurantsLocations:mapInfo.restaurantsLocations,
            restaurantsImages:mapInfo.restaurantsImages,
            restaurantsIds:mapInfo.restaurantsIds,
            restaurantsNames: mapInfo.restaurantsNames,
            restaurantsTags: mapInfo.restaurantsTags,
            restaurantsGrades: mapInfo.restaurantsGrades,
            alertMsg: null
        });
    }).catch(function(err){
        res.render("restaurantsMap", {
                    restaurants:"", 
                    mapCenter: mapCenter,
                    restaurantsLocations:"",
                    restaurantsImages:"",
                    restaurantsIds:"",
                    restaurantsNames: "",
                    restaurantsTags: "",
                    restaurantsGrades: "",
                    alertMsg:"ERROR: unable to access db, please try again later."
        });
        console.log("error: " + err);
    });
    
  
});


module.exports = router;