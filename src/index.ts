import { Server } from "http";
import * as Models from "./Models";
import * as Abilities from './AbilitiesManager'
import { Ability } from "@casl/ability";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const app = express();

const FinalUser: Models.User = {
    id: 1,
    email: "FinalUser@gmail.com",
    username: "Marcus",
    password: " ",
    type: Models.UserType.FinalUser
};

const DelivererUser: Models.User = {
    id: 2,
    email: "Deliverer@gmail.com",
    username: "François",
    password: " ",
    type: Models.UserType.Deliverer
}

const OrderPH: Models.Order = {
    id: 1,
    idOwner: 1,
    idDeliverer: 2,
    idRestaurant: 0,
    status: Models.OrderStatus.Payed
}
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
    if (FinalUser.email === req.body.email && FinalUser.password === req.body.password) {
        InstanciateSession(FinalUser, req.session);
        console.log(req.session.username);


    } else {
        if (DelivererUser.email === req.body.email && DelivererUser.password === req.body.password) {
            InstanciateSession(DelivererUser, req.session);
            console.log(req.session.username);

        } else {
            res.render('wrongId.ejs');
            return;
        }
    }
    const ability = new Ability(req.session.rules);

    res.render('AlreadyLoggedIn.ejs', {
        name: req.session.username,
        type: req.session.type,
        canHoolaHoop: ability.can('do', 'hoola-hoop'),
        canBetterHoolaHoop: ability.can('do', 'better hoola-hoop')
    });


});
app.get('/login', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        const ability = new Ability(req.session.rules);
        res.render('AlreadyLoggedIn.ejs', {
            name: req.session.username,
            type: req.session.type,
            canHoolaHoop: ability.can('do', 'hoola-hoop'),
            canBetterHoolaHoop: ability.can('do', 'better hoola-hoop')
        });
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






function InstanciateSession(user: Models.User, sess) {

    sess.username = user.username;
    sess.password = bcrypt.hash(user.password, 10);
    sess.type = user.type;
    sess.rules = Abilities.GetRulesFor(user);
    console.log(sess.rules)
}
export default {
    async spawn() { },
    stop() {
        server.close();

    },
};

