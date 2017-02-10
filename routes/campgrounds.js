var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
router.get("/",function(req,res) {
    //get all campgrounds from DB 
    Campground.find({},function(err,allCampgrounds) {
            if(err) {
                console.log(err);
            } else {
                res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
            }
    });
});

router.post("/",function(req,res) {
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
router.get("/new",function(req,res) {
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res) {
    //find the campground with providing id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});
//=================
module.exports = router;