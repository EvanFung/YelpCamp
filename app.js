var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var campgrounds = [
        {
            name:"Salmon Creek",
            image: "https://static1.squarespace.com/static/54f382d7e4b09389aa3b9d1e/t/558ad07de4b0e9f43df1e5bc/1435160712911/Great+Camp+Sagamore-8370.jpg?format=1500w"
        },
        {
            name:"Granite Hill",
            image: "https://static1.squarespace.com/static/5351ebf2e4b095a1b0b444a8/t/53520dc7e4b02e672cf1d72a/1397886408761/phoot+camp?format=1000w"
        },
        {
            name:"Mountain Goat & Rest",
            image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT803pDaiPAPR5r2SdcL9XHdw2lSCpmdwE7GX5u7tPg-IEAibyh"
        },
        {
            name:"Mountain Goat & Rest",
            image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT803pDaiPAPR5r2SdcL9XHdw2lSCpmdwE7GX5u7tPg-IEAibyh"
        },
        {
            name:"Mountain Goat & Rest",
            image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT803pDaiPAPR5r2SdcL9XHdw2lSCpmdwE7GX5u7tPg-IEAibyh"
        },
        {
            name:"Mountain Goat & Rest",
            image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT803pDaiPAPR5r2SdcL9XHdw2lSCpmdwE7GX5u7tPg-IEAibyh"
        },
        {
            name:"Mountain Goat & Rest",
            image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT803pDaiPAPR5r2SdcL9XHdw2lSCpmdwE7GX5u7tPg-IEAibyh"
        },
        {
            name:"Mountain Goat & Rest",
            image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT803pDaiPAPR5r2SdcL9XHdw2lSCpmdwE7GX5u7tPg-IEAibyh"
        }
    ];
app.set("view engine","ejs");

app.get("/",function(req,res) {
    res.render("landing");
});

app.get("/campgrounds",function(req,res) {
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res) {
    res.render("new");
});
app.listen(process.env.PORT,process.env.IP,function() {
    console.log("yelp camp server has started");
});