let express         = require("express"),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose");


let indexRoutes     = require("./routes/index"),
    feedRoutes      = require("./routes/feed"),
    mapRoutes       = require("./routes/map"),
    restaurantRoutes= require("./routes/restaurant"),
    actionsRoutes   = require("./routes/actions");

// Local db for development => 
////mongoose.connect("mongodb://localhost:27017/rest_view", { useNewUrlParser: true });
// Hosted db for deployment => 
mongoose.connect("mongodb://restviewdev:restviewdev1@ds115533.mlab.com:15533/restview", { useNewUrlParser: true });

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(feedRoutes);
app.use(mapRoutes);
app.use(restaurantRoutes);
app.use(actionsRoutes);
app.use(indexRoutes);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
  console.log('Promise rejection: ' + promise);
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started: "); 
   console.log("-Port =  " + process.env.PORT); 
   console.log("-IP =  " + process.env.IP); 
});