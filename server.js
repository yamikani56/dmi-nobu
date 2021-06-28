let express = require('express')
let path = require('path')
let mongoose = require('mongoose')
let bodyParser = require('body-parser')
let session = require('express-session')
let expressValidator = require('express-validator')
let fileUpload = require('express-fileupload')
var passport = require('passport');
let morgan = require('morgan')
// mongodb+srv://yamikani:YaMikani56.@dmi-nobu.ny83m.mongodb.net/my_database?retryWrites=true&w=majority
    // connect to database
    mongoose.connect('mongodb://localhost:27017/my_database',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{

        console.log('Mongodb connected!!')
    })
 
// setting a port to listen to
let port = process.env.PORT || 4000

// initializing app
let app = express()

// log request
app.use(morgan('short'))

// setting views and view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

    // setting public folders
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname,'public/images')))
app.use('/css', express.static(path.join(__dirname, './public/css')))
app.use('/boxicons',express.static(path.join(__dirname,'./node_modules/boxicons/css')))
app.use('/jquery',express.static(path.join(__dirname,'./node_modules/jquery/dist/')))
app.use('/js',express.static(path.join(__dirname,'./public/js/')))
app.use('/ck',express.static(path.join(__dirname,'./node_modules/@ckeditor/ckeditor5-build-classic/build/')))

// setting global errors variables
app.locals.errors = null;
// Get Page Model
var Page = require('./models/page');

// Get all pages to pass to header.ejs
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});
// Get Category Model
var Category = require('./models/categories');

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});

// express file middle ware
app.use(fileUpload())

// body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
    // express session
app.use(session({
        secret: 'key secret',
        resave: true,
        saveUninitialized: true,
        // cookie: { secure: true }
    }))
// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.gif';
                default:
                    return false;
            }
        }
    }
}));
    // express messages middleware
app.use(require('connect-flash')())
app.use((req, res, next) => {
        res.locals.messages = require('express-messages')(req, res)
        next()
    })

// Passport Config
require('./config/passport')(passport);
    // Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

    app.get('*', function(req,res,next) {
        res.locals.cart = req.session.cart;
        res.locals.user = req.user || null;
        next();
     });
    // setting routes
var products = require('./routes/products');
var cart = require('./routes/cart.js');
var users = require('./routes/users.js');

let adminProducts = require('./routes/admin_products')
let routes = require('./routes/page')
let adminPages = require('./routes/admin_pages')
let adminCategories = require('./routes/admin_categories')
app.use('/', routes)
app.use('/users', users);
app.use('/cart', cart);
app.use('/products', products);
app.use('/admin/pages', adminPages)
app.use('/admin/categories', adminCategories)
app.use('/admin/products',adminProducts)
app.listen(port, () => console.log(`Server is running on localhost: ${port }`))