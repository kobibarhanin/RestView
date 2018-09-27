let express     = require("express");
let router = express.Router();
let components  =  require("../models/components");


// Generate the current feed from the log collection
router.get("/feed", function(req,res){
    new Promise (function(resolve,reject){
        let feedItems = [];
        let promiseArray = [];
        components.getLogEvents().then(function(logEvents){
            logEvents.forEach(function(event, i){
                let promise = components.buildFeedEvent(event,feedItems);
                promiseArray.push(promise);
            });
            Promise.all(promiseArray).then(function(){
                resolve(feedItems);
            });
        }).catch(function(err){
            res.render("feed", {alertMsg:"ERROR: unable to access db, please try again later."});
            console.log("error: " + err);
        });
    }).then(function(feedItems){
        feedItems.sort(components.sortFunc);
        feedItems = feedItems.splice(0,40);
        res.render("feed", {feedItems:feedItems, alertMsg: null});
    }).catch(function(err){
        res.render("feed", {alertMsg:"ERROR: unable to access db, please try again later."});
        console.log("error: " + err);
    });
});


module.exports = router;