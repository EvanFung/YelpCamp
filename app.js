var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require('./seed');
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


app.get("/",function(req,res) {
    res.render("landing");
});

app.get("/campgrounds",function(req,res) {
    //get all campgrounds from DB 
    Campground.find({},function(err,allCampgrounds) {
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds",{campgrounds:allCampgrounds});
            }
    });
    //render
    
});

app.post("/campgrounds",function(req,res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name,image:image,description:description};
    Campground.create(newCampground,function(err,campground) {
            if(err) {
                console.log(err);
            } else {
                console.log("NEWLY CREATE CAMP");
                console.log(campground);
            }
        });
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});
//NEW -  show form to create new campground
app.get("/campgrounds/new",function(req,res) {
    res.render("new");
});

app.get("/campgrounds/:id",function(req,res) {
    //find the campground with providing id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("show",{campground:foundCampground});
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function() {
    console.log("yelp camp server has started");
});