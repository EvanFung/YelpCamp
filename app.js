var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require('./seed');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var Comment = require('./models/comment');
// var commentRoutes = require('./routes/comments');
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));



//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret:"Hello World",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    next();
});

//INDEX ROUTES
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
// COMMENTs ROUTES
//===========================
app.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res) {
    //find campground by id
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new',{campground:campground});
        }
    });
});

app.post('/campgrounds/:id/comments',isLoggedIn,function(req,res) {
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

});


//===========
//AUTH ROUTES
//===========

//show the register form
app.get('/register',function(req,res) {
    res.render('register');
});

//handle sign up logic
app.post('/register',function(req,res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user) {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function() {
            res.redirect('/campgrounds');
        });
    });
});

//show login form
app.get('/login',function(req,res) {
    res.render('login');
});

//handle login logic
app.post('/login',passport.authenticate('local',{
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req,res) {
    
});

//logout route
app.get('/logout',function(req,res) {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};
app.listen(process.env.PORT,process.env.IP,function() {
    console.log("yelp camp server has started");
});