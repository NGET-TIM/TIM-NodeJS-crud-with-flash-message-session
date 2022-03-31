var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
const express = require('express');
const app = express();
const port = 2000;
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
// set using ejs
app.set('view engine', 'ejs');
// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
// express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// passport init
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('Hello From NodeJS Express Framework');
});

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    /* MySQL User */
    password: '',
    /* MySQL Password */
    database: 'node_restapi' /* MySQL Database */
});
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected with App...');
});


/**
 * Get All Items
 *
 * @return response()
 */
app.get('/api/items', (req, res) => {
    let sqlQuery = "SELECT * FROM items";

    let query = conn.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

app.get('/api/item/add', (req, res) => {
    res.render('items/add', { title: 'Add New Item', message: '' });
});
app.post('/api/item/add', (req, res) => {
    const inputData = { title: req.body.title, body: req.body.body };
    var getMessage = "";
    if (inputData.title == '' || inputData.body == '') {
        req.flash('info', 'Please validate your input');
        res.render('items/add', { title: 'Error your input data', message: req.flash('info') });
    } else {
        const sqlQuery = `INSERT INTO ITEMS SET ?`;
        conn.query(sqlQuery, inputData, (err, results) => {
            if (err) throw err;
            res.redirect('back');
        });
    }

});
/**
 * Get Single Item
 *
 * @return response()
 */
app.get('/api/items/:id', (req, res) => {
    let sqlQuery = "SELECT * FROM items WHERE id=" + req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * Create New Item
 *
 * @return response()
 */
app.post('/api/items', (req, res) => {
    let data = { title: req.body.title, body: req.body.body };

    let sqlQuery = "INSERT INTO items SET ?";

    let query = conn.query(sqlQuery, data, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * Update Item
 *
 * @return response()
 */
app.put('/api/items/:id', (req, res) => {
    let sqlQuery = "UPDATE items SET title='" + req.body.title + "', body='" + req.body.body + "' WHERE id=" + req.params.id;

    let query = conn.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * Delete Item
 *
 * @return response()
 */
app.delete('/api/items/:id', (req, res) => {
    let sqlQuery = "DELETE FROM items WHERE id=" + req.params.id + "";

    let query = conn.query(sqlQuery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results) {
    return JSON.stringify({ "status": 200, "error": null, "response": results });
}


app.listen(port, () => {
    console.log('App Started With Port: localhost:' + port);
});