const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session);
const exphbs = require('express-handlebars')
const passport = require('passport')

// Dotenv
require('dotenv').config()

// Google OAouth api
require('./config/passport')(passport)
//  Express middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // parse
app.use(express.static(path.join(__dirname, 'public')))

// Express Handlebars
app.set('view engine', 'hbs')
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    layoutsDir: 'views/layouts',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('views', path.join(__dirname, 'views'))

// Connect mongoStore 
const store = new MongoDBStore({
    uri: process.env.MONGO_URI + 'connect_mongodb',
    collection: 'mySessions'
});

// Connect MONGODB
async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, (err) => {
            if (err) throw new Error

            console.log('MongoDB connected...');
        })
    } catch (error) {
        console.error(error);
    }
}

// Middleware functions
app.use(morgan('dev'))
app.use(helmet())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store
}))

const port = normalizePort(process.env.PORT || '3000')

app.set('port', port)

app.listen(port, () => {
    console.log('Server working on port', port);
})

start()

// app.use(passport.initialize());
// app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

// Routes
app.use('/', (req, res) => {
    res.render('login', {
        layout: 'login',
        title: 'Login'
    })
})

function normalizePort(val) {
    let port = parseInt(val, 10)

    if (isNaN(port)) {
        // demak port not a number ekan // uni o'zini qaytaramiz
        return val
    }

    if (port >= 0) {
        // demak port number ekan
        return port
    }

    return false
}