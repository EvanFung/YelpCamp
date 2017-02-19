var Campground = require("../models/campground");
var Comment = require('../models/comment');
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req,res,next) {
    //is user logged in 
        if(req.isAuthenticated()) {
                Campground.findById(req.params.id,function(err,foundCampground) {
                if(err) {
                    res.redirect('back');
                } else {
                    //does user own the camground?
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error','you dont have permission to do that');
                        res.redirect('back');
                    }
                }
            });
        } else {
            req.flash('error','you need to log in to do that');
            res.redirect('back');
        }
}

middlewareObj.checkCommentOwnership = function (req,res,next) {
    //is user logged in 
        if(req.isAuthenticated()) {
                Comment.findById(req.params.comment_id,function(err,foundComment) {
                if(err) {
                    req.flash('error','campground not found');
                    res.redirect('back');
                } else {
                    //does user own the camground?
                    if(foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error','you dont have permission to do that');
                        res.redirect('back');
                    }
                }
            });
        } else {
            req.flash('error','You need to login to do that');
            res.redirect('back');
        }
}

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }else {
        req.flash('error','please login first');
        res.redirect('/login');
    }

}

module.exports = middlewareObj;