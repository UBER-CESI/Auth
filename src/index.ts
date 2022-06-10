const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

// global session, NOT recommended

app.get('/', (req, res) => {
    var sess = req.session;
    if (sess.email) {
        return res.redirect('/admin');
    }
    res.render('index.ejs');
});

app.post('/login', (req, res) => {
    var sess = req.session;
    sess.email = req.body.name;
    sess.password = req.body.password;
    res.render('AlreadyLoggedIn.ejs', { name: req.session.email });
});
app.get('/login', (req, res) => {
    var sess = req.session;
    if (sess.email) {
        res.render('AlreadyLoggedIn.ejs', { name: req.session.email })
    } else {
        res.render('Login.ejs');
    }

})


app.get('/admin', (req, res) => {
    var sess = req.session;
    if (sess.email) {
        res.write(`<h1>Hello ${sess.email} h1><br>`);
        res.end('' + '>Logout');
    }
    else {
        res.write('Please login first.');
        res.end('' + '>Login');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});



app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});