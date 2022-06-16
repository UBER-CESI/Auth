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
    id: "1",
    email: "FinalUser@gmail.com",
    nickname: "Marcus",
    firstname: "Marcus",
    lastname: "BELMONT",
    password: " ",
    type: Models.UserType.Customer,
    phoneNumber: "+33625456984"
};

const DelivererUser: Models.User = {
    id: "2",
    email: "Deliverer@gmail.com",
    nickname: "François",
    firstname: "François",
    lastname: "PIGNON",
    password: " ",
    type: Models.UserType.Deliverer,
    phoneNumber: "+33625456984"
}
const AdminUser: Models.User = {
    id: "3",
    email: "a@a",
    nickname: "admin",
    firstname: "admin",
    lastname: "admin",
    password: " ",
    type: Models.UserType.Admin,
    phoneNumber: "+33625456984",
    idType: "megauser",
    suspendedAt: ""
}


const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});





app.use(session({
    secret: 'X5ix1MylhUTBWRU',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000000 }, // in miliseconds
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

require('./routes')(app);

app.get('/', (req, res) => {

    var sess = req.session;
    if (sess.username) {
        return res.redirect('/admin');
    }
    res.render('index.ejs');
});

app.post('/login', (req, res) => {
    if (FinalUser.email === req.body.email && FinalUser.password === req.body.password) {
        res.json(InstanciateSession(FinalUser, req.session));
        console.log(Date.now().toString() + " | " + FinalUser.id);

    } else {
        if (DelivererUser.email === req.body.email && DelivererUser.password === req.body.password) {
            var ret: Models.UserWoPasswd = InstanciateSession(DelivererUser, req.session)
            res.json(ret);
            console.log(Date.now().toString() + " | " + DelivererUser.id);

        } else {
            if (AdminUser.email === req.body.email && AdminUser.password === req.body.password) {
                var ret: Models.UserWoPasswd = InstanciateSession(AdminUser, req.session)
                res.json(ret);
                console.log(ret)
            } else {
                res.status(404).send('wrong id');

            }

        }
    }

});




app.get('/login/canDoHoolaHoop', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        const ability = new Ability(sess.rules);
        res.send(ability.can('do', 'hoola-hoop'));
    } else {
        res.send("notConnected");
    }
})
app.get('/login/canDoBetterHoolaHoop', (req, res) => {
    var sess = req.session;
    if (sess.username) {
        const ability = new Ability(sess.rules);
        res.send(ability.can('do', 'better hoola-hoop'));
    } else {
        res.send("notConnected");
    }
})
app.get('/login/getMySessionUsername', (req, res) => {
    var sess = req.session;
    if (sess.email) {
        res.send(sess.nickname);
    } else {
        res.send("notConnected");
    }
})
app.post('/getUserFromSession', (req, res) => {
    var sess = req.session;
    if (sess.email) {
        res.json(getUserFromSession(req.session));
    } else {
        res.send("notConnected");
    }
})
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.status(200).json()
    });
});






function InstanciateSession(user: Models.User, sess): Models.UserWoPasswd {

    sess.nickname = user.nickname;
    sess.firstname = user.nickname;
    sess.lastname = user.lastname;
    sess.email = user.email;
    sess.phoneNumber = user.phoneNumber;
    sess.userId = user.id;
    sess.type = user.type;
    sess.suspendedAt = user.suspendedAt;

    sess.rules = Abilities.GetRulesFor(user);
    return getUserFromSession(sess);


}
function getUserFromSession(session): Models.UserWoPasswd {
    return {
        userId: session.userId,
        nickname: session.nickname,
        firstname: session.firstname,
        lastname: session.lastname,
        email: session.email,
        phoneNumber: session.phoneNumber,
        type: session.type,
        idType: session.idType,
        suspendedAt: session.suspendedAt
    }
}
export default {
    async spawn() { },
    stop() {
        server.close();

    },
};

