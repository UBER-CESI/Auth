import { Server } from "http";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});





app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 10000 }, // in miliseconds
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));



app.get('/', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        return res.redirect('/admin');
    }
    res.render('index.ejs');
});

app.post('/login', (req, res) => {
    InstanciateSession(req.session, req.body.name, req.body.password);
    console.log(req.session.username);
    res.render('AlreadyLoggedIn.ejs', { name: req.session.username });
});
app.get('/login', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        res.render('AlreadyLoggedIn.ejs', { name: sess.username })
    } else {
        res.render('Login.ejs');
    }

})


app.get('/admin', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        res.write(`<h1>Hello ${sess.username} h1><br>`);
        res.end('' + '>Logout');
    }
    else {
        res.write('Please login first.');
        res.end('' + '>Login');
    }
});

app.get('/login/getMySessionUsername', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        res.send(sess.username);
    } else {
        res.send("notConnected");
    }
})
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});






function InstanciateSession(sess, username, password) {
    sess.username = username;
    sess.password = bcrypt.hash(password, 10);
}
export default {
    async spawn() { },
    stop() {
        server.close();

    },
};

