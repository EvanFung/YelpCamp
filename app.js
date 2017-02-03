var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require('./seed');
var Comment = require('./models/comment');
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
                res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
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
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res) {
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
//===========================
// COMMENT ROUTES
//===========================
app.get('/campgrounds/:id/comments/new',function(req,res) {
    //find campground by id
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new',{campground:campground});
        }
    });
});

app.post('/campgrounds/:id/comments',function(req,res) {
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(req.body.comment);
            //create new comment
            Comment.create(req.body.comment,function(err,comment) {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
            
        }
    });
    //create new comment
    
    //connect new comment to campground
    
    //redirect to campground show page
});
app.listen(process.env.PORT,process.env.IP,function() {
    console.log("yelp camp server has started");
});