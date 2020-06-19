var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');
const validator = require('express-validator');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {

    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_genres) {
    if (err) { 
        return next(err);
    }
    res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function(callback){
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback){
            Book.find({'genre': req.params.id}).exec(callback);
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.genre == null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.render('genre_form', {title: 'Create genre'});
};

// Handle Genre create on POST.
// Array instead of single middleware function, therefore there are "," instead of ";"
exports.genre_create_post = [

    // validation
    validator.body('name', 'Genre name required').trim().isLength({min:1}),
    validator.body('name').escape(),

    (req, res, next) => {
        // extract vaildation errors from request
        const errors = validator.validationResult(req);
        
        // crate new genre object
        var genre = new Genre({
            name: req.body.name
        });

        if (!errors.isEmpty()) {    // data not valid
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }
        else { // data valid
            Genre.findOne({'name': new RegExp('^' +req.body.name + '$', 'i')}).exec(function(err, found_genre) {
                if(err) {
                    return next(err);
                }

                if (found_genre) {
                    res.redirect(found_genre.url);
                }
                else {
                    genre.save(function(err){
                        if (err) {
                            return next(err);
                        }
                        res.redirect(genre.url);
                    });
                }
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};