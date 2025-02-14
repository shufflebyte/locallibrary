var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');
const { body, validationResult} = require('express-validator');

function isGermanDate(value) {
    //todo: is this ok this way? or should this only return true/false and become sanitized in another func?
    if (!value.match(/^\d{2}.\d{2}.\d{4}$/)) return false;
    
    var parts = value.match(/(\d+)/g);

    //new Date(year, month, day); month is 0-based, therefore -1
    const date = new Date(parts[2], parts[1]-1, parts[0]);
    return date;
}


// Display list of all Authors.
exports.author_list = function(req, res, next) {

    Author.find()
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_authors) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('author_list', { title: 'Author List', author_list: list_authors });
      });
  };

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback);
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id },'title summary')
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );

    });
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.render('author_form', {title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [
    // validation
    body('first_name').isLength({min: 1}).trim().withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name has non-alphabnumeric characters'),

    body('family_name').isLength({min: 1}).trim().withMessage('First name must be specified')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters'),

    // optional fields (not required fields)
    // checkFalsy: true -> empty and null is also accepted
    //body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).custom(isGermanDate).withMessage('Please use german date format: dd.mm.yyyy'),
    //body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).custom(isGermanDate).withMessage('Please use german date format: dd.mm.yyyy'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

    // sanitization
    body('first_name').escape(),
    body('family_name').escape(),
    body('date_of_birth').toDate(),
    body('date_of_death').toDate(),

    // do the database part
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
        }
        else {
            // data from form is valid
            var author = new Author(
             {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function(err){
                if(err) { return next(err);}
                res.redirect(author.url);
            });

        }
    }
];

    // Display Author delete form on GET.
exports.author_delete_get = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });

};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res, next) {

    async.parallel({
        author: function(callback) {
          Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/authors')
            })
        }
    });
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};