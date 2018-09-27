let Restaurant = require("../models/restaurant");
let Review = require("../models/review");
let Log = require("../models/log");

module.exports = {
    
    getRestaurants: function (type) {
        return new Promise (function(resolve,reject) {
            Restaurant.find({}).sort({grade: -1}).populate("reviews").exec(function(err, restaurants) {
                if(err){
                    reject(err);
                }
                else {
                    // reject("error"); // USE TO SIMULATE ERROR
                    // take only the top 10 restaurants
                    if(type=="top") restaurants = restaurants.splice(0,10);
                    resolve(restaurants);
                }   
            });
        });
    },
    findRestaurant: function(restId){
        return new Promise (function(resolve,reject) {
            Restaurant.findOne({ _id:restId }).populate("reviews").exec(function(err,foundRestaurant){
                if(err){                                        // reject("error"); // USE TO SIMULATE ERROR
                    reject(err);
                }
                else{
                    // reject("error"); // USE TO SIMULATE ERROR
                    resolve(foundRestaurant);
                }
            });
        });
    },
    findRestaurantsByName: function(name){
        return new Promise (function(resolve,reject) {
            // Enable partial case-insensitive search 
            let nameRegex = new RegExp(name.toLowerCase(), 'i');
            Restaurant.find({name:nameRegex}).sort({grade: -1}).exec(function(err,foundRestaurants){
                if(err){
                    reject(err);
                }
                else{
                    // reject("error"); // USE TO SIMULATE ERROR
                    resolve(foundRestaurants);
                }
            });
        });
    },
    findRestaurantsByTag: function(tagTarget){
        return new Promise (function(resolve,reject) {
            Restaurant.find({}).sort({grade: -1}).exec(function(err,foundRestaurants){
                if(err){
                    reject(err);
                }
                else{
                    // reject("error"); // USE TO SIMULATE ERROR
                    var relevantResuarants = [];
                    foundRestaurants.forEach(function(restuarant){
                        restuarant.tags.forEach(function(tag){
                            if(tag==tagTarget) {
                                relevantResuarants.push(restuarant);
                            }
                        });
                    });
                    resolve(relevantResuarants);
                }
            });   
        });
    },
    createRestaurant: function(newRestaurant){
        newRestaurant.location = newRestaurant.location.replace(/,/g, ' ');
        return new Promise (function(resolve,reject) {
            Restaurant.create(newRestaurant,function(err,restaurant){
                if(err){
                    reject(err);
                }
                else{
                    resolve(restaurant);
                }
            });
        });
    },
    saveRestaurant: function(restaurant){
        return new Promise (function(resolve,reject) {
            restaurant.save(function(err,data){
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }                
            });
        });
    },
    createReview: function(name, body, time){
        return new Promise (function(resolve,reject) {
            Review.create({Name: name, Body: body, Time: time}, function(err, review){
                if(err){
                    reject(err);
                }
                else{
                    resolve(review);
                }
            });
        });
    },
    findReview: function(reviewId){
        return new Promise (function(resolve,reject) {
            Review.findOne({ _id: event.pointer}, function(err,foundReview){
                if(err){
                    reject(err);
                }
                else{
                    resolve(foundReview);
                }
            });
        });
    },
    logEvent: function(event, type, addInfo){
        return new Promise (function(resolve,reject) {
            let logEvent = {
                    Time: new Date, 
                    Type: type, 
                    pointer: event._id,
                    additional: addInfo 
            }
            
            Log.create(logEvent, function(err, event){
               if(err){
                    reject(err);
               } 
               else{
                    resolve();
               }
            });
        });
    },
    updateGrade: function(restaurant, grade){
        return new Promise (function(resolve,reject) {
        let graders=restaurant.graders;
        let totalGrade=restaurant.totalGraders;
        graders+=1;
        totalGrade+=parseFloat(grade);
        let newGrade = totalGrade/graders;
            Restaurant.update(  {"_id":restaurant._id}, 
                                {"$set":{"grade":newGrade, "graders":graders, "totalGraders": totalGrade}},
                                function(err,success){
                if(err){
                    reject(err);
                }
                else{
                    // reject("error"); // USE TO SIMULATE ERROR
                    resolve();
                }
            });
        });
    },
    getLogEvents: function () {
        return new Promise (function(resolve,reject) {
            Log.find({}, function(err,logEvents){
                if(err){
                    reject(err);
                }
                else{
                    // reject("error"); // USE TO SIMULATE ERROR
                    resolve(logEvents);
                }   
            });
        });
    },
    buildFeedEvent: function (event,feedItems) {
        return new Promise (function(resolve,reject) {
            if (event.Type =="Restaurant.create" || event.Type =="Restaurant.tag" ){
                Restaurant.findOne({ _id:event.pointer }).populate("reviews").exec(function(err,foundRest){
                    if(err){
                        console.log(err);
                    }
                    else{
                        let eventTemp = {
                            realTime: event.Time,
                            Time: event.Time.toLocaleTimeString()+ " , " +event.Time.toDateString(),
                            Type: event.Type,
                            Item: foundRest,
                            additional: event.additional
                        };
                        feedItems.push(eventTemp);
                        resolve();    
                    }
                });
            }
            else if (event.Type=="Review.create"){
                    Review.findOne({ _id: event.pointer}, function(err,foundReview){
                    if(err){
                      console.log("Error in: Log.find > Review.findOne");
                      console.log(err);
                    }
                    else{
                        Restaurant.findOne({ _id: event.additional}, function(err,foundRest){
                            if(err){
                                console.log("Error in: Log.find > Review.findOne > Restaurant.findOne");
                                console.log(err);
                            }
                            else{
                                let eventTemp = {
                                    realTime: event.Time,
                                    Time:event.Time.toLocaleTimeString()+" , "+event.Time.toDateString(),
                                    Type: event.Type,
                                    Item: foundReview,
                                    Additional: foundRest,
                                };
                                feedItems.push(eventTemp);
                                resolve();    
                            }
                        });
                    }
                });
            }
            
        });
    },
    sortFunc: function(a, b) {
        let keyA = new Date(a.realTime),
            keyB = new Date(b.realTime);
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
    },

};
