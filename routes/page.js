var express = require('express');
var router = express.Router();

// Get Page model
var Page = require('../models/page');

/*
 * GET /
 */
router.get('/', function (req, res) {
    
    Page.findOne({slug: 'home'}, function (err, page) {
        if (err)
            console.log(err);

        res.render('restarantsite', {
            title: page.title,
            content: page.content
        });
    });
    
});

/*
 * GET /prices
 */
router.get('/price', function (req, res) {
        res.render('pricing-table-with-js-toggle')
})
/*
 * GET a page
 */
router.get('/:slug', function (req, res) {

    var slug = req.params.slug;

    Page.findOne({slug: slug}, function (err, page) {
        if (err)
            console.log(err);
        
        if (!page) {
            res.redirect('/');
        } else {
            res.render('restarantsite ', {
                title: page.title,
                content: page.content
            });
        }
    });

    
});

// Exports
module.exports = router;


